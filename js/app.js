import { db, auth } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    doc, 
    query, 
    where, 
    orderBy, 
    limit,
    increment,
    serverTimestamp,
    onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { 
    signInAnonymously, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

class SocialTruthApp {
    constructor() {
        this.connectedWallet = null;
        this.currentFilter = 'all';
        this.currentVoteNewsId = null;
        this.newsData = [];
        this.leaderboardData = [];
        this.stats = {
            totalNews: 0,
            totalVotes: 0,
            activeUsers: 0
        };
        
        this.init();
    }

    async init() {
        // Initialize Firebase Auth
        await this.initAuth();
        
        // Load data from Firebase
        await this.loadNews();
        await this.loadLeaderboard();
        await this.loadStats();
        
        // Set up real-time listeners
        this.setupRealtimeListeners();
        
        // Render initial UI
        this.renderNewsFeed();
        this.renderLeaderboard();
        this.animateStats();
    }

    async initAuth() {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, (user) => {
                if (!user) {
                    // Sign in anonymously if not authenticated
                    signInAnonymously(auth);
                }
                resolve();
            });
        });
    }

    setupRealtimeListeners() {
        // Listen for new news items
        const newsQuery = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
        onSnapshot(newsQuery, (snapshot) => {
            this.newsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            this.renderNewsFeed();
        });

        // Listen for leaderboard updates
        const leaderboardQuery = query(
            collection(db, 'users'), 
            orderBy('reputation', 'desc'), 
            limit(10)
        );
        onSnapshot(leaderboardQuery, (snapshot) => {
            this.leaderboardData = snapshot.docs.map((doc, index) => ({
                id: doc.id,
                rank: index + 1,
                ...doc.data()
            }));
            this.renderLeaderboard();
        });
    }

    async loadNews() {
        try {
            const newsQuery = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(newsQuery);
            this.newsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading news:', error);
            // Load sample data if Firebase fails
            this.loadSampleNews();
        }
    }

    async loadLeaderboard() {
        try {
            const leaderboardQuery = query(
                collection(db, 'users'), 
                orderBy('reputation', 'desc'), 
                limit(10)
            );
            const snapshot = await getDocs(leaderboardQuery);
            this.leaderboardData = snapshot.docs.map((doc, index) => ({
                id: doc.id,
                rank: index + 1,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            // Load sample data if Firebase fails
            this.loadSampleLeaderboard();
        }
    }

    async loadStats() {
        try {
            const newsSnapshot = await getDocs(collection(db, 'news'));
            const usersSnapshot = await getDocs(collection(db, 'users'));
            
            let totalVotes = 0;
            newsSnapshot.forEach(doc => {
                const data = doc.data();
                totalVotes += (data.truthVotes || 0) + (data.falseVotes || 0);
            });

            this.stats = {
                totalNews: newsSnapshot.size,
                totalVotes: totalVotes,
                activeUsers: usersSnapshot.size
            };
        } catch (error) {
            console.error('Error loading stats:', error);
            this.stats = { totalNews: 156, totalVotes: 2847, activeUsers: 432 };
        }
    }

    loadSampleNews() {
        this.newsData = [
            {
                id: '1',
                title: 'Major Breakthrough in Quantum Computing Announced',
                url: 'https://example.com/quantum',
                description: 'Scientists achieve 100-qubit stable quantum computer operation',
                category: 'Technology',
                submitter: 'addr1..xyz',
                status: 'voting',
                truthVotes: 42,
                falseVotes: 8,
                stakedTokens: 500,
                deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                createdAt: new Date()
            },
            {
                id: '2',
                title: 'Global Climate Agreement Reached at Summit',
                url: 'https://example.com/climate',
                description: '150 nations commit to carbon neutrality by 2050',
                category: 'Climate',
                submitter: 'addr1..abc',
                status: 'verified',
                truthVotes: 89,
                falseVotes: 11,
                stakedTokens: 1200,
                deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            }
        ];
    }

    loadSampleLeaderboard() {
        this.leaderboardData = [
            { rank: 1, name: 'TruthSeeker42', votes: 1247, accuracy: 94, reputation: 8942, tier: 'platinum' },
            { rank: 2, name: 'FactChecker', votes: 1089, accuracy: 91, reputation: 7521, tier: 'gold' },
            { rank: 3, name: 'Veritas', votes: 892, accuracy: 89, reputation: 6234, tier: 'gold' }
        ];
    }

    renderNewsFeed() {
        const newsFeed = document.getElementById('newsFeed');
        
        let filteredNews = this.newsData;
        if (this.currentFilter !== 'all') {
            filteredNews = this.newsData.filter(news => news.status === this.currentFilter);
        }

        if (filteredNews.length === 0) {
            newsFeed.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 text-lg">No news items found. Be the first to submit!</p>
                </div>
            `;
            return;
        }

        newsFeed.innerHTML = filteredNews.map(news => {
            const totalVotes = news.truthVotes + news.falseVotes;
            const truthPercentage = totalVotes > 0 ? Math.round((news.truthVotes / totalVotes) * 100) : 0;
            
            return `
                <div class="bg-white rounded-xl shadow-sm overflow-hidden card-hover">
                    <div class="p-6">
                        <div class="flex items-start justify-between mb-3">
                            <span class="px-3 py-1 rounded-full text-xs font-semibold ${this.getStatusBadgeClass(news.status)}">
                                ${news.status.toUpperCase()}
                            </span>
                            <span class="text-xs text-gray-500">${this.formatDeadline(news.deadline)}</span>
                        </div>
                        
                        <h3 class="font-bold text-lg mb-2 line-clamp-2">${news.title}</h3>
                        <p class="text-gray-600 text-sm mb-4 line-clamp-3">${news.description}</p>
                        
                        <div class="flex items-center gap-2 mb-4">
                            <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                ${news.category}
                            </span>
                            <span class="text-xs text-gray-500">
                                ${news.stakedTokens} TRTH staked
                            </span>
                        </div>
                        
                        <div class="mb-4">
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-green-600 font-medium">Truth: ${news.truthVotes}</span>
                                <span class="text-red-600 font-medium">False: ${news.falseVotes}</span>
                            </div>
                            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-green-500 to-green-600" style="width: ${truthPercentage}%"></div>
                            </div>
                        </div>
                        
                        <div class="flex gap-2">
                            ${news.status === 'voting' ? `
                                <button onclick="app.openVoteModal('${news.id}')" class="flex-1 gradient-bg text-white py-2 rounded-lg font-medium hover:opacity-90 transition">
                                    Vote Now
                                </button>
                            ` : ''}
                            <a href="${news.url}" target="_blank" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-center">
                                View Source
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderLeaderboard() {
        const leaderboardList = document.getElementById('leaderboardList');
        
        if (this.leaderboardData.length === 0) {
            leaderboardList.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-gray-500 text-lg">No users yet. Start voting to appear on the leaderboard!</p>
                </div>
            `;
            return;
        }

        leaderboardList.innerHTML = this.leaderboardData.map(user => `
            <div class="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between card-hover">
                <div class="flex items-center gap-6">
                    <div class="text-2xl font-bold text-gray-400 w-8 text-center">
                        ${user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : user.rank}
                    </div>
                    <div>
                        <div class="font-bold text-lg">${user.name || user.walletAddress || 'Anonymous'}</div>
                        <div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>${user.votes || 0} votes</span>
                            <span>${user.accuracy || 0}% accuracy</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <div class="font-bold text-xl text-gray-900">${user.reputation || 0}</div>
                        <div class="text-xs text-gray-500">reputation</div>
                    </div>
                    <div class="tier-${user.tier || 'bronze'} px-4 py-2 rounded-lg text-white font-semibold text-sm">
                        ${(user.tier || 'bronze').toUpperCase()}
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterNews(filter) {
        this.currentFilter = filter;
        
        // Update button styles
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });
        event.target.classList.remove('bg-gray-200', 'text-gray-700');
        event.target.classList.add('bg-blue-600', 'text-white');
        
        this.renderNewsFeed();
    }

    openWalletModal() {
        document.getElementById('walletModal').classList.add('active');
    }

    closeWalletModal() {
        document.getElementById('walletModal').classList.remove('active');
    }

    async connectWallet(walletType) {
        this.showNotification(`Connecting to ${walletType} wallet...`, 'info');
        
        // Simulate wallet connection
        setTimeout(() => {
            this.connectedWallet = {
                type: walletType,
                address: 'addr1' + Math.random().toString(36).substr(2, 9)
            };
            
            document.getElementById('walletSection').innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                        ${this.connectedWallet.address.substr(0, 8)}...
                    </div>
                    <button onclick="app.disconnectWallet()" class="text-gray-600 hover:text-red-600">
                        Disconnect
                    </button>
                </div>
            `;
            
            this.showNotification('Wallet connected successfully!', 'success');
            this.closeWalletModal();
        }, 1500);
    }

    disconnectWallet() {
        this.connectedWallet = null;
        document.getElementById('walletSection').innerHTML = `
            <button onclick="app.openWalletModal()" class="gradient-bg text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition">
                Connect Wallet
            </button>
        `;
        this.showNotification('Wallet disconnected', 'info');
    }

    openSubmitModal() {
        if (!this.connectedWallet) {
            this.showNotification('Please connect your wallet first', 'error');
            this.openWalletModal();
            return;
        }
        document.getElementById('submitModal').classList.add('active');
    }

    closeSubmitModal() {
        document.getElementById('submitModal').classList.remove('active');
        document.getElementById('submitNewsForm').reset();
    }

    async handleNewsSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('newsTitle').value;
        const url = document.getElementById('newsUrl').value;
        const description = document.getElementById('newsDescription').value;
        const category = document.getElementById('newsCategory').value;
        
        this.showNotification('Submitting news... Transaction pending...', 'info');
        
        try {
            // Add to Firebase
            const newsData = {
                title,
                url,
                description,
                category,
                submitter: this.connectedWallet.address,
                status: 'voting',
                truthVotes: 0,
                falseVotes: 0,
                stakedTokens: 10,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                createdAt: serverTimestamp()
            };
            
            await addDoc(collection(db, 'news'), newsData);
            
            this.showNotification('News submitted successfully! Now open for voting.', 'success');
            this.closeSubmitModal();
            
            // Reload news
            await this.loadNews();
            this.renderNewsFeed();
        } catch (error) {
            console.error('Error submitting news:', error);
            this.showNotification('Error submitting news. Using demo mode.', 'error');
            
            // Fallback to local storage in demo mode
            setTimeout(() => {
                this.closeSubmitModal();
            }, 2000);
        }
    }

    openVoteModal(newsId) {
        if (!this.connectedWallet) {
            this.showNotification('Please connect your wallet first', 'error');
            this.openWalletModal();
            return;
        }
        
        this.currentVoteNewsId = newsId;
        const news = this.newsData.find(n => n.id === newsId);
        
        document.getElementById('voteNewsContent').innerHTML = `
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-bold text-lg mb-2">${news.title}</h4>
                <p class="text-gray-600 text-sm mb-3">${news.description}</p>
                <a href="${news.url}" target="_blank" class="text-blue-600 text-sm hover:underline">
                    View Source →
                </a>
            </div>
        `;
        
        document.getElementById('voteModal').classList.add('active');
    }

    closeVoteModal() {
        document.getElementById('voteModal').classList.remove('active');
        this.currentVoteNewsId = null;
    }

    async submitVote(vote) {
        const stakeAmount = parseInt(document.getElementById('stakeAmount').value);
        
        this.showNotification(`Voting ${vote ? 'TRUE' : 'FALSE'} with ${stakeAmount} TRTH...`, 'info');
        
        try {
            const newsRef = doc(db, 'news', this.currentVoteNewsId);
            
            await updateDoc(newsRef, {
                [vote ? 'truthVotes' : 'falseVotes']: increment(1),
                stakedTokens: increment(stakeAmount)
            });
            
            this.showNotification('Vote submitted successfully!', 'success');
            this.closeVoteModal();
            
            // Reload news
            await this.loadNews();
            this.renderNewsFeed();
        } catch (error) {
            console.error('Error submitting vote:', error);
            this.showNotification('Error submitting vote. Using demo mode.', 'error');
            
            // Fallback for demo mode
            setTimeout(() => {
                const newsIndex = this.newsData.findIndex(n => n.id === this.currentVoteNewsId);
                if (newsIndex !== -1) {
                    if (vote) {
                        this.newsData[newsIndex].truthVotes++;
                    } else {
                        this.newsData[newsIndex].falseVotes++;
                    }
                    this.newsData[newsIndex].stakedTokens += stakeAmount;
                }
                
                this.renderNewsFeed();
                this.closeVoteModal();
            }, 1500);
        }
    }

    getStatusBadgeClass(status) {
        const classes = {
            'voting': 'bg-blue-100 text-blue-800',
            'verified': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    }

    formatDeadline(deadline) {
        const now = new Date();
        const diff = deadline - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
        return 'Ending soon';
    }

    scrollToNews() {
        document.getElementById('news').scrollIntoView({ behavior: 'smooth' });
    }

    animateStats() {
        this.animateValue(document.getElementById('totalNews'), 0, this.stats.totalNews, 2000);
        this.animateValue(document.getElementById('totalVotes'), 0, this.stats.totalVotes, 2000);
        this.animateValue(document.getElementById('activeUsers'), 0, this.stats.activeUsers, 2000);
    }

    animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: 'notification success',
            error: 'notification error',
            info: 'notification info'
        };
        
        const notification = document.createElement('div');
        notification.className = colors[type];
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize app
const app = new SocialTruthApp();

// Make app globally accessible
window.app = app;

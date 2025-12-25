// Firebase Integration for SocialTruth DAO
// Add this code to your index.html after the Firebase SDKs are loaded

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAg1Q0_6AvggOiuyvaSHpZ_gYN_VL6msv0",
    authDomain: "social-truth-31e90.firebaseapp.com",
    projectId: "social-truth-31e90",
    storageBucket: "social-truth-31e90.firebasestorage.app",
    messagingSenderId: "953301894494",
    appId: "1:953301894494:web:c90bb17babe141c061bbcf",
    measurementId: "G-LFNHVM60EQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const analytics = firebase.analytics();

console.log("Firebase initialized successfully");

// =====================================
// AUTHENTICATION FUNCTIONS
// =====================================

async function authenticateWithFirebase(walletAddress) {
    try {
        // Sign in anonymously (wallet is the primary auth)
        const userCredential = await auth.signInAnonymously();
        const user = userCredential.user;

        // Create or update user document
        const userRef = db.collection('users').doc(walletAddress);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            // New user - create profile
            await userRef.set({
                address: walletAddress,
                name: `User_${walletAddress.slice(0, 8)}`,
                votes: 0,
                accuracy: 0,
                reputation: 0,
                tier: 'bronze',
                joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastActive: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("New user profile created");
        } else {
            // Existing user - update last active
            await userRef.update({
                lastActive: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("User profile updated");
        }

        return user;
    } catch (error) {
        console.error("Firebase authentication error:", error);
        throw error;
    }
}

// =====================================
// NEWS MANAGEMENT FUNCTIONS
// =====================================

async function saveNewsToFirebase(newsData, txHash) {
    try {
        const newsRef = await db.collection('news').add({
            title: newsData.title,
            description: newsData.description,
            url: newsData.url,
            category: newsData.category,
            status: 'voting',
            truthVotes: 0,
            falseVotes: 0,
            stakedTokens: 10, // Initial submission fee
            submitter: newsData.submitter,
            submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            txHash: txHash,
            voters: []
        });

        // Log analytics
        analytics.logEvent('news_submitted', {
            category: newsData.category,
            user: newsData.submitter
        });

        console.log("News saved to Firebase with ID:", newsRef.id);
        return newsRef.id;
    } catch (error) {
        console.error("Error saving news to Firebase:", error);
        throw error;
    }
}

async function loadNewsFromFirebase() {
    try {
        const snapshot = await db.collection('news')
            .orderBy('submittedAt', 'desc')
            .limit(50)
            .get();
        
        const news = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                deadline: data.deadline?.toDate() || new Date(),
                submittedAt: data.submittedAt?.toDate() || new Date()
            };
        });

        console.log(`Loaded ${news.length} news items from Firebase`);
        return news;
    } catch (error) {
        console.error("Error loading news from Firebase:", error);
        return [];
    }
}

// Real-time news updates
function subscribeToNewsUpdates(callback) {
    return db.collection('news')
        .orderBy('submittedAt', 'desc')
        .limit(50)
        .onSnapshot((snapshot) => {
            const news = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    deadline: data.deadline?.toDate() || new Date(),
                    submittedAt: data.submittedAt?.toDate() || new Date()
                };
            });
            callback(news);
        }, (error) => {
            console.error("Error in news subscription:", error);
        });
}

// =====================================
// VOTING FUNCTIONS
// =====================================

async function saveVoteToFirebase(newsId, voteData, txHash) {
    try {
        const newsRef = db.collection('news').doc(newsId);
        
        // Run in transaction for consistency
        await db.runTransaction(async (transaction) => {
            const newsDoc = await transaction.get(newsRef);
            
            if (!newsDoc.exists) {
                throw new Error("News not found");
            }

            const newsData = newsDoc.data();
            
            // Check if user already voted
            if (newsData.voters && newsData.voters.includes(voteData.voter)) {
                throw new Error("You have already voted on this news");
            }

            // Update news vote counts
            const updates = {
                stakedTokens: newsData.stakedTokens + voteData.stakeAmount,
                voters: firebase.firestore.FieldValue.arrayUnion(voteData.voter)
            };

            if (voteData.voteDecision) {
                updates.truthVotes = (newsData.truthVotes || 0) + 1;
            } else {
                updates.falseVotes = (newsData.falseVotes || 0) + 1;
            }

            transaction.update(newsRef, updates);

            // Create vote record
            const voteRef = db.collection('votes').doc();
            transaction.set(voteRef, {
                newsId: newsId,
                voter: voteData.voter,
                voteDecision: voteData.voteDecision,
                stakeAmount: voteData.stakeAmount,
                votedAt: firebase.firestore.FieldValue.serverTimestamp(),
                txHash: txHash
            });

            // Update user stats
            const userRef = db.collection('users').doc(voteData.voter);
            transaction.update(userRef, {
                votes: firebase.firestore.FieldValue.increment(1),
                lastActive: firebase.firestore.FieldValue.serverTimestamp()
            });
        });

        // Log analytics
        analytics.logEvent('vote_cast', {
            newsId: newsId,
            vote: voteData.voteDecision ? 'true' : 'false',
            stake: voteData.stakeAmount
        });

        console.log("Vote saved successfully");
    } catch (error) {
        console.error("Error saving vote to Firebase:", error);
        throw error;
    }
}

async function getUserVoteStatus(newsId, userAddress) {
    try {
        const snapshot = await db.collection('votes')
            .where('newsId', '==', newsId)
            .where('voter', '==', userAddress)
            .get();
        
        return !snapshot.empty;
    } catch (error) {
        console.error("Error checking vote status:", error);
        return false;
    }
}

// =====================================
// LEADERBOARD FUNCTIONS
// =====================================

async function loadLeaderboardFromFirebase() {
    try {
        const snapshot = await db.collection('users')
            .orderBy('reputation', 'desc')
            .limit(10)
            .get();
        
        const leaderboard = snapshot.docs.map((doc, index) => ({
            rank: index + 1,
            ...doc.data()
        }));

        console.log(`Loaded ${leaderboard.length} users for leaderboard`);
        return leaderboard;
    } catch (error) {
        console.error("Error loading leaderboard from Firebase:", error);
        return [];
    }
}

// Real-time leaderboard updates
function subscribeToLeaderboardUpdates(callback) {
    return db.collection('users')
        .orderBy('reputation', 'desc')
        .limit(10)
        .onSnapshot((snapshot) => {
            const leaderboard = snapshot.docs.map((doc, index) => ({
                rank: index + 1,
                ...doc.data()
            }));
            callback(leaderboard);
        }, (error) => {
            console.error("Error in leaderboard subscription:", error);
        });
}

// =====================================
// USER PROFILE FUNCTIONS
// =====================================

async function updateUserReputation(address, reputationChange, accuracyRate) {
    try {
        const userRef = db.collection('users').doc(address);
        
        await userRef.update({
            reputation: firebase.firestore.FieldValue.increment(reputationChange),
            accuracy: accuracyRate
        });

        // Determine tier based on reputation
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        let tier = 'bronze';
        
        if (userData.reputation >= 10000) tier = 'platinum';
        else if (userData.reputation >= 7000) tier = 'gold';
        else if (userData.reputation >= 4000) tier = 'silver';

        if (userData.tier !== tier) {
            await userRef.update({ tier: tier });
            console.log(`User tier upgraded to ${tier}`);
        }

    } catch (error) {
        console.error("Error updating reputation:", error);
        throw error;
    }
}

async function getUserProfile(address) {
    try {
        const userDoc = await db.collection('users').doc(address).get();
        
        if (userDoc.exists) {
            return userDoc.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
}

// =====================================
// STATS FUNCTIONS
// =====================================

async function getStats() {
    try {
        const newsSnapshot = await db.collection('news').get();
        const votesSnapshot = await db.collection('votes').get();
        const usersSnapshot = await db.collection('users').get();

        return {
            totalNews: newsSnapshot.size,
            totalVotes: votesSnapshot.size,
            activeUsers: usersSnapshot.size
        };
    } catch (error) {
        console.error("Error getting stats:", error);
        return {
            totalNews: 0,
            totalVotes: 0,
            activeUsers: 0
        };
    }
}

// Real-time stats updates
function subscribeToStatsUpdates(callback) {
    const unsubscribers = [];

    // Listen to news collection
    unsubscribers.push(
        db.collection('news').onSnapshot(() => updateStats())
    );

    // Listen to votes collection
    unsubscribers.push(
        db.collection('votes').onSnapshot(() => updateStats())
    );

    // Listen to users collection
    unsubscribers.push(
        db.collection('users').onSnapshot(() => updateStats())
    );

    async function updateStats() {
        const stats = await getStats();
        callback(stats);
    }

    // Return function to unsubscribe from all
    return () => unsubscribers.forEach(unsub => unsub());
}

// =====================================
// STORAGE FUNCTIONS (for images/files)
// =====================================

async function uploadNewsImage(file, newsId) {
    try {
        const storageRef = storage.ref(`news-images/${newsId}/${file.name}`);
        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        console.log("Image uploaded:", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

// =====================================
// ANALYTICS TRACKING
// =====================================

function trackPageView(pageName) {
    analytics.logEvent('page_view', {
        page_name: pageName
    });
}

function trackWalletConnection(walletType) {
    analytics.logEvent('wallet_connected', {
        wallet_type: walletType
    });
}

function trackNewsView(newsId) {
    analytics.logEvent('news_viewed', {
        news_id: newsId
    });
}

// =====================================
// EXPORTS
// =====================================

window.firebaseDB = {
    // Auth
    authenticateWithFirebase,
    
    // News
    saveNewsToFirebase,
    loadNewsFromFirebase,
    subscribeToNewsUpdates,
    
    // Voting
    saveVoteToFirebase,
    getUserVoteStatus,
    
    // Leaderboard
    loadLeaderboardFromFirebase,
    subscribeToLeaderboardUpdates,
    
    // User
    updateUserReputation,
    getUserProfile,
    
    // Stats
    getStats,
    subscribeToStatsUpdates,
    
    // Storage
    uploadNewsImage,
    
    // Analytics
    trackPageView,
    trackWalletConnection,
    trackNewsView
};

console.log("Firebase integration module loaded successfully");

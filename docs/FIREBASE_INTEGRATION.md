# Firebase Integration Guide for SocialTruth DAO

This guide explains how to integrate Firebase into your SocialTruth DAO application for real-time data storage, authentication, and analytics.

## 📋 Prerequisites

- Firebase project created (already done - social-truth-31e90)
- Firebase configuration available (provided)
- Basic understanding of Firestore and Firebase services

## 🔧 Firebase Configuration

Your Firebase project is already set up with these credentials:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyAg1Q0_6AvggOiuyvaSHpZ_gYN_VL6msv0",
    authDomain: "social-truth-31e90.firebaseapp.com",
    projectId: "social-truth-31e90",
    storageBucket: "social-truth-31e90.firebasestorage.app",
    messagingSenderId: "953301894494",
    appId: "1:953301894494:web:c90bb17babe141c061bbcf",
    measurementId: "G-LFNHVM60EQ"
};
```

## 🚀 Quick Integration (3 Steps)

### Step 1: Add Firebase SDKs to index.html

Add these script tags in the `<head>` section, after Tailwind and Lucid:

```html
<!-- Firebase SDKs -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics-compat.js"></script>
```

### Step 2: Include Firebase Integration Module

Add this before the closing `</body>` tag, but BEFORE your main script:

```html
<script src="firebase-integration.js"></script>
```

### Step 3: Update Your JavaScript Code

Replace the sample data arrays with Firebase calls:

```javascript
// BEFORE (sample data)
const newsData = [ /* ... */ ];
const leaderboardData = [ /* ... */ ];

// AFTER (Firebase integration)
let newsData = [];
let leaderboardData = [];

// Load data on startup
async function initializeApp() {
    newsData = await window.firebaseDB.loadNewsFromFirebase();
    leaderboardData = await window.firebaseDB.loadLeaderboardFromFirebase();
    renderNewsFeed();
    renderLeaderboard();
    
    // Subscribe to real-time updates
    window.firebaseDB.subscribeToNewsUpdates((news) => {
        newsData = news;
        renderNewsFeed();
    });
    
    window.firebaseDB.subscribeToLeaderboardUpdates((leaderboard) => {
        leaderboardData = leaderboard;
        renderLeaderboard();
    });
}

// Call on page load
window.addEventListener('DOMContentLoaded', initializeApp);
```

## 📊 Firestore Database Structure

### Collections

#### 1. **news** Collection
Stores all submitted news articles.

```javascript
{
    id: "auto-generated",
    title: "News Title",
    description: "News description",
    url: "https://source.com/article",
    category: "technology",
    status: "voting", // or "verified", "rejected"
    truthVotes: 0,
    falseVotes: 0,
    stakedTokens: 10,
    submitter: "addr1...",
    submittedAt: Timestamp,
    deadline: Timestamp,
    txHash: "cardano-tx-hash",
    voters: ["addr1...", "addr2..."]
}
```

#### 2. **users** Collection
Stores user profiles and stats.

```javascript
{
    address: "addr1...", // Document ID
    name: "User_addr1abc",
    votes: 0,
    accuracy: 0,
    reputation: 0,
    tier: "bronze", // bronze, silver, gold, platinum
    joinedAt: Timestamp,
    lastActive: Timestamp
}
```

#### 3. **votes** Collection
Stores individual vote records.

```javascript
{
    id: "auto-generated",
    newsId: "news-doc-id",
    voter: "addr1...",
    voteDecision: true, // true = TRUE, false = FALSE
    stakeAmount: 10,
    votedAt: Timestamp,
    txHash: "cardano-tx-hash"
}
```

## 🔒 Firestore Security Rules

Set up these security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // News collection - anyone can read, only authenticated can write
    match /news/{newsId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Users collection - anyone can read, users can update their own profile
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == userId;
    }
    
    // Votes collection - anyone can read, only authenticated can write
    match /votes/{voteId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if false; // Votes cannot be changed
      allow delete: if false; // Votes cannot be deleted
    }
  }
}
```

## 🔄 Function Usage Examples

### Authenticate User on Wallet Connect

```javascript
async function connectWithWallet(walletName) {
    // ... existing wallet connection code ...
    
    // After successful connection
    await window.firebaseDB.authenticateWithFirebase(address);
    
    // Track analytics
    window.firebaseDB.trackWalletConnection(walletName);
}
```

### Submit News with Firebase

```javascript
async function handleNewsSubmit(e) {
    e.preventDefault();
    
    const newsData = {
        title: document.getElementById('newsTitle').value,
        url: document.getElementById('newsUrl').value,
        description: document.getElementById('newsDescription').value,
        category: document.getElementById('newsCategory').value,
        submitter: connectedWallet.address
    };
    
    try {
        // Build and submit Cardano transaction
        const txHash = await buildSubmitNewsTx(newsData);
        
        // Save to Firebase
        const newsId = await window.firebaseDB.saveNewsToFirebase(newsData, txHash);
        
        showNotification('News submitted successfully!', 'success');
    } catch (error) {
        showNotification('Failed to submit news', 'error');
    }
}
```

### Cast Vote with Firebase

```javascript
async function submitVote(voteDecision) {
    const stakeAmount = parseInt(document.getElementById('stakeAmount').value);
    
    try {
        // Build and submit Cardano transaction
        const txHash = await buildVoteTx(currentVoteNewsId, voteDecision, stakeAmount);
        
        // Save vote to Firebase
        await window.firebaseDB.saveVoteToFirebase(
            currentVoteNewsId,
            {
                voter: connectedWallet.address,
                voteDecision: voteDecision,
                stakeAmount: stakeAmount
            },
            txHash
        );
        
        showNotification('Vote submitted successfully!', 'success');
    } catch (error) {
        showNotification('Failed to submit vote', 'error');
    }
}
```

### Real-time Stats Updates

```javascript
// Subscribe to stats updates
const unsubscribeStats = window.firebaseDB.subscribeToStatsUpdates((stats) => {
    document.getElementById('totalNews').textContent = stats.totalNews;
    document.getElementById('totalVotes').textContent = stats.totalVotes.toLocaleString();
    document.getElementById('activeUsers').textContent = stats.activeUsers;
});

// Unsubscribe when needed
// unsubscribeStats();
```

### Update User Reputation (Admin Function)

```javascript
// Called after voting period ends and results are determined
async function finalizeVoting(newsId) {
    // ... determine winners and losers ...
    
    // Update winner reputation
    for (const winner of winners) {
        await window.firebaseDB.updateUserReputation(
            winner.address,
            100, // reputation points gained
            winner.newAccuracyRate
        );
    }
}
```

## 📈 Analytics Tracking

Track user interactions:

```javascript
// Track page views
window.firebaseDB.trackPageView('news-feed');

// Track wallet connections
window.firebaseDB.trackWalletConnection('nami');

// Track news views
window.firebaseDB.trackNewsView(newsId);
```

View analytics in Firebase Console → Analytics.

## 💾 Storage for Images

If you want to allow users to upload images with news:

```javascript
async function handleImageUpload(file, newsId) {
    try {
        const imageUrl = await window.firebaseDB.uploadNewsImage(file, newsId);
        
        // Update news document with image URL
        await db.collection('news').doc(newsId).update({
            imageUrl: imageUrl
        });
        
        console.log('Image uploaded:', imageUrl);
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}
```

## 🔍 Querying Data

### Get User's Submitted News

```javascript
const myNews = await db.collection('news')
    .where('submitter', '==', connectedWallet.address)
    .orderBy('submittedAt', 'desc')
    .get();
```

### Get User's Votes

```javascript
const myVotes = await db.collection('votes')
    .where('voter', '==', connectedWallet.address)
    .orderBy('votedAt', 'desc')
    .get();
```

### Get News by Category

```javascript
const techNews = await db.collection('news')
    .where('category', '==', 'technology')
    .where('status', '==', 'voting')
    .get();
```

## 🚨 Error Handling

Always wrap Firebase calls in try-catch:

```javascript
try {
    await window.firebaseDB.saveNewsToFirebase(newsData, txHash);
} catch (error) {
    if (error.code === 'permission-denied') {
        console.error('Permission denied - check Firestore rules');
    } else if (error.code === 'unavailable') {
        console.error('Firebase service unavailable');
    } else {
        console.error('Unexpected error:', error);
    }
}
```

## 🔧 Testing Firebase Integration

### 1. Test Data Creation

```javascript
// Create test news
async function createTestNews() {
    const testNews = {
        title: "Test News Article",
        description: "This is a test",
        url: "https://example.com",
        category: "technology",
        submitter: "test-address"
    };
    
    await window.firebaseDB.saveNewsToFirebase(testNews, "test-tx-hash");
}
```

### 2. Test Real-time Updates

Open the app in two browser windows. Submit news in one window and watch it appear in the other automatically.

### 3. Check Firebase Console

Visit Firebase Console → Firestore Database to see your data in real-time.

## 📱 Offline Support

Firebase automatically handles offline support:

```javascript
// Enable offline persistence
firebase.firestore().enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.log('Multiple tabs open, persistence available in one tab');
        } else if (err.code === 'unimplemented') {
            console.log('Browser does not support offline persistence');
        }
    });
```

## ⚡ Performance Optimization

### 1. Use Indexes

Create composite indexes in Firebase Console for common queries:
- `news`: submittedAt (desc) + status (asc)
- `votes`: newsId (asc) + votedAt (desc)

### 2. Limit Query Results

```javascript
// Only load latest 50 news items
const news = await db.collection('news')
    .orderBy('submittedAt', 'desc')
    .limit(50)
    .get();
```

### 3. Unsubscribe from Listeners

```javascript
// Store unsubscribe function
const unsubscribe = window.firebaseDB.subscribeToNewsUpdates(callback);

// Clean up when component unmounts or user navigates away
window.addEventListener('beforeunload', () => {
    unsubscribe();
});
```

## 🎯 Next Steps

1. ✅ Add Firebase SDKs to index.html
2. ✅ Include firebase-integration.js
3. ✅ Update function calls to use Firebase
4. ✅ Set Firestore security rules
5. ✅ Test in Firebase Console
6. ✅ Monitor Analytics
7. ✅ Set up indexes for performance

## 📞 Troubleshooting

**Error: "Firebase not initialized"**
- Make sure Firebase SDKs are loaded before your script
- Check browser console for loading errors

**Error: "Permission denied"**
- Update Firestore security rules
- Ensure user is authenticated

**Data not updating in real-time**
- Check subscriptions are active
- Verify network connection
- Check Firebase Console for service status

---

Your SocialTruth DAO is now powered by Firebase! 🔥

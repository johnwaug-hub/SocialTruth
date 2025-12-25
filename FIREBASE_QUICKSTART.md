# Firebase Integration - Quick Start

Your Firebase is configured and ready to use! Here's what you need to know:

## ✅ What's Included

### Firebase Configuration
```
Project: social-truth-31e90
API Key: AIzaSyAg1Q0_6AvggOiuyvaSHpZ_gYN_VL6msv0
```

### New Files
- `firebase-integration.js` - Complete Firebase backend module
- `docs/FIREBASE_INTEGRATION.md` - Detailed integration guide

## 🚀 Quick Integration (Copy-Paste Ready)

### Step 1: Add Firebase to index.html

Add these lines in the `<head>` section (after line 7):

```html
<!-- Firebase SDKs -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics-compat.js"></script>
```

### Step 2: Include Firebase Module

Add this line before the closing `</body>` tag (before your main `<script type="module">` tag):

```html
<script src="firebase-integration.js"></script>
```

### Step 3: Update Your Code

Replace these sections in your main script:

#### Initialize Data
```javascript
// OLD:
const newsData = [ /* sample data */ ];
const leaderboardData = [ /* sample data */ ];

// NEW:
let newsData = [];
let leaderboardData = [];
```

#### Load Data on Startup
Add this function and call it on page load:

```javascript
async function initializeFirebase() {
    // Load initial data
    newsData = await window.firebaseDB.loadNewsFromFirebase();
    leaderboardData = await window.firebaseDB.loadLeaderboardFromFirebase();
    
    // Render
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
    
    // Update stats in real-time
    window.firebaseDB.subscribeToStatsUpdates((stats) => {
        document.getElementById('totalNews').textContent = stats.totalNews;
        document.getElementById('totalVotes').textContent = stats.totalVotes.toLocaleString();
        document.getElementById('activeUsers').textContent = stats.activeUsers;
    });
}

// Call on page load
window.addEventListener('DOMContentLoaded', async () => {
    await initializeFirebase();
    renderNewsFeed();
    renderLeaderboard();
    animateStats();
    await initLucid();
});
```

#### Update Wallet Connection
Add Firebase auth after wallet connects:

```javascript
// Inside connectWithWallet function, after successful connection:
await window.firebaseDB.authenticateWithFirebase(address);
window.firebaseDB.trackWalletConnection(walletName);
```

#### Update News Submission
```javascript
// Inside handleNewsSubmit function, after transaction:
const newsId = await window.firebaseDB.saveNewsToFirebase({
    title: title,
    description: description,
    url: url,
    category: category,
    submitter: connectedWallet.address
}, txHash);
```

#### Update Voting
```javascript
// Inside submitVote function, after transaction:
await window.firebaseDB.saveVoteToFirebase(
    currentVoteNewsId,
    {
        voter: connectedWallet.address,
        voteDecision: vote,
        stakeAmount: stakeAmount
    },
    txHash
);
```

## 🔒 Set Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **social-truth-31e90**
3. Go to Firestore Database → Rules
4. Paste these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /news/{newsId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    match /votes/{voteId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if false;
      allow delete: if false;
    }
  }
}
```

5. Click **Publish**

## 📊 Database Structure

Your Firestore will have 3 collections:

### news
```javascript
{
    title: "string",
    description: "string",
    url: "string",
    category: "string",
    status: "voting" | "verified" | "rejected",
    truthVotes: number,
    falseVotes: number,
    stakedTokens: number,
    submitter: "addr1...",
    submittedAt: Timestamp,
    deadline: Timestamp,
    txHash: "string",
    voters: ["addr1...", "addr2..."]
}
```

### users
```javascript
{
    address: "addr1...", // Document ID
    name: "string",
    votes: number,
    accuracy: number,
    reputation: number,
    tier: "bronze" | "silver" | "gold" | "platinum",
    joinedAt: Timestamp,
    lastActive: Timestamp
}
```

### votes
```javascript
{
    newsId: "string",
    voter: "addr1...",
    voteDecision: boolean,
    stakeAmount: number,
    votedAt: Timestamp,
    txHash: "string"
}
```

## 🎯 Benefits

✅ **Real-time Updates** - Data syncs automatically across all users  
✅ **Persistent Storage** - All news and votes saved to cloud  
✅ **User Profiles** - Track reputation and stats  
✅ **Analytics** - Monitor platform usage  
✅ **Scalable** - Handles thousands of concurrent users  
✅ **Offline Support** - Works even without internet  

## 🧪 Testing

1. Open the app
2. Connect wallet
3. Check Firebase Console → Firestore Database
4. You should see a new user document created
5. Submit test news - see it appear in the `news` collection
6. Cast a vote - see it in the `votes` collection

## 📱 Monitor Your Data

Visit [Firebase Console](https://console.firebase.google.com/project/social-truth-31e90) to:
- View Firestore data in real-time
- Check Analytics dashboard
- Monitor Storage usage
- See Authentication logs

## 🆘 Need Help?

See the complete guide: `docs/FIREBASE_INTEGRATION.md`

---

That's it! Your app now has a professional backend powered by Firebase. 🔥

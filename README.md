# SocialTruth DAO - Decentralized Truth Verification Platform

A decentralized platform for truth verification powered by community voting and integrated with Firebase for real-time data management.

## Features

- 📰 **News Submission**: Submit news articles for community verification
- 🗳️ **Voting System**: Vote on news veracity by staking TRTH tokens
- 🏆 **Reputation System**: Build reputation through accurate voting
- 📊 **Real-time Updates**: Firebase integration for live data synchronization
- 🔐 **Wallet Integration**: Connect Cardano wallets (Nami, Eternl, Flint)
- 📈 **Leaderboard**: Track top contributors and their achievements
- 🎖️ **Tier System**: Progress through Bronze, Silver, Gold, and Platinum tiers

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Firebase (Firestore, Authentication, Analytics)
- **Blockchain**: Cardano (wallet integration ready)
- **Hosting**: Firebase Hosting (optional) or any static host

## Prerequisites

- Node.js (v14 or higher)
- Firebase account
- Modern web browser

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Start in production mode (or test mode for development)
   
4. Enable Authentication:
   - Go to Authentication
   - Enable "Anonymous" sign-in method
   
5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click the web icon (</>)
   - Register your app
   - Copy the Firebase configuration object

### 2. Configure the Application

1. Open `js/firebase-config.js`
2. Replace the placeholder values with your Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 3. Firestore Database Structure

Create the following collections in Firestore:

#### Collection: `news`
```javascript
{
  title: string,
  url: string,
  description: string,
  category: string,
  submitter: string,
  status: string, // 'voting' | 'verified' | 'rejected'
  truthVotes: number,
  falseVotes: number,
  stakedTokens: number,
  deadline: timestamp,
  createdAt: timestamp
}
```

#### Collection: `users`
```javascript
{
  name: string,
  walletAddress: string,
  votes: number,
  accuracy: number,
  reputation: number,
  tier: string, // 'bronze' | 'silver' | 'gold' | 'platinum'
  createdAt: timestamp
}
```

### 4. Firestore Security Rules

Add these security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // News collection
    match /news/{newsId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Running the Application

#### Option 1: Local Development

Simply open `index.html` in your web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000
```

Then navigate to `http://localhost:8000`

#### Option 2: Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in the project:
```bash
firebase init
```
   - Select "Hosting"
   - Choose your Firebase project
   - Set public directory to current directory (.)
   - Configure as single-page app: No
   - Don't overwrite index.html

4. Deploy:
```bash
firebase deploy
```

## Project Structure

```
SocialTruthV2/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Custom styles
├── js/
│   ├── firebase-config.js # Firebase configuration
│   └── app.js            # Main application logic
├── .gitignore            # Git ignore file
├── README.md             # This file
└── firebase.json         # Firebase hosting config
```

## Features Overview

### News Submission
- Users connect their Cardano wallet
- Submit news with title, URL, description, and category
- Pay 10 TRTH tokens as submission fee

### Voting System
- Vote TRUE or FALSE on submitted news
- Stake TRTH tokens with your vote
- Higher stakes = higher potential rewards
- Voting period: 7 days per submission

### Reputation & Tiers
- Earn reputation through accurate voting
- Progress through tiers:
  - **Bronze**: 0-999 reputation
  - **Silver**: 1000-2499 reputation
  - **Gold**: 2500-4999 reputation
  - **Platinum**: 5000+ reputation

### Leaderboard
- Top 10 contributors displayed
- Ranked by reputation score
- Shows voting accuracy and total votes

## Demo Mode

The application includes demo/fallback mode that works without Firebase:
- Sample news items displayed
- Local state management for testing
- All features functional for demonstration

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Roadmap

- [ ] Smart contract integration with Cardano
- [ ] TRTH token implementation
- [ ] Advanced reputation algorithm
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] AI-powered fact checking assistance
- [ ] Rewards distribution system

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact: support@socialtruth.io

## Acknowledgments

- Cardano blockchain community
- Firebase for backend infrastructure
- Tailwind CSS for styling framework

---

Built with ❤️ for a more truthful internet

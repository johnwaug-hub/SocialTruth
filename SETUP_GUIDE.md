# Firebase Setup Guide for SocialTruth DAO

This guide will walk you through setting up Firebase for the SocialTruth DAO application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `SocialTruth-DAO` (or your preferred name)
4. Click "Continue"
5. (Optional) Enable Google Analytics
6. Click "Create project"
7. Wait for project to be created
8. Click "Continue" when ready

## Step 2: Register Your Web App

1. In Firebase Console, click the web icon `</>` to add a web app
2. Enter app nickname: `SocialTruth Web App`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **IMPORTANT**: Copy the Firebase configuration object shown
6. Click "Continue to console"

Your configuration will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};
```

## Step 3: Enable Firestore Database

1. In Firebase Console left sidebar, click "Firestore Database"
2. Click "Create database"
3. Choose location (select closest to your users)
4. Select "Start in production mode" (we'll add rules next)
5. Click "Enable"
6. Wait for database to be created

### Set Up Firestore Security Rules

1. Click on "Rules" tab in Firestore
2. Replace the default rules with the contents of `firestore.rules` file
3. Click "Publish"

### Create Firestore Indexes

The app will automatically create indexes as needed, but you can pre-create them:

1. Click on "Indexes" tab in Firestore
2. You can manually add indexes or wait for Firebase to suggest them
3. The required indexes are defined in `firestore.indexes.json`

## Step 4: Enable Authentication

1. In Firebase Console left sidebar, click "Authentication"
2. Click "Get started"
3. Click on "Sign-in method" tab
4. Click "Anonymous"
5. Toggle "Enable"
6. Click "Save"

This allows users to interact with the app without creating an account initially.

## Step 5: Configure Your Application

1. Open the file `js/firebase-config.js` in your code editor
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
    projectId: "YOUR_ACTUAL_PROJECT_ID",
    storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
    messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
    appId: "YOUR_ACTUAL_APP_ID",
    measurementId: "YOUR_ACTUAL_MEASUREMENT_ID"
};
```

3. Save the file

## Step 6: Initialize Sample Data (Optional)

You can manually add some sample data to test the application:

### Sample News Document

In Firestore Console:
1. Click "Start collection"
2. Collection ID: `news`
3. Add a document with these fields:

```
Document ID: (Auto-ID)
Fields:
- title (string): "Sample News Article"
- url (string): "https://example.com/news"
- description (string): "This is a sample news article for testing"
- category (string): "Technology"
- submitter (string): "addr1sample123"
- status (string): "voting"
- truthVotes (number): 0
- falseVotes (number): 0
- stakedTokens (number): 10
- deadline (timestamp): [7 days from now]
- createdAt (timestamp): [now]
```

### Sample User Document

1. Create collection: `users`
2. Add a document:

```
Document ID: (Auto-ID or user ID)
Fields:
- name (string): "TestUser"
- walletAddress (string): "addr1test123456"
- votes (number): 0
- accuracy (number): 0
- reputation (number): 0
- tier (string): "bronze"
- createdAt (timestamp): [now]
```

## Step 7: Test the Application

### Local Testing

1. Open `index.html` in a web browser, or
2. Run a local server:
   ```bash
   python -m http.server 8000
   # or
   npx http-server -p 8000
   ```
3. Navigate to `http://localhost:8000`

### Verify Firebase Connection

1. Open browser developer console (F12)
2. Look for any Firebase errors
3. Try connecting a wallet
4. Try submitting news or voting
5. Check Firestore Console to see if data is being saved

## Step 8: Deploy to Firebase Hosting (Optional)

### Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Login to Firebase

```bash
firebase login
```

### Initialize Firebase in Project

```bash
cd /path/to/SocialTruthV2
firebase init
```

1. Select: ☑ Firestore, ☑ Hosting
2. Use existing project: Select your project
3. Firestore rules file: `firestore.rules` (default)
4. Firestore indexes file: `firestore.indexes.json` (default)
5. Public directory: `.` (current directory)
6. Single-page app: `No`
7. Don't overwrite index.html

### Deploy

```bash
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

## Troubleshooting

### Error: "Firebase config not found"
- Make sure you've updated `js/firebase-config.js` with your actual config
- Check that all Firebase SDK imports are loading correctly

### Error: "Permission denied"
- Check Firestore security rules are published
- Verify anonymous authentication is enabled
- Make sure user is authenticated before performing operations

### Error: "Missing indexes"
- Firebase will show warnings for missing indexes
- Click the provided link to auto-create them
- Or manually create them in Firestore Console

### Data not appearing
- Check browser console for errors
- Verify Firestore rules allow read access
- Check that collections exist in Firestore

### Wallet connection not working
- This is expected - wallet integration requires actual Cardano wallet extensions
- For testing, the demo mode simulates wallet connections

## Firebase Limits (Free Tier)

- **Firestore**: 1 GB storage, 50K reads/day, 20K writes/day
- **Authentication**: Unlimited users
- **Hosting**: 10 GB storage, 360 MB/day transfer

For production, consider upgrading to Blaze (pay-as-you-go) plan.

## Security Best Practices

1. **Never commit** your Firebase config with real API keys to public repos
2. Use **environment variables** for sensitive data in production
3. Set up **Firebase App Check** to prevent abuse
4. Configure **rate limiting** for API calls
5. Regularly review **Firestore security rules**
6. Enable **two-factor authentication** on your Firebase account
7. Monitor usage in Firebase Console regularly

## Next Steps

- Set up Firebase Cloud Functions for backend logic
- Implement email notifications
- Add Firebase Analytics tracking
- Set up Firebase Performance Monitoring
- Configure Firebase Cloud Messaging for push notifications

## Support

If you encounter issues:
1. Check Firebase Console for error messages
2. Review browser console for JavaScript errors
3. Consult [Firebase Documentation](https://firebase.google.com/docs)
4. Ask in Firebase community forums

---

Happy building! 🚀

# Firebase Hosting Deployment Guide

## Project Setup Complete! ✅

Your SocialTruth DAO app is ready to deploy to Firebase Hosting.

## Prerequisites

1. ✅ Firebase project created: `social-truth-31e90`
2. ✅ Project files configured
3. ✅ Firebase.json configured
4. ⚠️ **You need to update Firebase config** (see step 1 below)

## Deployment Steps

### Step 1: Update Firebase Configuration (REQUIRED)

Open `js/firebase-config.js` and replace with your actual Firebase credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "social-truth-31e90.firebaseapp.com",
    projectId: "social-truth-31e90",
    storageBucket: "social-truth-31e90.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
```

**Where to find these values:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `social-truth-31e90`
3. Click Settings (gear icon) → Project Settings
4. Scroll to "Your apps" section
5. Click the web app icon `</>` or select your existing web app
6. Copy the configuration values

### Step 2: Set Up Firebase Backend

Before deploying, set up these Firebase services:

#### Enable Firestore Database

```bash
# Option 1: Via Firebase Console (Recommended)
# 1. Go to https://console.firebase.google.com/project/social-truth-31e90/firestore
# 2. Click "Create database"
# 3. Start in production mode
# 4. Choose location (us-central or closest to users)

# Option 2: Via CLI (if you have permissions)
firebase firestore:databases:create --location=us-central
```

#### Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

#### Enable Anonymous Authentication

```bash
# Via Firebase Console:
# 1. Go to https://console.firebase.google.com/project/social-truth-31e90/authentication
# 2. Click "Get started"
# 3. Click "Sign-in method" tab
# 4. Enable "Anonymous"
# 5. Click "Save"
```

### Step 3: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 4: Login to Firebase

```bash
firebase login
```

This will open a browser window. Sign in with the Google account that has access to the `social-truth-31e90` project.

### Step 5: Deploy to Firebase Hosting

```bash
cd SocialTruthV2

# Deploy everything (hosting + firestore rules)
firebase deploy

# Or deploy only hosting
firebase deploy --only hosting
```

### Step 6: Access Your Live App

After successful deployment, your app will be available at:

```
https://social-truth-31e90.web.app
```

And also at:

```
https://social-truth-31e90.firebaseapp.com
```

## Quick Deploy Commands

```bash
# Full deployment (first time)
firebase deploy

# Update hosting only
firebase deploy --only hosting

# Update Firestore rules only
firebase deploy --only firestore:rules

# Preview before deploying
firebase hosting:channel:deploy preview
```

## Project Structure for Hosting

```
Deployed files:
├── index.html          ✅ Main app
├── styles/main.css     ✅ Styles
├── js/
│   ├── app.js         ✅ App logic
│   └── firebase-config.js ✅ Config

Not deployed (ignored):
├── README.md
├── SETUP_GUIDE.md
├── firebase.json
├── firestore.rules
└── package.json
```

## Verify Deployment

After deployment:

1. **Open the URL**: Visit `https://social-truth-31e90.web.app`
2. **Check Console**: Open browser DevTools (F12) and check for errors
3. **Test Features**:
   - Connect wallet (demo mode works without actual wallet)
   - Browse news feed
   - View leaderboard
   - Submit news (requires wallet connection)

## Troubleshooting

### Issue: "Firebase config not found" error

**Solution**: Make sure you updated `js/firebase-config.js` with actual values from Firebase Console.

### Issue: "Permission denied" when deploying

**Solution**: 
```bash
# Re-authenticate
firebase logout
firebase login
```

### Issue: Firestore errors in console

**Solution**: 
1. Verify Firestore database is created
2. Check security rules are deployed
3. Enable Anonymous authentication

### Issue: 404 on refresh

**Solution**: Already handled in firebase.json with rewrites configuration.

## Custom Domain Setup (Optional)

### Add Custom Domain

```bash
# Via CLI
firebase hosting:sites:create yourdomain

# Then in Firebase Console:
# 1. Go to Hosting section
# 2. Click "Add custom domain"
# 3. Enter your domain
# 4. Follow DNS configuration instructions
```

## Multiple Environments

### Create Preview Channel

```bash
# Create preview for testing
firebase hosting:channel:deploy staging

# Your preview URL:
# https://social-truth-31e90--staging-xxxxx.web.app
```

### Set Up Production

```bash
# Deploy to production
firebase deploy --only hosting
```

## Monitoring & Analytics

### View Hosting Metrics

```bash
# In Firebase Console
# https://console.firebase.google.com/project/social-truth-31e90/hosting
```

### Check Usage

```bash
# View hosting usage
firebase hosting:usage
```

## Updating Your App

```bash
# 1. Make changes to your code
# 2. Test locally
python -m http.server 8000

# 3. Deploy updates
firebase deploy --only hosting
```

## Rollback to Previous Version

```bash
# List previous releases
firebase hosting:releases:list

# Rollback to specific release
firebase hosting:rollback
```

## Performance Optimization

Your hosting is already configured with:

✅ **CDN**: Global content delivery
✅ **Caching**: Static assets cached for 1 year
✅ **Compression**: Automatic gzip/brotli
✅ **SSL**: Automatic HTTPS certificate
✅ **HTTP/2**: Enabled by default

## Security

Firebase Hosting provides:

✅ **Automatic SSL/TLS**
✅ **DDoS protection**
✅ **Secure headers** (configured in firebase.json)
✅ **Firestore security rules** (in firestore.rules)

## Cost

Firebase Hosting free tier includes:
- ✅ 10 GB storage
- ✅ 360 MB/day bandwidth
- ✅ Unlimited custom domains
- ✅ Automatic SSL certificates

This is more than enough for most applications!

## Next Steps

1. ✅ Update `js/firebase-config.js` with your Firebase credentials
2. ✅ Deploy: `firebase deploy`
3. ✅ Visit: `https://social-truth-31e90.web.app`
4. ⭐ Star the repository
5. 🚀 Share with users!

## Support

- **Firebase Documentation**: https://firebase.google.com/docs/hosting
- **Firebase Console**: https://console.firebase.google.com/project/social-truth-31e90
- **Firebase Status**: https://status.firebase.google.com/

## Complete Deployment Checklist

- [ ] Update `js/firebase-config.js` with actual credentials
- [ ] Enable Firestore Database in Firebase Console
- [ ] Enable Anonymous Authentication in Firebase Console
- [ ] Install Firebase CLI: `npm install -g firebase-tools`
- [ ] Login: `firebase login`
- [ ] Deploy: `firebase deploy`
- [ ] Test app at: `https://social-truth-31e90.web.app`
- [ ] Verify wallet connection works
- [ ] Test news submission
- [ ] Check Firestore data is being saved

---

**Your app is ready to go live! 🚀**

Simply update the Firebase config and run `firebase deploy`!

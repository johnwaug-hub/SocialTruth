#!/bin/bash

# SocialTruth DAO - Quick Deploy Script
# This script deploys your app to Firebase Hosting

echo "🚀 SocialTruth DAO - Firebase Deployment"
echo "========================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI not found!"
    echo ""
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Check if user is logged in
echo "📝 Checking Firebase authentication..."
firebase login:list &> /dev/null
if [ $? -ne 0 ]; then
    echo "🔐 Logging in to Firebase..."
    firebase login
fi

# Verify project exists
echo ""
echo "🔍 Verifying Firebase project: social-truth-31e90"
firebase use social-truth-31e90

# Check if firebase config is updated
if grep -q "YOUR_API_KEY" js/firebase-config.js; then
    echo ""
    echo "⚠️  WARNING: Firebase configuration not updated!"
    echo ""
    echo "Please update js/firebase-config.js with your actual Firebase credentials"
    echo "from: https://console.firebase.google.com/project/social-truth-31e90/settings/general"
    echo ""
    read -p "Have you updated the Firebase config? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
        echo "❌ Deployment cancelled. Please update Firebase config first."
        exit 1
    fi
fi

# Deploy to Firebase
echo ""
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Your app is live at:"
    echo "   https://social-truth-31e90.web.app"
    echo "   https://social-truth-31e90.firebaseapp.com"
    echo ""
    echo "📊 View in Firebase Console:"
    echo "   https://console.firebase.google.com/project/social-truth-31e90/hosting"
    echo ""
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Please check the error messages above."
    exit 1
fi

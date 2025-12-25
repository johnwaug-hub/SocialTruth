@echo off
REM SocialTruth DAO - Quick Deploy Script for Windows
REM This script deploys your app to Firebase Hosting

echo.
echo ========================================
echo SocialTruth DAO - Firebase Deployment
echo ========================================
echo.

REM Check if Firebase CLI is installed
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Firebase CLI not found!
    echo.
    echo Installing Firebase CLI...
    npm install -g firebase-tools
)

REM Check if user is logged in
echo Checking Firebase authentication...
firebase login:list >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Logging in to Firebase...
    firebase login
)

REM Verify project exists
echo.
echo Verifying Firebase project: social-truth-31e90
firebase use social-truth-31e90

REM Check if firebase config is updated
findstr /C:"YOUR_API_KEY" js\firebase-config.js >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo WARNING: Firebase configuration not updated!
    echo.
    echo Please update js\firebase-config.js with your actual Firebase credentials
    echo from: https://console.firebase.google.com/project/social-truth-31e90/settings/general
    echo.
    set /p answer="Have you updated the Firebase config? (y/n): "
    if /i not "%answer%"=="y" (
        echo.
        echo Deployment cancelled. Please update Firebase config first.
        exit /b 1
    )
)

REM Deploy to Firebase
echo.
echo Deploying to Firebase Hosting...
firebase deploy --only hosting

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Deployment successful!
    echo ========================================
    echo.
    echo Your app is live at:
    echo   https://social-truth-31e90.web.app
    echo   https://social-truth-31e90.firebaseapp.com
    echo.
    echo View in Firebase Console:
    echo   https://console.firebase.google.com/project/social-truth-31e90/hosting
    echo.
) else (
    echo.
    echo Deployment failed!
    echo Please check the error messages above.
    exit /b 1
)

pause

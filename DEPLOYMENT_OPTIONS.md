# Deployment Options for SocialTruth DAO

This guide covers various deployment options for your static HTML application.

## Recommended: Firebase Hosting

Firebase Hosting is the easiest and best-integrated option for this app.

### Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firebase in project
cd SocialTruthV2
firebase init

# Select: Hosting
# Use existing project: social-truth-31e90
# Public directory: . (current directory)
# Single-page app: No
# Don't overwrite index.html

# Deploy
firebase deploy --only hosting
```

Your app will be live at: `https://social-truth-31e90.web.app`

**Advantages:**
- Free hosting with generous limits
- Automatic SSL certificate
- Global CDN
- Easy rollbacks
- Integrated with Firebase services

## Option 2: Netlify

### Quick Deploy

1. Go to [Netlify](https://app.netlify.com/)
2. Drag and drop the `SocialTruthV2` folder
3. Your site is live!

### CLI Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd SocialTruthV2
netlify deploy --prod
```

**Advantages:**
- Simple drag-and-drop deployment
- Automatic deployments from Git
- Free SSL
- Form handling
- Serverless functions support

## Option 3: Vercel

### Quick Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd SocialTruthV2
vercel --prod
```

Or connect your GitHub repository at [vercel.com](https://vercel.com)

**Advantages:**
- Instant deployments
- Preview deployments for branches
- Excellent performance
- Free SSL
- Edge network

## Option 4: GitHub Pages

### Setup

```bash
cd SocialTruthV2

# Create gh-pages branch
git checkout -b gh-pages

# Push to GitHub
git remote add origin https://github.com/yourusername/SocialTruthV2.git
git push -u origin gh-pages
```

Then enable GitHub Pages in repository settings.

Your app will be at: `https://yourusername.github.io/SocialTruthV2`

**Advantages:**
- Free hosting
- Direct from Git repository
- Great for open source projects

## Option 5: AWS S3 + CloudFront

### Setup

```bash
# Create S3 bucket
aws s3 mb s3://socialtruth-app

# Upload files
aws s3 sync . s3://socialtruth-app --exclude ".git/*"

# Enable static website hosting
aws s3 website s3://socialtruth-app \
  --index-document index.html

# Create CloudFront distribution (optional, for CDN)
aws cloudfront create-distribution \
  --origin-domain-name socialtruth-app.s3.amazonaws.com
```

**Advantages:**
- Highly scalable
- Excellent performance with CloudFront
- Custom domain support
- Full AWS integration

## Option 6: Azure Static Web Apps

### Setup

```bash
# Install Azure CLI
# Deploy
az staticwebapp create \
  --name SocialTruth \
  --resource-group MyResourceGroup \
  --source . \
  --location "Central US" \
  --branch main
```

**Advantages:**
- Free tier available
- Integrated with Azure services
- Custom domains
- API support

## Option 7: Simple HTTP Server (Development Only)

For local development and testing:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Visit: `http://localhost:8000`

**Use for:**
- Local testing only
- Not for production

## Comparison Table

| Platform | Free Tier | SSL | CDN | Ease | Best For |
|----------|-----------|-----|-----|------|----------|
| Firebase Hosting | ✅ Generous | ✅ Auto | ✅ Global | ⭐⭐⭐⭐⭐ | This app! |
| Netlify | ✅ Yes | ✅ Auto | ✅ Yes | ⭐⭐⭐⭐⭐ | Jamstack |
| Vercel | ✅ Yes | ✅ Auto | ✅ Edge | ⭐⭐⭐⭐⭐ | Next.js/React |
| GitHub Pages | ✅ Yes | ✅ Auto | ❌ No | ⭐⭐⭐⭐ | Open Source |
| AWS S3 | ❌ Paid | ⚠️ Manual | ⚠️ Extra | ⭐⭐⭐ | Enterprise |
| Azure | ✅ Limited | ✅ Auto | ✅ Yes | ⭐⭐⭐ | Microsoft Stack |

## Custom Domain Setup

### Firebase Hosting

```bash
firebase hosting:channel:deploy production --domain yourdomain.com
```

### Netlify

1. Go to Domain settings
2. Add custom domain
3. Update DNS records

### Vercel

```bash
vercel domains add yourdomain.com
```

## Environment Variables

Since this is a static site, environment variables need to be set at build time:

### Firebase

Create `.env` file:
```
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
```

### Netlify

Add in Netlify dashboard or `netlify.toml`:
```toml
[build.environment]
  FIREBASE_API_KEY = "your_key"
```

### Vercel

Add in Vercel dashboard or `vercel.json`:
```json
{
  "env": {
    "FIREBASE_API_KEY": "your_key"
  }
}
```

## SSL/HTTPS

All recommended platforms provide automatic SSL certificates via Let's Encrypt.

## Monitoring & Analytics

- Firebase Analytics (already integrated)
- Google Analytics
- Netlify Analytics
- Vercel Analytics
- CloudFlare Analytics (if using CloudFlare DNS)

## Best Practices

1. **Use Firebase Hosting** - Best integration with your Firebase backend
2. **Enable HTTPS** - All platforms do this automatically
3. **Set up monitoring** - Use Firebase Analytics
4. **Configure caching** - Already configured in firebase.json
5. **Use custom domain** - Better branding
6. **Set up CI/CD** - Auto-deploy from Git
7. **Monitor performance** - Use Lighthouse scores

## Recommended: Firebase Hosting

For this SocialTruth DAO application, **Firebase Hosting** is recommended because:

✅ Seamless integration with Firebase services (Firestore, Auth)
✅ Free tier is generous (10GB storage, 360MB/day bandwidth)
✅ Automatic SSL and global CDN
✅ Easy deployment and rollbacks
✅ Preview channels for testing
✅ Already configured in firebase.json

## Quick Start with Firebase

```bash
# 1. Update Firebase config
# Edit js/firebase-config.js with your credentials

# 2. Install Firebase tools
npm install -g firebase-tools

# 3. Deploy
firebase login
firebase init hosting
firebase deploy
```

Done! Your app is live at: `https://your-project-id.web.app`

---

Choose the platform that best fits your needs and experience level. For this application, Firebase Hosting is the recommended choice! 🚀

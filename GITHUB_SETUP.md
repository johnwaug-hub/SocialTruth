# GitHub Repository Setup Guide

This guide will help you set up the SocialTruth DAO repository on GitHub.

## 📦 What's Included

Your `socialtruth-dao.zip` file contains everything you need for a complete GitHub repository:

```
socialtruth-dao/
├── .github/                          # GitHub configuration
│   ├── workflows/
│   │   └── ci.yml                   # CI/CD workflow
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md           # Bug report template
│   │   └── feature_request.md      # Feature request template
│   └── pull_request_template.md    # PR template
├── contracts/                       # Smart contracts
│   ├── socialtruth.plutus          # News & voting validator
│   ├── truthtoken.plutus           # TRUTH token minting policy
│   ├── CompileValidator.hs         # Compilation script
│   └── generate-validator-address.sh
├── docs/                           # Documentation
│   ├── DEPLOYMENT_GUIDE.md         # Deployment instructions
│   ├── VALIDATOR_SETUP.md          # Validator setup
│   └── LAUNCH_CHECKLIST.md         # Testing checklist
├── .gitignore                      # Git ignore rules
├── CONTRIBUTING.md                 # Contribution guidelines
├── LICENSE                         # MIT License
├── README.md                       # Main readme
├── package.json                    # NPM metadata
├── index.html                      # Main application
└── socialtruth-mainnet.html        # Mainnet version (backup)
```

## 🚀 Quick Setup (5 minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `socialtruth-dao`
3. Description: `Decentralized truth verification platform on Cardano`
4. Choose: Public (or Private if you prefer)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 2: Upload Files

**Option A: Using GitHub Web Interface (Easiest)**

1. Unzip `socialtruth-dao.zip` on your computer
2. In your new GitHub repository, click "uploading an existing file"
3. Drag and drop ALL files and folders from the unzipped directory
4. Commit message: "Initial commit - SocialTruth DAO v1.0"
5. Click "Commit changes"

**Option B: Using Git Command Line**

```bash
# 1. Unzip the file
unzip socialtruth-dao.zip -d socialtruth-dao
cd socialtruth-dao

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. Commit
git commit -m "Initial commit - SocialTruth DAO v1.0"

# 5. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/socialtruth-dao.git

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Configure Repository Settings

1. Go to your repository Settings
2. Under "General":
   - Set website: `https://yourdomain.com` (when ready)
   - Add topics: `cardano`, `blockchain`, `dao`, `plutus`, `truth-verification`

3. Under "Pages" (optional - for hosting):
   - Source: Deploy from a branch
   - Branch: main / root
   - Save

## 🔧 Additional Configuration

### Enable GitHub Actions

The repository includes a CI workflow. To enable it:

1. Go to "Actions" tab
2. Click "I understand my workflows, go ahead and enable them"

### Set Up Branch Protection

1. Go to Settings → Branches
2. Add rule for `main` branch:
   - ✓ Require pull request reviews before merging
   - ✓ Require status checks to pass before merging
   - ✓ Require branches to be up to date before merging

### Add Repository Secrets (for CI/CD)

If you plan to add automated deployments:

1. Go to Settings → Secrets and variables → Actions
2. Add secrets like:
   - `BLOCKFROST_API_KEY` (your Blockfrost key)
   - Any other sensitive configuration

## 📝 Customization

### Update README.md

Replace placeholders in README.md:
- `yourusername` → your GitHub username
- `https://socialtruth.io` → your domain
- `@SocialTruthDAO` → your Twitter handle

### Update package.json

```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/YOUR_USERNAME/socialtruth-dao.git"
}
```

### Update Links

Search for `yourusername` in all files and replace with your actual GitHub username.

## 🌟 Repository Features

Your repository now has:

✅ **Professional README** with badges and comprehensive docs  
✅ **Contributing Guidelines** for community contributions  
✅ **Issue Templates** for bugs and features  
✅ **Pull Request Template** for standardized PRs  
✅ **GitHub Actions CI** for automated validation  
✅ **MIT License** for open source  
✅ **Proper .gitignore** to exclude sensitive files  
✅ **Complete Documentation** in /docs folder  
✅ **Smart Contracts** in /contracts folder  

## 📊 Making Your First Release

### Create a Release

1. Go to "Releases" → "Create a new release"
2. Tag version: `v1.0.0`
3. Release title: `SocialTruth DAO v1.0.0 - Initial Release`
4. Description:
```markdown
## 🎉 Initial Release

SocialTruth DAO is now live on Cardano Mainnet!

### Features
- Decentralized news verification
- TRUTH token staking and rewards
- Multi-wallet support (Nami, Eternl, Flint, Lace)
- On-chain vote recording
- Reputation system

### Configuration
- Network: Cardano Mainnet
- TRUTH Token: f7d9753d6f766edc8be954ceaaee06c48a748ca2368224b5b9d77135

### Quick Start
See [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md)
```

5. Upload `socialtruth-dao.zip` as release asset
6. Click "Publish release"

## 🔐 Security Best Practices

**IMPORTANT:** Never commit:
- Private keys (.skey files)
- Wallet seed phrases
- API keys (use GitHub Secrets instead)
- Personal wallet addresses

The `.gitignore` file is configured to prevent this, but always double-check!

## 📱 Social Media Integration

### Add Social Links

Create a `FUNDING.yml` in `.github/`:

```yaml
github: [your-username]
custom: ["https://yourwebsite.com", "https://twitter.com/SocialTruthDAO"]
```

### GitHub Repository Social Preview

1. Go to Settings → General
2. Scroll to "Social preview"
3. Upload a banner image (1200x630px recommended)

## 🚀 Next Steps

1. ✅ Repository created and files uploaded
2. 📝 Customize README with your info
3. 🔧 Configure repository settings
4. 🎉 Create your first release
5. 📢 Share on social media
6. 🤝 Invite contributors
7. 🌟 Get your first stars!

## 📞 Support

If you encounter any issues:
- Check the docs/ folder for detailed guides
- Create an issue in the repository
- Review CONTRIBUTING.md for guidelines

## 🎊 You're All Set!

Your SocialTruth DAO repository is now ready for the community. Happy building! 🚀

---

**Repository Checklist:**
- [ ] Repository created on GitHub
- [ ] All files uploaded
- [ ] README customized with your info
- [ ] Repository settings configured
- [ ] First release published
- [ ] Social media announced
- [ ] Community invited

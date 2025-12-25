# SocialTruth DAO

A decentralized truth verification platform built on Cardano blockchain. Community-powered fact-checking with tokenized incentives.

![Cardano](https://img.shields.io/badge/Cardano-Mainnet-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Plutus](https://img.shields.io/badge/Plutus-V2-purple)

## 🌟 Features

- **Decentralized Voting**: Community votes on news truthfulness
- **Token Staking**: Stake TRUTH tokens on your votes to earn rewards
- **On-Chain Records**: All submissions and votes permanently recorded on Cardano
- **Reputation System**: Build reputation through accurate voting (Bronze → Silver → Gold → Platinum)
- **Smart Contracts**: Plutus validators ensure fair play and automatic reward distribution
- **Multi-Wallet Support**: Nami, Eternl, Flint, and Lace wallet integration
- **Firebase Backend**: Real-time data synchronization and cloud storage
- **Analytics Dashboard**: Track platform statistics and user engagement

## 🎯 How It Works

1. **Submit News** - Pay 10 TRUTH tokens to submit news for verification
2. **Community Votes** - Users stake TRUTH tokens voting TRUE or FALSE
3. **Earn Rewards** - Accurate voters receive proportional rewards
4. **Build Reputation** - Consistent accuracy increases your tier and influence

## 🚀 Quick Start

### Prerequisites

- A Cardano wallet (Nami, Eternl, Flint, or Lace)
- TRUTH tokens for participation
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/socialtruth-dao.git
cd socialtruth-dao
```

2. Open the app:
```bash
# Simply open the HTML file in your browser
open index.html
```

3. Connect your wallet and start verifying news!

## 📁 Project Structure

```
socialtruth-dao/
├── index.html                    # Main application
├── firebase-integration.js       # Firebase backend module
├── contracts/                    # Smart contracts
│   ├── socialtruth.plutus       # News & voting validator
│   ├── truthtoken.plutus        # TRUTH token minting policy
│   ├── CompileValidator.hs      # Compilation script
│   └── generate-validator-address.sh
├── docs/                        # Documentation
│   ├── DEPLOYMENT_GUIDE.md      # Detailed deployment instructions
│   ├── VALIDATOR_SETUP.md       # Validator setup guide
│   ├── LAUNCH_CHECKLIST.md      # Pre-launch checklist
│   └── FIREBASE_INTEGRATION.md  # Firebase setup guide
├── LICENSE
└── README.md
```

## 🔧 Configuration

The app is pre-configured for Cardano Mainnet:

### TRUTH Token
- **Policy ID**: `f7d9753d6f766edc8be954ceaaee06c48a748ca2368224b5b9d77135`
- **Token Name**: TRUTHDA
- **Total Supply**: 10,000,000 TRUTH

### Network
- **Network**: Cardano Mainnet
- **Blockfrost API**: Configured (replace with your key for production)
- **Validator Address**: `addr1q8zns9rdm4xnq3ehlpf4ee0cksjv2mlmqv3de0278atxdet7glzxtk7nlqjx7kz7atl608vfxw7ahcznluv023kp0cgsw68nw4`

## 💎 TRUTH Token

The TRUTH token is the native utility token for SocialTruth DAO:

- **Submission Fee**: 10 TRUTH to submit news
- **Voting Stake**: Minimum 1 TRUTH to vote
- **Rewards**: Distributed to accurate voters
- **Governance**: Future DAO voting rights

## 🏗️ Smart Contracts

### News Validator (`socialtruth.plutus`)

Handles news submission and voting logic:
- Validates submission fees
- Records votes on-chain
- Enforces voting deadlines
- Manages reward distribution

### Token Minting Policy (`truthtoken.plutus`)

Controls TRUTH token supply:
- Maximum supply: 10M tokens
- Controlled minting
- Burn mechanism for deflationary tokenomics

## 📖 Documentation

- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Validator Setup](docs/VALIDATOR_SETUP.md) - How to set up the validator
- [Launch Checklist](docs/LAUNCH_CHECKLIST.md) - Pre-launch testing guide

## 🔐 Security

- All transactions require wallet signatures
- Smart contracts validate all operations
- On-chain vote recording prevents manipulation
- Time-locked voting periods
- Double-voting prevention

## 🛠️ Development

### Building Contracts

```bash
cd contracts
cabal build
```

### Generating Validator Address

```bash
cd contracts
./generate-validator-address.sh
```

### Testing

1. Connect wallet to testnet
2. Obtain test TRUTH tokens
3. Submit test news
4. Cast test votes
5. Verify transactions on Cardanoscan

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📊 Roadmap

- [x] Core voting mechanism
- [x] TRUTH token integration
- [x] Multi-wallet support
- [x] Cardano mainnet deployment
- [ ] Automated reward distribution
- [ ] Mobile app
- [ ] DAO governance module
- [ ] Category-specific validators
- [ ] AI-assisted fact verification
- [ ] Cross-chain bridge

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on [Cardano](https://cardano.org)
- Smart contracts powered by [Plutus](https://plutus.readthedocs.io)
- Uses [Lucid](https://github.com/spacebudz/lucid) for wallet interaction
- Blockchain data via [Blockfrost](https://blockfrost.io)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/socialtruth-dao/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/socialtruth-dao/discussions)
- **Twitter**: [@SocialTruthDAO](https://twitter.com/SocialTruthDAO)

## 🌐 Links

- **Website**: https://socialtruth.io (coming soon)
- **Documentation**: https://docs.socialtruth.io (coming soon)
- **Explorer**: [View on Cardanoscan](https://cardanoscan.io/token/f7d9753d6f766edc8be954ceaaee06c48a748ca2368224b5b9d77135.54525554484441)

---

**Built with ❤️ on Cardano**

*Empowering truth through decentralization*

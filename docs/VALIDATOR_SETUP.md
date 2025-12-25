# Quick Start: Getting Your Validator Address

You have **3 options** to get a validator address for SocialTruth DAO:

## ✅ Option 1: Use Treasury Address (FASTEST - Recommended for Testing/MVP)

**Time: 2 minutes**

1. Open your Cardano wallet (Nami, Eternl, Flint, or Lace)
2. Create a new account called "SocialTruth Treasury"
3. Copy the address
4. Open `socialtruth-mainnet.html`
5. Find line ~395: `const VALIDATOR_ADDRESS = "";`
6. Paste your address: `const VALIDATOR_ADDRESS = "addr1...your_address...";`
7. Done! You can start testing immediately

**Pros:**
- Instant setup
- No compilation needed
- Easy to manage
- Can manually process rewards

**Cons:**
- Not fully automated
- Requires manual reward distribution
- Less decentralized initially

---

## ⚙️ Option 2: Use Cardano CLI (MEDIUM - Best for Production)

**Time: 15-30 minutes**  
**Requirements:** Cardano node + cardano-cli installed

### Step-by-Step:

1. **Install Cardano CLI** (if not already installed):
```bash
# On Linux/Mac
curl -sS https://get-ghcup.haskell.org | sh
ghcup install ghc 8.10.7
ghcup install cabal 3.6.2.0

# Clone and build cardano-node
git clone https://github.com/input-output-hk/cardano-node.git
cd cardano-node
cabal build cardano-cli
```

2. **Run the generation script:**
```bash
cd contracts
./generate-validator-address.sh
```

3. **The script will output your validator address** - copy it and paste into the HTML file.

---

## 🔧 Option 3: Compile Plutus Contract (ADVANCED - Full Automation)

**Time: 1-2 hours**  
**Requirements:** Haskell, Plutus libraries, and development experience

1. Set up Plutus development environment
2. Compile `socialtruth.plutus` with `CompileValidator.hs`
3. Generate the validator address
4. Deploy to Cardano mainnet

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 📝 Current Configuration

Your policy ID is already set:
```
TRUTH_POLICY_ID = "f7d9753d6f766edc8be954ceaaee06c48a748ca2368224b5b9d77135"
```

You just need to add the validator address!

---

## 🚀 Recommended Path for Quick Testing

1. Use **Option 1** (Treasury Address) to test immediately
2. Later upgrade to **Option 2** (Cardano CLI) for production
3. Eventually implement **Option 3** (Full Smart Contract) for complete automation

---

## Need Help?

If you encounter issues:
- Make sure your Blockfrost API key is valid
- Ensure you have a Cardano wallet installed
- Check that you have test TRUTH tokens in your wallet
- Verify you're on Cardano Mainnet

Your Blockfrost API key is already configured: `mainnetKZr27HF2BJa890FEbzTx85DQ7st3Eq0h`

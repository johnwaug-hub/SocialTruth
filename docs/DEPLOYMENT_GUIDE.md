# SocialTruth DAO - Cardano Mainnet Deployment Guide

## Overview
SocialTruth DAO is a decentralized truth verification platform built on Cardano. This guide will help you deploy the smart contracts and configure the application for mainnet use.

## Prerequisites
- Cardano node access (or Blockfrost API key - already configured)
- Cardano wallet with ADA for deployment costs
- Development environment for Plutus contracts (Cabal, GHC)
- Basic understanding of Cardano smart contracts

## Files Included
1. `socialtruth-mainnet.html` - Main application (Mainnet ready)
2. `socialtruth.plutus` - News submission and voting validator
3. `truthtoken.plutus` - TRUTH token minting policy

## Configuration

### Current Mainnet Setup
- **Network**: Cardano Mainnet
- **Blockfrost API Key**: mainnetKZr27HF2BJa890FEbzTx85DQ7st3Eq0h (configured)
- **Token Name**: TRUTH
- **Submission Fee**: 10 TRUTH tokens
- **Minimum Stake**: 1 TRUTH token

## Deployment Steps

### Step 1: Compile Smart Contracts

The Plutus contracts need to be compiled to their serialized form:

```bash
# Install dependencies
cabal update
cabal install plutus-ledger-api
cabal install plutus-tx

# Compile the contracts
cabal run compile-contracts
```

This will generate:
- `socialtruth-validator.plutus` (serialized validator)
- `truth-minting-policy.plutus` (serialized minting policy)

### Step 2: Deploy TRUTH Token Minting Policy

1. Generate policy ID:
```bash
cardano-cli transaction policyid --script-file truth-minting-policy.plutus
```

2. Mint initial TRUTH token supply (10,000,000 TRUTH):
```bash
# Build minting transaction
cardano-cli transaction build \
  --mainnet \
  --tx-in <YOUR_UTXO> \
  --tx-out <YOUR_ADDRESS>+2000000+"10000000 <POLICY_ID>.54525554484441" \
  --mint "10000000 <POLICY_ID>.54525554484441" \
  --mint-script-file truth-minting-policy.plutus \
  --mint-redeemer-value '{"constructor":0,"fields":[{"int":10000000}]}' \
  --change-address <YOUR_ADDRESS> \
  --out-file mint-truth.raw

# Sign transaction
cardano-cli transaction sign \
  --tx-body-file mint-truth.raw \
  --signing-key-file payment.skey \
  --mainnet \
  --out-file mint-truth.signed

# Submit transaction
cardano-cli transaction submit \
  --mainnet \
  --tx-file mint-truth.signed
```

3. Update the HTML file with the policy ID:
   - Open `socialtruth-mainnet.html`
   - Find line ~390: `const TRUTH_POLICY_ID = "";`
   - Replace with: `const TRUTH_POLICY_ID = "<YOUR_POLICY_ID>";`

### Step 3: Deploy Validator Contract

1. Generate validator address:
```bash
cardano-cli address build \
  --payment-script-file socialtruth-validator.plutus \
  --mainnet \
  --out-file validator.addr
```

2. Fund the validator with initial ADA:
```bash
cardano-cli transaction build \
  --mainnet \
  --tx-in <YOUR_UTXO> \
  --tx-out $(cat validator.addr)+10000000 \
  --change-address <YOUR_ADDRESS> \
  --out-file fund-validator.raw

cardano-cli transaction sign \
  --tx-body-file fund-validator.raw \
  --signing-key-file payment.skey \
  --mainnet \
  --out-file fund-validator.signed

cardano-cli transaction submit \
  --mainnet \
  --tx-file fund-validator.signed
```

3. Update the HTML file with validator address:
   - Find line ~395: `const VALIDATOR_ADDRESS = "";`
   - Replace with: `const VALIDATOR_ADDRESS = "<VALIDATOR_ADDRESS>";`

### Step 4: Configure Token Distribution

Create a distribution mechanism for TRUTH tokens to users:

```javascript
// Example distribution function (add to app)
async function distributeInitialTokens(recipientAddress, amount) {
    const tx = await lucid
        .newTx()
        .payToAddress(recipientAddress, {
            lovelace: 2_000000n,
            [TRUTH_POLICY_ID + TRUTH_TOKEN_NAME]: BigInt(amount * 1_000000)
        })
        .complete();
    
    const signedTx = await tx.sign().complete();
    return await signedTx.submit();
}
```

### Step 5: Test on Mainnet

Before going live, test all functionality:

1. **Connect Wallet**: Test wallet connection with Nami, Eternl, Flint, or Lace
2. **Submit News**: Submit a test news article (requires 10 TRUTH)
3. **Vote**: Cast test votes with TRUTH token stakes
4. **Verify Transactions**: Check all transactions on Cardanoscan

## Smart Contract Features

### News Submission Validator
- **Minimum Fee**: 10 TRUTH tokens
- **Voting Period**: 7 days (configurable)
- **Metadata**: Stored on-chain (title, URL, description, category)

### Voting Mechanism
- **Minimum Stake**: 1 TRUTH token
- **Vote Recording**: All votes stored on-chain
- **Reward Distribution**: Automatic to winning voters

### TRUTH Token
- **Total Supply**: 10,000,000 TRUTH
- **Decimals**: 6
- **Token Name**: TRUTHDA (hex: 54525554484441)
- **Use Cases**: Submission fees, voting stakes, rewards

## Transaction Flow

### Submit News
1. User pays 10 TRUTH + 2 ADA
2. Transaction includes metadata with news details
3. Smart contract validates submission fee
4. News entry created with 7-day voting period

### Cast Vote
1. User stakes TRUTH tokens (minimum 1)
2. Vote recorded as TRUE or FALSE
3. Metadata includes vote decision and stake amount
4. Transaction locks TRUTH until voting ends

### Finalize Voting
1. After voting period ends, anyone can finalize
2. Smart contract determines winning side
3. Rewards distributed proportionally to winners
4. Losers' stakes redistributed to winners

## Security Considerations

1. **Script Validation**: All transactions validated on-chain
2. **Double Voting Prevention**: Users can only vote once per news item
3. **Time-Locked**: Voting periods enforced by validator
4. **Signature Required**: All transactions require wallet signature

## Maintenance

### Monitor Contract Activity
```bash
# Query validator UTXOs
cardano-cli query utxo --address $(cat validator.addr) --mainnet

# Check transaction history
curl -H "project_id: mainnetKZr27HF2BJa890FEbzTx85DQ7st3Eq0h" \
  https://cardano-mainnet.blockfrost.io/api/v0/addresses/<VALIDATOR_ADDRESS>/transactions
```

### Update Parameters
To modify contract parameters (fees, voting period), you'll need to:
1. Deploy new validator with updated parameters
2. Migrate funds from old to new validator
3. Update HTML with new validator address

## Troubleshooting

### Common Issues

**"Insufficient TRUTH tokens"**
- Ensure users have TRUTH tokens distributed
- Check token balance before transactions

**"Transaction failed to build"**
- Verify UTXOs are available
- Check ADA balance for fees
- Ensure script is properly compiled

**"Wallet not detected"**
- Install wallet extension (Nami, Eternl, etc.)
- Refresh page after installation
- Check browser compatibility

### Support Resources
- Cardano Documentation: https://docs.cardano.org
- Plutus Documentation: https://plutus.readthedocs.io
- Blockfrost API: https://docs.blockfrost.io

## Production Checklist

Before launching to public:

- [ ] Smart contracts compiled and tested
- [ ] TRUTH tokens minted and distributed
- [ ] Validator deployed and funded
- [ ] HTML updated with correct addresses
- [ ] Transaction signing tested
- [ ] Error handling verified
- [ ] Security audit completed
- [ ] User documentation prepared
- [ ] Support channels established
- [ ] Backup and recovery plan in place

## Next Steps

1. **Complete Token Minting**: Follow Step 2 to mint TRUTH tokens
2. **Deploy Contracts**: Execute Steps 1 and 3 for contract deployment
3. **Update Configuration**: Set policy ID and validator address in HTML
4. **Test Thoroughly**: Complete Step 5 testing procedures
5. **Launch**: Deploy to production server

## License & Credits

SocialTruth DAO - Built on Cardano
Smart contracts: Plutus V2
Frontend: Lucid Cardano library

---

For additional support or questions, please refer to the Cardano developer community or file an issue in the project repository.

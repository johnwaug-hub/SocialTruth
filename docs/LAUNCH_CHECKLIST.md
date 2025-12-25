# SocialTruth DAO - Configuration Complete ✅

## Current Configuration

### ✅ Mainnet Setup
- **Network**: Cardano Mainnet
- **Blockfrost API**: `mainnetKZr27HF2BJa890FEbzTx85DQ7st3Eq0h`

### ✅ TRUTH Token
- **Policy ID**: `f7d9753d6f766edc8be954ceaaee06c48a748ca2368224b5b9d77135`
- **Token Name**: TRUTHDA (hex: 54525554484441)
- **Decimals**: 6
- **Total Supply**: 10,000,000 TRUTH

### ✅ Validator/Treasury Address
- **Address**: `addr1q8zns9rdm4xnq3ehlpf4ee0cksjv2mlmqv3de0278atxdet7glzxtk7nlqjx7kz7atl608vfxw7ahcznluv023kp0cgsw68nw4`

### Transaction Fees
- **News Submission**: 10 TRUTH + ~0.5 ADA
- **Vote Minimum**: 1 TRUTH + ~0.5 ADA
- **Voting Period**: 7 days

---

## 🚀 Pre-Launch Checklist

### Phase 1: Testing (Do This Now)
- [ ] Open `socialtruth-mainnet.html` in a web browser
- [ ] Install a Cardano wallet (Nami, Eternl, Flint, or Lace)
- [ ] Connect your wallet to the app
- [ ] Verify wallet connection shows your address and ADA balance
- [ ] Check that TRUTH balance displays (should show 0 if you don't have tokens yet)

### Phase 2: Token Distribution
- [ ] Distribute TRUTH tokens to test users/yourself
- [ ] Verify token balance shows correctly in the app
- [ ] Test with at least 11 TRUTH tokens (10 for submission + 1 for voting)

### Phase 3: Functionality Testing
- [ ] Test news submission
  - [ ] Fill out the form with test data
  - [ ] Confirm 10 TRUTH + ADA transaction
  - [ ] Verify transaction appears on Cardanoscan
  - [ ] Check news appears in feed
- [ ] Test voting
  - [ ] Select a news item
  - [ ] Enter stake amount (minimum 1 TRUTH)
  - [ ] Vote TRUE or FALSE
  - [ ] Confirm transaction
  - [ ] Verify vote recorded on blockchain
- [ ] Test filters (All/Voting/Verified)
- [ ] Test leaderboard display
- [ ] Test wallet disconnect/reconnect

### Phase 4: Transaction Verification
- [ ] Check validator address on Cardanoscan: https://cardanoscan.io/address/addr1q8zns9rdm4xnq3ehlpf4ee0cksjv2mlmqv3de0278atxdet7glzxtk7nlqjx7kz7atl608vfxw7ahcznluv023kp0cgsw68nw4
- [ ] Verify submission fees arrive at validator address
- [ ] Verify vote stakes arrive at validator address
- [ ] Check transaction metadata contains news/vote data

### Phase 5: Error Handling
- [ ] Test insufficient TRUTH balance error
- [ ] Test insufficient ADA for fees error
- [ ] Test wallet rejection (cancel transaction)
- [ ] Test without wallet connected
- [ ] Test with wrong network (if applicable)

### Phase 6: User Experience
- [ ] Test on desktop browser
- [ ] Test on mobile browser
- [ ] Test wallet connection on mobile
- [ ] Verify all notifications appear correctly
- [ ] Check loading states during transactions
- [ ] Verify transaction links work

---

## 📝 How to Distribute TRUTH Tokens

Since you have the TRUTH token policy ID, you need to send tokens to users. Here's how:

### Using Cardano CLI:
```bash
cardano-cli transaction build \
  --mainnet \
  --tx-in <YOUR_UTXO> \
  --tx-out <RECIPIENT_ADDRESS>+2000000+"100000000 f7d9753d6f766edc8be954ceaaee06c48a748ca2368224b5b9d77135.54525554484441" \
  --change-address <YOUR_ADDRESS> \
  --out-file send-truth.raw

cardano-cli transaction sign \
  --tx-body-file send-truth.raw \
  --signing-key-file payment.skey \
  --mainnet \
  --out-file send-truth.signed

cardano-cli transaction submit \
  --mainnet \
  --tx-file send-truth.signed
```

### Using Wallet (Easier):
1. Open your wallet that holds TRUTH tokens
2. Go to Send
3. Select the TRUTH token
4. Enter recipient address
5. Enter amount (remember: 6 decimals, so 100 TRUTH = 100000000)
6. Send transaction

---

## 🔍 Transaction Monitoring

### Check Validator Activity:
```bash
# Using Blockfrost API
curl -H "project_id: mainnetKZr27HF2BJa890FEbzTx85DQ7st3Eq0h" \
  https://cardano-mainnet.blockfrost.io/api/v0/addresses/addr1q8zns9rdm4xnq3ehlpf4ee0cksjv2mlmqv3de0278atxdet7glzxtk7nlqjx7kz7atl608vfxw7ahcznluv023kp0cgsw68nw4/transactions
```

### Cardanoscan URLs:
- **Validator Address**: https://cardanoscan.io/address/addr1q8zns9rdm4xnq3ehlpf4ee0cksjv2mlmqv3de0278atxdet7glzxtk7nlqjx7kz7atl608vfxw7ahcznluv023kp0cgsw68nw4
- **TRUTH Token**: https://cardanoscan.io/token/f7d9753d6f766edc8be954ceaaee06c48a748ca2368224b5b9d77135.54525554484441

---

## 🎯 Next Steps After Testing

1. **Fund the Validator**: Send 10-20 ADA to the validator address for operational costs
2. **Distribute Tokens**: Send TRUTH tokens to initial users/testers
3. **Test Thoroughly**: Complete all checklist items above
4. **Deploy to Web**: Upload `socialtruth-mainnet.html` to your web server
5. **Monitor**: Watch validator address for incoming transactions
6. **Iterate**: Gather feedback and improve

---

## ⚠️ Important Notes

### Security:
- Keep private keys for the validator address SECURE
- This address will hold user stakes and submission fees
- Consider using a hardware wallet for the validator account

### Token Distribution:
- Users need TRUTH tokens before they can submit news or vote
- Recommended initial distribution: 50-100 TRUTH per user
- Keep a reserve for rewards and operational costs

### Reward Distribution:
- Currently requires manual distribution from validator address
- After voting closes, calculate winner shares
- Send proportional TRUTH rewards to accurate voters
- Can be automated with additional smart contract logic later

---

## 🆘 Troubleshooting

### "Wallet not detected"
- Install wallet extension
- Refresh the page
- Make sure you're on a supported browser (Chrome, Brave, Edge)

### "Insufficient TRUTH tokens"
- You need TRUTH tokens to interact with the platform
- Get tokens from the treasury/admin
- Verify token policy ID matches

### "Transaction failed"
- Check you have enough ADA for fees (~0.5-1 ADA)
- Verify you have enough TRUTH for the action
- Make sure you're on Cardano Mainnet
- Check Blockfrost API is working

### Balance shows 0 TRUTH
- Verify you have TRUTH tokens in your wallet
- Check the correct policy ID is configured
- Tokens may take a moment to appear after receiving

---

## 📊 Success Metrics to Track

- Total news submissions
- Total votes cast
- Active users
- Total TRUTH staked
- Average voting participation
- Accuracy rates of top voters
- Transaction volume on validator address

---

## Ready to Launch! 🚀

Your SocialTruth DAO is now fully configured for Cardano Mainnet. Complete the testing checklist and you're ready to go live!

**Configuration Summary:**
- ✅ Mainnet Ready
- ✅ TRUTH Token Configured
- ✅ Validator Address Set
- ✅ Transaction Signing Implemented
- ✅ Blockfrost Connected

Just distribute some TRUTH tokens and start testing!

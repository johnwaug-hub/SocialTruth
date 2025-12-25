#!/bin/bash

# SocialTruth Validator Address Generation Script
# This script generates the Cardano address for the validator contract

echo "=== SocialTruth DAO Validator Address Generator ==="
echo ""

# Check if cardano-cli is installed
if ! command -v cardano-cli &> /dev/null; then
    echo "ERROR: cardano-cli is not installed"
    echo "Please install cardano-cli from: https://github.com/input-output-hk/cardano-node"
    exit 1
fi

echo "Step 1: Checking for validator script file..."
if [ ! -f "socialtruth-validator.plutus" ]; then
    echo "ERROR: socialtruth-validator.plutus not found"
    echo "You need to compile the Plutus contract first"
    exit 1
fi

echo "Step 2: Generating script address..."
cardano-cli address build \
    --payment-script-file socialtruth-validator.plutus \
    --mainnet \
    --out-file validator.addr

if [ -f "validator.addr" ]; then
    VALIDATOR_ADDRESS=$(cat validator.addr)
    echo ""
    echo "✓ Success! Validator address generated:"
    echo ""
    echo "================================================"
    echo "$VALIDATOR_ADDRESS"
    echo "================================================"
    echo ""
    echo "Copy this address and paste it into the HTML file at line ~395"
    echo "Replace: const VALIDATOR_ADDRESS = \"\";"
    echo "With:    const VALIDATOR_ADDRESS = \"$VALIDATOR_ADDRESS\";"
    echo ""
    
    # Also generate the script hash
    echo "Generating script hash..."
    cardano-cli transaction policyid \
        --script-file socialtruth-validator.plutus > validator.hash
    
    SCRIPT_HASH=$(cat validator.hash)
    echo "Script Hash: $SCRIPT_HASH"
    echo ""
else
    echo "ERROR: Failed to generate validator address"
    exit 1
fi

echo "Next steps:"
echo "1. Fund the validator address with some ADA (minimum 5-10 ADA recommended)"
echo "2. Update the HTML file with the validator address"
echo "3. Test the application"

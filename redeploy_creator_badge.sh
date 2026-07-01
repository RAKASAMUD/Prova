#!/bin/bash
set -e
export PATH="$(pwd)/bin:$PATH"
export LOCALAPPDATA="C:\\Users\\hp5cd\\AppData\\Local"
export APPDATA="C:\\Users\\hp5cd\\AppData\\Roaming"
export USERPROFILE="C:\\Users\\hp5cd"

CREATOR_ADDR=$(stellar keys address creator)
echo "Creator address: $CREATOR_ADDR"

cd contracts/stellar-risc0-verifier
ROUTER_ID=$(grep -A 5 "chains.stellar-testnet" deployment.toml | grep "router" | cut -d '"' -f 2)
echo "Router ID: $ROUTER_ID"

cd ../badge

BADGE_ID="CC2QUDJSG7ZYGOY4UDGIRSNRHC6DJK52UJDXKKOASNO2KCVGIFAWB663"
echo "Creator Badge ID: $BADGE_ID"

echo "Initializing badge contract..."
stellar contract invoke --network testnet --source creator --id $BADGE_ID -- initialize --admin $CREATOR_ADDR --trusted_image_id 0101010101010101010101010101010101010101010101010101010101010101 --router $ROUTER_ID --self_id 6ff7333ff19e1f043f8ff7b03ada62cad90b9cd4af911d72f148d14787e7fefd

echo "Done!"
echo "BADGE_ID=$BADGE_ID"
echo "ROUTER_ID=$ROUTER_ID"
echo "CREATOR_ADDR=$CREATOR_ADDR"

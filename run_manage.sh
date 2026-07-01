#!/bin/bash
set -e
export PATH="$(pwd)/bin:$PATH"
export LOCALAPPDATA="C:\\Users\\hp5cd\\AppData\\Local"
export APPDATA="C:\\Users\\hp5cd\\AppData\\Roaming"
export USERPROFILE="C:\\Users\\hp5cd"

CREATOR_ADDR=$(stellar keys address creator)
echo "Creator address: $CREATOR_ADDR"

cd contracts/stellar-risc0-verifier

echo "1. Deploying Router..."
./scripts/manage.sh deploy-router -n testnet -a creator --min-delay 0 --admin $CREATOR_ADDR

echo "2. Deploying Verifier..."
./scripts/manage.sh deploy-verifier -n testnet -a creator

echo "3. Scheduling Add Verifier..."
./scripts/manage.sh schedule-add-verifier -n testnet -a creator --selector 73c457ba

echo "4. Executing Add Verifier..."
./scripts/manage.sh execute-add-verifier -n testnet -a creator --selector 73c457ba

echo "Done verifier stack deployment."

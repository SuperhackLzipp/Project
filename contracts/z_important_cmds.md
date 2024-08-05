### format code
forge fmt

### compile all smart contracts
```bash
forge build
```

### deploy a smart contract
1. create a script in ./script named as the original but with *.s.sol
2. run this to load env vars needed
```bash
source .env
```
3. run this for test deployment
```bash
forge script script/<filename>:<scriptname> --rpc-url $SEPOLIA_RPC_URL
```
or this for proper deployment
```bash
forge script script/<filename>:<scriptname> --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```
or this for veryfying using blockscout
```bash
forge script script/<filename>:<scriptname> --rpc-url $SEPOLIA_RPC_URL --broadcast --verify --verifier blockscout --verifier-url $BLOCKSCOUT_URL
```
4. go to etherscan to check deployment
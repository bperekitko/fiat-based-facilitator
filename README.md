# Simple implementation of Aave GHO token facilitator. Using proof-of-reserves for off-chain collateral.

Testing:
- create .env file based on the provided .env-example

```
npm install
npx hardhat node
```

Tasks to run for deploying facilitator to local network and minting GHO:
```
npx hardhat deploy-aggregator
```

```
npx hardhat deploy-facilitator <aggregator-address>
```
```
npx hardhat add-facilitator <facilitator-address>
```
```
npx hardhat add-reserves <amount <aggregator-address>
```

```
npx hardhat mint-gho <amount <facilitator-address>
```

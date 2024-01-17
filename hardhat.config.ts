import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';
import { HardhatUserConfig, task } from "hardhat/config";

import './scripts/gho-token';
import './scripts/deploy';
import './scripts/mint';

dotenv.config()

const config: HardhatUserConfig = {
  defaultNetwork: "localhost",
  networks: {
    hardhat:{
      forking:{
        url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.MAINNET_ALCHEMY_API_KEY}`,
      },
      accounts: [{privateKey: `${process.env.WALLET_PRIVATE_KEY}`, balance: `${5 * 10**18}`}]
    },
  },
  solidity: "0.8.20",
};

export default config;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    const balance = await hre.ethers.provider.getBalance(account.address);

    const balanceInEther = hre.ethers.formatEther(balance.toString());
    console.log(account.address, ' balance: ', balanceInEther, 'ETH');
  }
});

task('random-wallet', 'Generates new random wallet', async (taskArgs, hre) => {
  const wallet = hre.ethers.Wallet.createRandom();
  console.log('address:', wallet.address)
  console.log('mnemonic:', wallet.mnemonic?.phrase)
  console.log('privateKey:', wallet.privateKey)
})

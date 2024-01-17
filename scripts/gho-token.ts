import { task } from 'hardhat/config';
import { GHO_ADDRESS, TREASURY_ADDRESS } from './mainnet-contracts';

task('getGhoFacilitators', async (_, hre) => {
    const gho = await hre.ethers.getContractAt('IGhoToken', GHO_ADDRESS);
    const faiclitators = await gho.getFacilitator('0x2D0Ed844889e3927F6122FE2B24b3AF17F03ab04');
    console.log(`Facilitators: `, faiclitators);
})

task('getTreasuryBalance', async (_, hre) => {
    const gho = await hre.ethers.getContractAt('IGhoToken', GHO_ADDRESS);

    const balance = await gho.balanceOf(TREASURY_ADDRESS);
    console.log('Treasury balance: ', hre.ethers.formatEther(balance.toString()), ' GHO');
})

task('my-gho-balance', async (_, hre) => {
    const gho = await hre.ethers.getContractAt('IGhoToken', GHO_ADDRESS);
    const myAddress = (await hre.ethers.getSigners())[0].address;
    const balance = await gho.balanceOf(myAddress);
    console.log('My balance: ', hre.ethers.formatEther(balance.toString()), ' GHO');
})

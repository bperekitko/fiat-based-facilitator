import { task } from 'hardhat/config';
import { GHO_ADDRESS } from './mainnet-contracts';

task('add-reserves', async (_, hre) => {
    const agregatorContract = await hre.ethers.getContractAt('MockReservesAggregator', '0x2d0bdf096d9e379e373c66def6dae1525205f53f');
    console.log('Current reserves: ', (await agregatorContract.latestRoundData())[1]);

    const addTx = await agregatorContract.increaseReserves(100n * 10n**18n);
    await addTx.wait();

    console.log('After addReserves: ', (await agregatorContract.latestRoundData())[1]);
})

task('isHealthy',async (_, hre) => {
    const facilitatorContract = await hre.ethers.getContractAt('FiatFacilitator', '0x2d0ed844889e3927f6122fe2b24b3af17f03ab04');

    const isHealthy = await facilitatorContract.isHealthy();
    console.log('IsHealthy: ', isHealthy);
})

task('mint-gho', async (_, hre) => {
    const facilitatorContract = await hre.ethers.getContractAt('FiatFacilitator', '0x2d0ed844889e3927f6122fe2b24b3af17f03ab04');

    const mintTx = await facilitatorContract.mint(10n * 10n**18n);
    await mintTx.wait();

    const gho = await hre.ethers.getContractAt('IGhoToken', GHO_ADDRESS);
    const myAddress = (await hre.ethers.getSigners())[0].address;
    const myBalance = await gho.balanceOf(myAddress);
    const facilitatorBalance = await gho.balanceOf(await facilitatorContract.getAddress());
    console.log('MyGhoBalance: ', hre.ethers.formatEther(myBalance.toString()), ' GHO');
    console.log('FacilitatorBalance: ', hre.ethers.formatEther(facilitatorBalance.toString()), ' GHO');
})

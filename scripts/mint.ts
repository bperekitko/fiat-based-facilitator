import { task } from 'hardhat/config';
import { GHO_ADDRESS } from './mainnet-contracts';

task('add-reserves')
    .addPositionalParam('amount')
    .addPositionalParam('aggregatorAddress')
    .setAction(async (args, hre) => {
        const aggregatorAddress = args['aggregatorAddress'];
        const agregatorContract = await hre.ethers.getContractAt('MockReservesAggregator', aggregatorAddress);
        console.log('Current reserves: ', (await agregatorContract.latestRoundData())[1]);

        const amount = args['amount'];
        const addTx = await agregatorContract.increaseReserves(BigInt(amount) * 10n ** 18n);
        await addTx.wait();

        console.log('After addReserves: ', (await agregatorContract.latestRoundData())[1]);
    })

task('mint-gho')
.addPositionalParam('amount')
.addPositionalParam('facilitatorAddress')
    .setAction(async (args, hre) => {
        const facilitatorAddress = args['facilitatorAddress'];
        const facilitatorContract = await hre.ethers.getContractAt('FiatFacilitator', facilitatorAddress);

        const amount = args['amount'];
        const mintTx = await facilitatorContract.mint(BigInt(amount) * 10n ** 18n);
        await mintTx.wait();

        const gho = await hre.ethers.getContractAt('IGhoToken', GHO_ADDRESS);
        const myAddress = (await hre.ethers.getSigners())[0].address;
        const myBalance = await gho.balanceOf(myAddress);
        const facilitatorBalance = await gho.balanceOf(await facilitatorContract.getAddress());
        console.log('MyGhoBalance: ', hre.ethers.formatEther(myBalance.toString()), ' GHO');
        console.log('FacilitatorBalance: ', hre.ethers.formatEther(facilitatorBalance.toString()), ' GHO');
    })

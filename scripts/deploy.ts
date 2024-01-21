import { task } from 'hardhat/config';
import { FACILITATOR_ADMIN_ADDRESS, GHO_ADDRESS, TREASURY_ADDRESS } from './mainnet-contracts';

task('deploy-aggregator', async (_, hre) => {
    const deploying = await hre.ethers.deployContract('MockReservesAggregator');
    const agregatorContract = await deploying.waitForDeployment();
    console.log('Agregator deployed at: ', await agregatorContract.getAddress());
})


task('deploy-facilitator')
.addPositionalParam('aggregatorAddress')
.setAction( async (args, hre) => {
    const aggregatorAddress = args['aggregatorAddress'];
    const deploying = await hre.ethers.deployContract('FiatFacilitator', [GHO_ADDRESS, TREASURY_ADDRESS, aggregatorAddress]);
    const facilitator = await deploying.waitForDeployment();
    console.log('Facilitator deployed at: ', await facilitator.getAddress());
})


task('add-facilitator')
.addPositionalParam('facilitatorAddress')
.setAction( async (args, hre) => {
    const facilitatorAddress = args['facilitatorAddress'];
    const ghoToken = await hre.ethers.getContractAt('IGhoToken', GHO_ADDRESS);

    const signer = (await hre.ethers.getSigners())[0];

    const sendTx = await signer.sendTransaction({to: FACILITATOR_ADMIN_ADDRESS, value: hre.ethers.parseEther('1')})
    await sendTx.wait();
  
    const admin = await hre.ethers.getImpersonatedSigner(FACILITATOR_ADMIN_ADDRESS);
    const adminGho = ghoToken.connect(admin);
    const addTx = await adminGho.addFacilitator(facilitatorAddress, 'FiatFacilitator', 1000n*10n**18n);
    await addTx.wait();

    const faiclitators = await ghoToken.getFacilitatorsList();
    console.log('Facilitators: ', faiclitators);
})


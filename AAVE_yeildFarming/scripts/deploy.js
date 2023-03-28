const hre = require("hardhat");
const Holder = process.env.Holder;
async function main() {
    require('dotenv').config();
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [Holder],
    });

    signer = await ethers.getSigner(Holder);
    console.log("Deploying contracts with the account:", signer.address);
    const MyContract = await ethers.getContractFactory("FlashLoan", signer);
    const myContract = await MyContract.deploy(process.env.AAVEpoolAddresProvider);
    console.log("address:", myContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
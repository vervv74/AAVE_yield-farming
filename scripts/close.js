require("@nomiclabs/hardhat-waffle");
const Sc = require('../artifacts/contracts/FL.sol/FlashLoan.json');
const { POSClient, use } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");


use(Web3ClientPlugin);
(async () => {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [process.env.Holder],
    });
    signer = await ethers.getSigner(process.env.Holder);
    const posClient = new POSClient();

    await posClient.init({
        network: 'mainnet',
        version: 'v1',
        parent: {
            provider: signer,
            defaultConfig: {
                from: signer.address
            }
        },
        child: {
            provider: signer,
            defaultConfig: {
                from: signer.address
            }
        },

    });

    mycontract = new ethers.Contract(process.env.ContractAdress, Sc.abi, signer);
    USDCToken = posClient.erc20(process.env.USDC);
    USDTToken = posClient.erc20(process.env.USDT);
    aUSDCToken = posClient.erc20(process.env.aUSDC);
    aUSDTToken = posClient.erc20(process.env.aUSDT);
    qwe = await mycontract.getUserAccountData(process.env.AAVEpool, mycontract.address);
    console.log(qwe);
    balance1 = await USDCToken.getBalance(mycontract.address);
    balance2 = await USDTToken.getBalance(mycontract.address);
    balance3 = await aUSDCToken.getBalance(mycontract.address);
    balance4 = await aUSDTToken.getBalance(mycontract.address);
    console.log(`  mycontractUSDC ${balance1} mycontractUSDT ${balance2}  mycontract_aUSDC ${balance3} mycontract_aUSDT ${balance4}`);


   closeSum =  await mycontract.closeSum(process.env.AAVEpool, process.env.USDC, process.env.USDT, process.env.QuickSwapUniswapV2Router02);
    console.log(closeSum);

    gas = await mycontract.estimateGas.requestFlashLoan(process.env.USDT, process.env.USDC, ethers.BigNumber.from(closeSum), 1);
    receipt = await mycontract.requestFlashLoan(process.env.USDT, process.env.USDC, ethers.BigNumber.from(closeSum), 1, {
        gasLimit: ethers.BigNumber.from(gas).mul(ethers.BigNumber.from('2'))
    });
    await receipt.wait();
    qwe = await mycontract.getUserAccountData(process.env.AAVEpool, mycontract.address);
    console.log(qwe);
    balance1 = await USDCToken.getBalance(mycontract.address);
    balance2 = await USDTToken.getBalance(mycontract.address);
    balance3 = await aUSDCToken.getBalance(mycontract.address);
    balance4 = await aUSDTToken.getBalance(mycontract.address);
    console.log(`  mycontractUSDC ${balance1} mycontractUSDT ${balance2}  mycontract_aUSDC ${balance3} mycontract_aUSDT ${balance4}`);


})();
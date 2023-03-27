require("@nomiclabs/hardhat-waffle");
const Holder = process.env.Holder;
const USDC = process.env.USDC;
const Sc = require('../artifacts/contracts/Int.sol/Interface.json');

const MyContractAddress = process.env.ContractAdress;

const { POSClient, use } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");


use(Web3ClientPlugin);
(async () => {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [Holder],
    });
    signer = await ethers.getSigner(Holder);
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

    mycontract = new ethers.Contract(MyContractAddress, Sc.abi, signer);
    USDCToken = posClient.erc20(USDC);
    USDTToken = posClient.erc20(process.env.USDT);
    aUSDCToken = posClient.erc20(process.env.aUSDC);


    /*  approveResult = await USDTToken.approve(ethers.BigNumber.from('1000000').toString(), {
         spenderAddress: mycontract.address
     });
     const txHash = await approveResult.getTransactionHash();
     const txReceipt = await approveResult.getReceipt();
 
     gas = await mycontract.estimateGas.transferFrom(process.env.USDT, signer.address, mycontract.address, ethers.BigNumber.from('1000000'));
     receipt = await mycontract.transferFrom(process.env.USDT, signer.address, mycontract.address, ethers.BigNumber.from('1000000'), {
         gasLimit: ethers.BigNumber.from(gas).mul(ethers.BigNumber.from('2'))
     });
     await receipt.wait(); 


     gas = await mycontract.estimateGas.borrow(`0x794a61358D6845594F94dc1DB02A252b5b4814aD`, process.env.USDT, ethers.BigNumber.from('5'));
     receipt = await mycontract.borrow(`0x794a61358D6845594F94dc1DB02A252b5b4814aD`, process.env.USDT, ethers.BigNumber.from('5'), {
         gasLimit: ethers.BigNumber.from(gas).mul(ethers.BigNumber.from('2'))
     });
     await receipt.wait();

    qwe = await mycontract.getUserAccountData(`0x794a61358D6845594F94dc1DB02A252b5b4814aD`, mycontract.address);
    qwe1 = qwe[1];
    console.log(qwe);
    console.log(qwe1);

    gas = await mycontract.estimateGas.repayFull(`0x794a61358D6845594F94dc1DB02A252b5b4814aD`, process.env.USDT);
    receipt = await mycontract.repayFull(`0x794a61358D6845594F94dc1DB02A252b5b4814aD`, process.env.USDT, {
        gasLimit: ethers.BigNumber.from(gas).mul(ethers.BigNumber.from('2'))
    });
    await receipt.wait();*/
    qwe = await mycontract.getUserAccountData(`0x794a61358D6845594F94dc1DB02A252b5b4814aD`, mycontract.address);
    console.log(qwe);
    balance1 = await USDCToken.getBalance(mycontract.address);
    balance2 = await USDTToken.getBalance(mycontract.address);
    balance3 = await aUSDCToken.getBalance(mycontract.address);
    console.log(`  mycontractUSDC ${balance1} mycontractUSDT ${balance2}  mycontract_aUSDC ${balance3}`);

})();
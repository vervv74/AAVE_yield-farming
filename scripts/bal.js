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
    aUSDTToken = posClient.erc20(process.env.aUSDT);
    qwe = await mycontract.getUserAccountData(process.env.AAVEpool, mycontract.address);
    console.log(qwe);

    balance1 = await USDCToken.getBalance(mycontract.address);
    balance2 = await USDTToken.getBalance(mycontract.address);
    balance3 = await aUSDCToken.getBalance(mycontract.address);
    balance4 = await aUSDTToken.getBalance(mycontract.address);
    balance5 = await aUSDTToken.getBalance(signer.address);
    console.log(`  mycontractUSDC ${balance1} mycontractUSDT ${balance2}  mycontract_aUSDC ${balance3} mycontract_aUSDT ${balance4} signer_aUSDT ${balance5}`);
   

/*    gas = await mycontract.estimateGas.transfer(process.env.aUSDT, Holder, ethers.BigNumber.from(balance4).div(ethers.BigNumber.from('10').mul(ethers.BigNumber.from('6'))));
    receipt = await mycontract.transfer(process.env.aUSDT, Holder, ethers.BigNumber.from(balance4).div(ethers.BigNumber.from('10')).mul(ethers.BigNumber.from('6')), {
        gasLimit: ethers.BigNumber.from(gas).mul(ethers.BigNumber.from('2'))
    });
    await receipt.wait(); */
    balance1 = await USDCToken.getBalance(mycontract.address);
    balance2 = await USDTToken.getBalance(mycontract.address);
    balance3 = await aUSDCToken.getBalance(mycontract.address);
    balance4 = await aUSDTToken.getBalance(mycontract.address);
    balance5 = await aUSDTToken.getBalance(signer.address);
    console.log(`  mycontractUSDC ${balance1} mycontractUSDT ${balance2}  mycontract_aUSDC ${balance3} mycontract_aUSDT ${balance4} signer_aUSDT ${balance5}`);
})();
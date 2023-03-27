
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
const alchemy_key = process.env.alchemy_key;
const acc_key = process.env.acc_key;
module.exports = {
  solidity: "0.8.17",
  solidity: "0.8.10",
  networks: {
 
    hardhat: {
      forking: {
        url: `https://polygon-mainnet.g.alchemy.com/v2/${alchemy_key}`,
        enabled: true,
      },
      mining: {
        auto: false,
        interval: 10000
      },
    },
    
  },
  mocha: {
    timeout: 100000000000000
  }
};

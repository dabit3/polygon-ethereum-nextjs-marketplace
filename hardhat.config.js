require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },    
    mumbai: {
      // Infura
      // url: `https://polygon-mumbai.infura.io/v3/${infuraId}`
      url: `https://polygon-mumbai.infura.io/v3/9b68deaa2df44ef683962fe8c6bdf73c`,
      //url: "https://rpc-mumbai.matic.today",
      //url: "https://rpc-mumbai.maticvigil.com", 2023.09.24
      accounts: ['0x742eb9a1b49d17b71e4c10c4171ce879a1d48aa539f044ba59d0bce013d156f8'],      
      //accounts: [process.env.privateKey]
    },
   /* matic: {
      // Infura
      // url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
      //url: "https://rpc-mainnet.maticvigil.com",  2023.09.24
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: [process.env.privateKey]
    }
    */
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};


## Full stack digital marketplace built with Polygon & Next.js

### Getting started


### Configuration

The main configuration for this project to work successfully on Polygon is located in __hardhat.config.js__:

```javascript
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    mumbai: {
      url: "https://rpc-mumbai.matic.today",
      accounts: [privateKey]
    },
    matic: {
      url: `https://polygon-mumbai.infura.io/${infuraId}`,
      accounts: [privateKey]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
```

Update __.infuraid__ with your [Infura](https://infura.io/) project ID and, if you are planning on deploying to the main network, update __.secret__ with the Private Key of the account that you would like to use to deploy.
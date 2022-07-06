const HDWalletProvider = require('@truffle/hdwallet-provider');
const private_keys = ['6d921f280ae37c7ec5c5077ac9654ca1bf96d05898a0aa4da3b380da3ce6ced5']
var mnemonic = "mechanic august pig prize feature slot right wait frequent grit fitness print"; 

// truffle migrate --reset --network rinkeby

module.exports = {
  networks: {
    rinkeby: {
      provider: () => new HDWalletProvider({
        privateKeys: private_keys,
        providerOrUrl: "https://rinkeby.infura.io/v3/58a0ff4ba47f4f02b2d26a0941ac20c6",
        numberOfAddress:1
      }),
      network_id: 4,       // rinkeby's id
      gas: 5500000,        // rinkeby has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     }
  },
  mocha: {
    timeout: 12000000
  },
  compilers: {
    solc: {
      version: "^0.4.24"
    }
  }
};
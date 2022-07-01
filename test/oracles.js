
var Test = require('../config/testConfig.js');
//var BigNumber = require('bignumber.js');

contract('Oracles', async (accounts) => {

  const TEST_ORACLES_COUNT = 20;
  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);

    // Watch contract events
    const STATUS_CODE_UNKNOWN = 0;
    const STATUS_CODE_ON_TIME = 10;
    const STATUS_CODE_LATE_AIRLINE = 20;
    const STATUS_CODE_LATE_WEATHER = 30;
    const STATUS_CODE_LATE_TECHNICAL = 40;
    const STATUS_CODE_LATE_OTHER = 50;

  });


  it('oracles can be registered', async () => {
    
    // ARRANGE
    let fee = await config.flightSuretyApp.REGISTRATION_FEE.call();

    // ACT
      await config.flightSuretyApp.registerOracle({ from: accounts[1], value: fee });
      let result = await config.flightSuretyApp.getMyIndexes.call({from: accounts[1]});
      console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
  });
 
});
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('Flight Surety Tests', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address, {from: config.owner});
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`correct initial operating status`, async function () {

    // Get operating status
    let status = await config.flightSuretyApp.isOperational.call();
    assert.equal(status, true, "Invalid initial operating status");

  });

  it(`can block access`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[3] });
      }
      catch(e) {
          accessDenied = true;
          assert.equal(accessDenied, true, "Access not restricted only to Contract Owner");
      }
            
  });

  it(`can allow access`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted only to Contract Owner");
      
  });

  it(`can block access to functions when operating status is false`, async function () {

    let op = await config.flightSuretyData.isOperational();
    
    if (op == true) {
        await config.flightSuretyData.setOperatingStatus(false, {from: config.owner});
    }

    let reverted = false;
    try 
    {
        await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
    }
    catch(e) {
        reverted = true;
    }
    assert.equal(reverted, true, "Access not blocked");      

    // Set it back for other tests to work
    op = await config.flightSuretyData.isOperational();
    if (op == false) {
        await config.flightSuretyData.setOperatingStatus(true, {from: config.owner});
    }
  });

  it('cannot register an Airline using if not funded', async () => {
    
    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    try {
        await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
    }
    catch(e) {

    }
    let result = await config.flightSuretyApp.isAirline.call(newAirline); 

    // ASSERT
    assert.equal(result, false, "Airline should not be able to register another airline without  funding");

  });
 
  it(`atleast one airline is registered on contract deployment`, async function () {
    // Determine if Airline is registered
    let result = await config.flightSuretyData.isRegisteredAirline.call(config.owner);
    assert.equal(result, true, "Airline was not registed on deployment");
  });

  it('(airline) testing registerAirline() for the first 4 airlines ', async () => {
    /* 
        4 additional ailines witht the owner airline = 5 airlines in total
        which men the last airline will not be accepted 
        until 50% of the active airlines voted for it
    */
    // ARRANGE
    let newAirline2 = accounts[2];
    let newAirline3 = accounts[3];
    let newAirline4 = accounts[4];
    let newAirline5 = accounts[5];

    // ACT
    try {
        await config.flightSuretyApp.registerAirline(newAirline2, {from: config.owner});
        await config.flightSuretyApp.registerAirline(newAirline3, {from: config.owner});
        await config.flightSuretyApp.registerAirline(newAirline4, {from: config.owner});
    }
    catch(e) {
        console.log(e.message)
    }
    let resultnewAirline2 = await config.flightSuretyData.isRegisteredAirline.call(newAirline2); 
    let resultnewAirline3 = await config.flightSuretyData.isRegisteredAirline.call(newAirline3); 
    let resultnewAirline4 = await config.flightSuretyData.isRegisteredAirline.call(newAirline4); 
    let resultnewAirline5 = await config.flightSuretyData.isRegisteredAirline.call(newAirline5); 

    // ASSERT
    assert.equal(resultnewAirline2, true, "2nd airlines to be accepted");
    assert.equal(resultnewAirline3, true, "3rd airlines to be accepted");
    assert.equal(resultnewAirline4, true, "4th airlines to be accepted");
    assert.equal(resultnewAirline5, false, "After the fifth should be 50% votes before being acceptance");

  });

  it('multiparty voting system for registerAirline for the fifth airline ', async () => {
    let value = web3.utils.toWei('10', "ether");

    // ARRANGE
    let newAirline2 = accounts[2];
    let newAirline3 = accounts[3];
    let newAirline4 = accounts[4];
    let newAirline5 = accounts[5];
  
    await config.flightSuretyApp.fund({from: newAirline2, value: value});
    await config.flightSuretyApp.fund({from: newAirline3, value: value}); 
    await config.flightSuretyApp.fund({from: newAirline4, value: value}); 

    console.log("Total Number of airlines : "+ await config.flightSuretyData.getAirlineCount());
    console.log("number of airlines funded : "+ await config.flightSuretyData.GetFundedAirlineCount());
        
    assert.equal(await config.flightSuretyApp.isAirline.call(newAirline2), true, "2nd airline is not funded.");
    assert.equal(await config.flightSuretyApp.isAirline.call(newAirline3), true, "3rd airline is not funded.");
    assert.equal(await config.flightSuretyApp.isAirline.call(newAirline4), true, "4th airline is not funded.");

    // ACT
    try {
        await config.flightSuretyApp.registerAirline(newAirline5, {from: newAirline2});
    }
    catch(e) {
        console.log(e.message)
    }
    let resultnewAirline5 = await config.flightSuretyData.isRegisteredAirline.call(newAirline5); 
    // ASSERT
    assert.equal(resultnewAirline5, true,  "The fifth airline should be accepted after getting 2/4 votes");
    });

    it('register flight for an airline', async () => {
       // ARRANGE
      let newAirline2 = accounts[2];
      
      assert.equal(await config.flightSuretyApp.isAirline.call(newAirline2), true, "second airline is not funded yet.");
  
      // ACT
      try {
        await config.flightSuretyApp.registerFlight(newAirline2, "1234", "2019-06-12", {from: newAirline2});
      }
      catch(e) {
          console.log(e.message)
      }
      // ASSERT
      let resultnewAirline2 = await config.flightSuretyData.isFlightRegistered(await config.flightSuretyData.getFlightKey(accounts[2], "1234", "2019-06-12"));
      console.log(resultnewAirline2);
      assert.equal(resultnewAirline2, true,  "flight not registered");
    });

    it('can choose from a list of flights', async() =>{
        let flight = await config.flightSuretyData.getFlight.call(await config.flightSuretyData.getFlightKey(accounts[2], "1234", "2019-06-12"));
        console.log(flight[0]);
        console.log(flight[1]);
        console.log(flight[2]);
        console.log(flight[3]);
        console.log(flight[4]);    
    });

    it('pay up to 1 ether for insurance purchase.', async()=>{
        let passenger1 = accounts[8];
        let passenger2 = accounts[9];
    
        let value1 = web3.utils.toWei('2', "ether");
        let value2 = web3.utils.toWei('1', "ether");
    
        let result1 = false;
        let result2 = false;
    
        try {
            await config.flightSuretyApp.buyInsurance(accounts[2], passenger1, "1234", "2019-06-12", {from: passenger1, value: value1});
        }
        catch(e) {
            result1 = true;
        }
    
        try {
            await config.flightSuretyApp.buyInsurance(accounts[2], passenger2, "1234", "2019-06-12", {from: passenger2, value: value2});
        }
        catch(e) {
            result2 = true;
        }
    
        // ASSERT
        assert.equal(result1, true, "the payment < 1 ether");
        assert.equal(result2, false, "can not buy insurance");
    });

    it(' can see insurance', async() =>{
        let pass = accounts[6];
        let flightKey = await config.flightSuretyData.getFlightKey(accounts[2], "1234", "2019-06-12");
        let ins = await config.flightSuretyData.getInsurance.call(flightKey, pass);
          console.log(ins[0]);
          console.log(ins[1]);
    });

    it('Passenger receives credit  1.5X the paid amount when flight is delay', async () => {
        let passenger3 = accounts[8];
        let value = web3.utils.toWei('1', "ether");
        let valueIns = web3.utils.toWei('1.5', "ether");
        let amount1 = web3.utils.toWei('0', "ether");
        let flight = await config.flightSuretyData.getFlightKey(accounts[2], "1234", "2019-06-12");
        let pass = accounts[6];
        let flightKey = await config.flightSuretyData.getFlightKey(accounts[2], "1234", "2019-06-12");
        let ins = await config.flightSuretyData.getInsurance.call(flightKey, pass);

        await config.flightSuretyApp.fund({from: accounts[2], value: web3.utils.toWei('10', "ether")});

        await config.flightSuretyApp.buyInsurance(accounts[2], passenger3, "1234", "2019-06-12", {from: passenger3, value: value});
        await config.flightSuretyApp.processFlightStat(accounts[2], "1234", "2019-06-12", 20);
        amount1 = await config.flightSuretyData.getInsuranceAmount.call(flight, passenger3);
        // ASSERT 
        assert.equal(amount1.toString(), valueIns, "Invalid amount.");
    });
    

    
});
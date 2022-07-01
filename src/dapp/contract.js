import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
<<<<<<< HEAD
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        
        this.owner = null;
=======
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
>>>>>>> main
        this.initialize(callback);
    }

    async initialize(callback) {
<<<<<<< HEAD
        try{
=======
        const flts = [['123','231','334'] , ['111','222','333'] , ['321','223','012'], ['577','632', '010']];
        let accts = await this.web3.eth.getAccounts();
        this.owner = accts[0];
        this.passenger = accts[11];

        console.log("Owner: "+ this.owner);
        console.log("Passenger: "+ this.passenger);

        try{
            console.log("this.config.appAddress:   "+this.flightSuretyApp.address);
            console.log("Operating Status:   " + await this.flightSuretyApp.methods.isOperational.call());
>>>>>>> main
            await this.flightSuretyData.methods.authorizeCaller(this.flightSuretyApp.address);
        }catch(error){
            console.log(error);
        }
<<<<<<< HEAD
=======

        this.airlines.push(accts[0]);
        this.airlines.push(accts[1]);
        this.airlines.push(accts[2]);
        this.airlines.push(accts[3]);

        console.log("Airlines: "+this.airlines);
        for(let i = 0; i< this.airlines.length; i++){
// register Airlines
            if (i > 0) {
                this.flightSuretyApp.methods.registerAirline(this.airlines[i])
                .send({from: this.owner, gas:650000}, (error, result) => {
                    console.log(this.airlines[i] + ' registered');
                });

                this.flightSuretyApp.methods.fund()
                .send({from: this.airlines[i], value: 10000000000000000000, gas:650000}, (error, result) => {
                    console.log(this.airlines[i] + ' funded');
                });
            }
// register flights for airlines
            this.flightSuretyApp.methods.registerFlight(this.airlines[i], flts[i][0], "2019-06-12")
            .send({from: this.airlines[i], gas:650000}, (error, result) => {
                console.log(this.airlines[i] + ' ' + flts[i][0] + ' ' + '2019-06-12 Flight Registered');
            });
            this.flightSuretyApp.methods.registerFlight(this.airlines[i], flts[i][1], "2019-06-13")
            .send({from: this.airlines[i], gas:650000}, (error, result) => {
                console.log(this.airlines[i] + ' ' + flts[i][1] + ' ' + '2019-06-13 Flight Registered');
            });
            this.flightSuretyApp.methods.registerFlight(this.airlines[i], flts[i][2], "2019-06-15")
            .send({from: this.airlines[i], gas:650000}, (error, result) => {
                console.log(this.airlines[i] + ' ' + flts[i][2] + ' ' + '2019-06-15 Flight Registered');
            });
        }
>>>>>>> main
        callback();
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods.isOperational()
            .call({ from: self.owner}, callback);
    }
    GetAirlineCount(callback) {
        let self = this;
        self.flightSuretyApp.methods.GetAirlineCount()
             .call({ from: self.owner}, callback);
     }
     isRegisteredAirline(airline, callback) {
        let self = this;
        self.flightSuretyApp.methods.isRegisteredAirline(airline)
             .call({ from: self.owner}, callback);
     }
     isAirline(airline, callback) {
        let self = this;
        self.flightSuretyApp.methods.isAirline(airline)
             .call({ from: self.owner}, callback);
     }
     isRegisteredFlight(airline, flight, timestamp, callback) {
        let self = this;
        self.flightSuretyApp.methods.isRegisteredFlight(airline, flight, timestamp)
             .call({ from: self.owner}, callback);
     }
     buyInsurance(airline, passenger, flightName, timestamp, insuranceAmount, callback){
        let self = this;
        console.log("buy insurance: "+self.owner);
        self.flightSuretyApp.methods.buyInsurance(airline, passenger, flightName, timestamp)
        .send({from: passenger, value: insuranceAmount, gas:650000}, (error, result) => {
            console.log(error);
            callback(error, result);
        });
    }

<<<<<<< HEAD
    registerAirline(airLineAddrress){
        let self = this;
        this.flightSuretyApp.methods.registerAirline(airLineAddrress)
        .send({from: this.owner, gas:700000}, (error, result) => {
            console.log(airLineAddrress + ' registered');
        });
    }

    fundAirline(airLineAddrress){
        let self = this;
        this.flightSuretyApp.methods.fund()
        .send({from: airLineAddrress, value: 20000000000000000, gas:700000}, (error, result) => {
            console.log(airLineAddrress + ' funded');
        });
    }

    registerFlight(airLineAddrress,filghtNumber,date){
        let self = this;
        this.flightSuretyApp.methods.registerFlight(airLineAddrress, filghtNumber, date)
            .send({from: airLineAddrress, gas:700000}, (error, result) => {
                console.log(airLineAddrress + ' ' + filghtNumber + ' ' + date + 'Flight Registered');
            });
    }
=======
>>>>>>> main
    fetchFlightStatus(airline, flight, timestamp, callback) {
        let self = this;
        let payload = {
            airline: airline,
            flight: flight,
            timestamp: timestamp
        }
        self.flightSuretyApp.methods.fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, payload);
            });
    }
    requestCredits(insureeAddress, callback) {
        let self = this;
        self.flightSuretyApp.methods.payToInsuree(insureeAddress).send({
            from: insureeAddress
        }, (error, result) => {
            console.log(result);
            callback(error, result);
        });
    }
}
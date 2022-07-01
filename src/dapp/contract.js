import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        
        this.owner = null;
        this.initialize(callback);
    }

    async initialize(callback) {
        try{
            await this.flightSuretyData.methods.authorizeCaller(this.flightSuretyApp.address);
        }catch(error){
            console.log(error);
        }
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
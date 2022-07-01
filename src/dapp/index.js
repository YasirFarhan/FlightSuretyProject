import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';

(async() => {

    let result = null;

    let contract = new Contract('localhost', () => {
<<<<<<< HEAD
=======

        // Read transaction
>>>>>>> main
        let airline = DOM.elid('airline-name').value;
        let flight = DOM.elid('flight-name').value;
        let timestamp = DOM.elid('timestamp-id').value;
        contract.isOperational((error, result) => {
            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ]);
        });

<<<<<<< HEAD
        DOM.elid('register-airline').addEventListener('click', () => {
            let airLineAddrress = DOM.elid('airline-address').value;
            contract.registerAirline(airLineAddrress)
            .send({from: this.owner, gas:650000}, (error, result) => {
                console.log(airLineAddrress + ' registered');
            });
        });

        DOM.elid('fund-airline').addEventListener('click', () => {
            let airLineAddrress = DOM.elid('airline-address').value;
            contract.fundAirline(airLineAddrress)
            .send({from: airLineAddrress, value: 10000000000000000000, gas:650000}, (error, result) => {
                console.log(airLineAddrress + ' funded');
            });
        });

        DOM.elid('div-register-flight').addEventListener('click', () => {
            let airLineAddrress = DOM.elid('airline-address').value;
            let filghtNumber = DOM.elid('filght-number').value;
            let date = DOM.elid('date').value;
            contract.registerFlight(airLineAddrress, filghtNumber, date);
        });

=======

        DOM.elid('submit-oracle').addEventListener('click', () => {
            let airline = DOM.elid('airline-name').value;
            let flight = DOM.elid('flight-name').value;
            let timestamp = DOM.elid('timestamp-id').value;
            // Write transaction
            contract.fetchFlightStatus(airline, flight, timestamp, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp}]);
            });
        })
>>>>>>> main
        DOM.elid('buy-insurance').addEventListener('click', () => {
            let passenger = DOM.elid('passenger-address').value;
            let airline = DOM.elid('airline-name').value;
            let flightName = DOM.elid('flight-name').value;
            let timestamp = DOM.elid('timestamp-id').value;
            let insuranceAmount = DOM.elid('ins-amount').value;

            contract.buyInsurance(airline, passenger, flightName, timestamp, insuranceAmount, (error, result) => {
                display('Buy Insurance: ','insurance button', [ { label: 'Buy Insurance: ', error: error } ]);
            })
<<<<<<< HEAD
        });

        DOM.elid('submit-oracle').addEventListener('click', () => {
            let airline = DOM.elid('airline-name').value;
            let flight = DOM.elid('flight-name').value;
            let timestamp = DOM.elid('timestamp-id').value;
            // Write transaction
            contract.fetchFlightStatus(airline, flight, timestamp, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp}]);
            });
        })

=======
        })


        DOM.elid('register-airline').addEventListener('click', () => {
            let airLineAddrress = DOM.elid('airline-address').value;
            contract.registerAirline(airLineAddrress)
            .send({from: this.owner, gas:650000}, (error, result) => {
                console.log(airLineAddrress + ' registered');
            });
            contract.fund()
            .send({from: airLineAddrress, value: 10000000000000000000, gas:650000}, (error, result) => {
                console.log(this.airlines[i] + ' funded');
            });
        })


>>>>>>> main
    });
    

})();

function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-4 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-8 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}
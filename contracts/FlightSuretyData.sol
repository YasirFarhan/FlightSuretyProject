pragma solidity >=0.4.24 <0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/
    struct AirlineProfile {
        bool isRegistered;
        bool isFunded;
    }

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    mapping(address => AirlineProfile) private airlines;
    uint256 numAirlines;
    uint256 numFunded;
    uint256 numConsensus;
    uint256 fundAmt = 10;
    mapping(address => bool) public authorizedCallers;
    mapping(address => address[]) private regApproved;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
        ()
        public
    {
        contractOwner = msg.sender;
        airlines[contractOwner].isRegistered = true;
        airlines[contractOwner].isFunded = true;
        numAirlines = numAirlines.add(1);
        numFunded = numFunded.add(1);
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational()
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireAirlineRegistered( address _airline )
    {
        require(airlines[_airline].isRegistered, "Airline is not registered");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    * @return A bool that is the current operating status
    */
    function isOperational()
                            external
                            view
                            returns(bool)
    {
        return operational;
    }

    /**
    * @dev Sets contract operations on/off
    * When operational mode is disabled, all write transactions except for this one will fail
    */
    function setOperatingStatus
                            (
                                bool mode
                            )
                            external
                            requireContractOwner
    {
        require(mode != operational, "Operational status is already set");
        operational = mode;
    }

    function authorizeCaller(address callerAddress)
        external
        requireContractOwner
        requireIsOperational
    {
        authorizedCallers[callerAddress] = true;
    }

    /********************************************************************************************/
    /*                                     CONTRACT FUNCTIONS                                   */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */
    function registerAirline
                            (
                                address airline
                            )
                            external
                            requireIsOperational
                            returns(bool)
    {
        airlines[airline].isRegistered = true;
        airlines[airline].isFunded = false;
        numAirlines = numAirlines.add(1);
        return(true);
    }

    /**
    * @dev determine if an address is an airline
    * @return A bool that is true if it is a funded airline
    */
    function isAirline( address airline )
                            external
                            view
                            returns(bool)
    {
        return airlines[airline].isFunded;
    }

    function getAirlineCount() external view
    returns(uint256 numAirlines) {
        return numAirlines;
    }

    function GetFundedAirlineCount() external view
    returns(uint256 count) {
        count = numFunded;
        return count;
    }

   function getNumOfVotes() external view
    returns(uint256 numConsensus) {
        return numConsensus;
    }

   function isRegisteredAirline(address _airline) external view
    returns(bool) {
        return airlines[_airline].isRegistered;
    }


    function fund
                            (
                                address _airline
                            )
                            public
                            payable
                            requireAirlineRegistered(_airline)
    {
        airlines[_airline].isFunded = true;
        authorizedCallers[_airline] = true;
        numFunded = numFunded.add(msg.value);
    }

    struct Flight {
        bool isRegistered;
        uint8 statusCode;
        string fltDate;
        address airline;
        string flt;
    }
    mapping(bytes32 => Flight) private flights;

    // Flight status codees
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

    function registerFlight
    (
        address _airline,
        string filght,
        string _date
    )
                            external
                            requireIsOperational
                            requireAirlineRegistered(_airline)
                            returns(bool)
    {
        bytes32 key = getFlightKey(_airline, filght, _date);
        require(isFlightRegistered(key) == false, "is not registered");
        flights[key] = Flight({
            isRegistered : true,
            statusCode : 0,
            fltDate : _date,
            airline : _airline,
            flt : filght
        });
        return(isFlightRegistered(key));
    }

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            string memory timestamp
                        )
                        public
                        pure
                        returns(bytes32)
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    function isFlightRegistered(bytes32 key) public view returns(bool){
        return (flights[key].isRegistered);
    }

    function getFlight(bytes32 key) public view returns(bool, uint8, string memory, address, string memory){
        return (flights[key].isRegistered, flights[key].statusCode, flights[key].fltDate, flights[key].airline, flights[key].flt);
    }

    /** 
    * @dev Fallback function for funding smart contract.
    *
    */
    function()
                            external
                            payable
    {
        fund(msg.sender);
    }

    struct Insurance{
        uint256 insuranceAmount;
        address passenger;
        bool    isTaken;
    }
    
    mapping (bytes32 => Insurance) private insuranceList;
    mapping (bytes32 => address[]) private passengerList;
    uint256 public constant insuranceFee = 1 ether;

   /**
    * @dev Buy insurance for a flight
    */
    function getInsuranceId (bytes32 flightKey, address passenger) internal view returns(bytes32) {
        return keccak256(abi.encodePacked(flightKey, passenger));
    }

    function buyInsurance
                            (
                                bytes32 flight,
                                address passenger,
                                uint256 insuranceAmount
                            )
                            external
                            payable
                            returns(bool)
    {
        bytes32 insuranceId = getInsuranceId(flight, passenger);
        require(insuranceList[insuranceId].isTaken == false, "This insurance is already purchased.");
        insuranceList[insuranceId].insuranceAmount = insuranceAmount;
        insuranceList[insuranceId].passenger = passenger;
        insuranceList[insuranceId].isTaken = true;
        passengerList[flight].push(passenger);
        return(true);
    }

    function getInsurance(bytes32 key, address _passenger) public view returns(uint256, bool){
        bytes32 insuranceId = getInsuranceId(key, _passenger);
        return (insuranceList[insuranceId].insuranceAmount, insuranceList[insuranceId].isTaken);
    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees
                                (
                                    bytes32 flightKey,
                                    uint creditAmount
                                )
                                external
    {
        for (uint i = 0; i < passengerList[flightKey].length; i++) {
            bytes32 insuranceId = getInsuranceId(flightKey, passengerList[flightKey][i]);
            if (insuranceList[insuranceId].isTaken == true) {
                insuranceList[insuranceId].insuranceAmount = insuranceList[insuranceId].insuranceAmount.mul(creditAmount).div(100);
            }
        }
    }

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function payInsurance
                            (
                                bytes32 flightKey,
                                address _passenger
                            )
                            external
                            payable
    {
        bytes32 insuranceId = getInsuranceId(flightKey, _passenger);
        require(insuranceList[insuranceId].isTaken == true, "Insurance was not purchased.");
        require(address(this).balance > insurance.insuranceAmount,"balance < insuranceAmount");
        Insurance memory insurance = insuranceList[insuranceId];
        insurance.insuranceAmount = 0;
        uint amount = insurance.insuranceAmount;
        address passenger = insurance.passenger;
        passenger.transfer(amount);
    }

    function getInsuranceAmount
                            (
                                bytes32 flightKey,
                                address _passenger
                            )
                            external
                            returns(uint256)
    {
        bytes32 insuranceId = getInsuranceId(flightKey, _passenger);
        Insurance memory insurance = insuranceList[insuranceId];
        return(insurance.insuranceAmount);
    }

    function processFlightStatus
                            (
                                bytes32 flightKey,
                                uint8 _statusCode
                            )
                                external
    {
        Flight storage flight = flights[flightKey];
        // Effect
        flight.statusCode = _statusCode;
    }

}



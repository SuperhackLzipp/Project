// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract PartyPromises {
    // Struct for storing a donator
    struct Donator {
        uint256 totalAmount;
        mapping(bytes32 => uint256) promiseDonations; // list of promises the donator chooses to donate to
    }
    // Struct for storing a promise

    struct Promise {
        // bytes32     promiseTitle;
        string description;
        bool completed;
    }

    // events
    event Donated(uint256);
    event PromiseAdded(bytes32 _title, string _description, uint8 _priority);
    event PromiseCompleted(bytes32 _title);
    event Payback(address _address, uint256 _amount);
    event DonationsReceived(address _address, uint256 _amount);
    event TimeExpired();

    // private variables
    mapping(address => Donator) private donors; // mapping of donors
    address[] private donorAddresses; // list of donor addresses

    // public variables
    address public immutable owner; // owner of the contract
    bytes32 public immutable partyName; // name of the party
    uint256 public immutable creationTime; // time of creation (dd/mm/yyyy)
    uint256 public immutable expirationTime; // time of expiration (dd/mm/yyyy)
    mapping(bytes32 => Promise) public promises; // mapping of promises
    bytes32[] public promiseTitles; // list of promise titles

    // modifiers
    modifier notExpired() {
        require(block.timestamp <= expirationTime, "Contract has expired");
        _;
    }

    modifier isExpired() {
        require(block.timestamp > expirationTime, "Contract has not expired");
        _;
    }

    modifier isOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier greaterZero() {
        require(msg.value > 0, "Value must be greater than zero");
        _;
    }

    modifier nonexistant(bytes32 _title) {
        require(promises[_title] == 0, "Promise already exists");
        _;
    }

    modifier notCompleted(bytes32 _title) {
        require(promises[_title].completed == false, "Promise has already been completed");
        _;
    }

    // constructor
    constructor(bytes32 _partyName, uint256 _expirationTime) {
        partyName = _partyName;
        creationTime = block.timestamp;
        expirationTime = _expirationTime;
    }

    // payable default functions
    receive() external payable greaterZero {
        emit Donated(msg.value);
    }

    fallback() external payable greaterZero {
        emit Donated(msg.value);
    }

    /**
     * Function to allow addresses to donate to the party
     * @param _totalAmount - total amount to donate
     * @param _promiseTitles - list of promise titles to donate to
     * @param _individualAmounts - list of individual amounts to donate to each promise
     */
    function Donate(uint256 _totalAmount, bytes32[] calldata _promiseTitles, uint256[] calldata _individualAmounts)
        external
        payable
        greaterZero
    {
        require(donors[msg.sender] == 0, "You are already a donor");
        require(
            _promiseTitles.length == _individualAmounts.length, "Length of promise titles and amounts must be equal"
        );

        donorAddresses.push(msg.sender);
        donors[msg.sender].totalAmount = _totalAmount;
        for (uint256 i = 0; i < _promiseTitles.length; i++) {
            donors[msg.sender].promiseDonations[_promiseTitles[i]] = _individualAmounts[i];
        }

        emit Donated(msg.value);
    }

    /**
     * Function to allow addresses to donate to the party anonymously
     * NON-REFUNDABLE!!!
     */
    function DonateAnonymouslyNonRefundable() external payable greaterZero {
        emit Donated(msg.value);
    }

    /**
     * Adds a promise to the list of promises
     * @param _title - title of the promise
     * @param _description - description of the promise
     */
    function AddPromise(bytes32 _title, string calldata _description) external notExpired isOwner nonexistant(_title) {
        promiseTitles.push(_title);
        promises[_title].description = _description;
        promises[_title].completed = false;
        emit PromiseAdded(_title, _description);
    }

    /**
     * Completes a promise. Only addresses verified by EAS will be allowed to call this function
     * @param _title - title of the promise
     */
    function CompletePromise(bytes32 _title) external notExpired notCompleted(_title) {
        promises[_title].completed = true;
        emit PromiseCompleted(_title);
    }

    /**
     * Withdraws the adequate amount of funds from the contract for every promise completed
     * For every promise not completed, the funds will be sent back to the donors
     */
    function HandlePromiseFunds() external isOwner isExpired {
        uint256 balanceToPayback;
        uint256 iLen = donorAddresses.length;
        uint256 jLen = promiseTitles.length;
        // for loop for handling every single donor
        for (uint256 i = 0; i < len; i++) {
            balanceToPayback = 0;
            // for loop for every single promise
            for (uint256 j = 0; j < jLen; j++) {
                if (
                    donors[donorAddresses[i]].promiseDonations[promiseTitles[j]] != 0
                        && promises[promiseTitles[j]].completed == false
                ) {
                    balanceToPayback += donors[donorAddresses[i]].promiseDonations[promiseTitles[j]];
                }
                // transfer funds back to donor
                require(donorAddresses[i].totalAmount >= balanceToPayback, "Insufficient funds to payback");
                donorAddresses[i].transfer(balanceToPayback);
                emit Payback(donorAddresses[i], balanceToPayback);
                
            }
        }
        // wire all remaining funds to party
        uint256 partyBalance = address(this).balance;
        owner.transfer(address(this).balance);
        emit DonationsReceived(owner, partyBalance);
    }

    // getters
    function GetDonorTotalAmount(address _donor) external view returns (uint256) {
        return donors[_donor].totalAmount;
    }

    function GetDonorPromiseDonations(address _donor, bytes32 _promiseTitle) external view returns (uint256) {
        return donors[_donor].promiseDonations[_promiseTitle];
    }

    function GetPromiseDescription(bytes32 _title) external view returns (string memory) {
        return promises[_title].description;
    }

    function GetPromiseCompleted(bytes32 _title) external view returns (bool) {
        return promises[_title].completed;
    }

    function GetDonorAddresses() external view returns (address[] memory) {
        return donorAddresses;
    }

    function GetPromiseTitles() external view returns (bytes32[] memory) {
        return promiseTitles;
    }

    function GetPartyBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function GetOwner() external view returns (address) {
        return owner;
    }

    function GetPartyName() external view returns (bytes32) {
        return partyName;
    }

    function GetCreationTime() external view returns (uint256) {
        return creationTime;
    }

    function GetExpirationTime() external view returns (uint256) {
        return expirationTime;
    }
}

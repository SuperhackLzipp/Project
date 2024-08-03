// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract PartyPromises {
    // Struct for storing a donator
    struct Donor {
        uint256 totalAmount;
        mapping(bytes32 => uint256) promiseDonations; // list of promises the donator chooses to donate to
    }

    // Struct for storing a promise
    struct Promise {
        string description;
        bool completed;
    }

    // events
    event PromiseAdded(bytes32 _title, string _description, uint8 _priority);
    event PromiseCompleted(bytes32 _title);
    event PromiseUncompleted(bytes32 _title);
    event Donated(address _address, uint256 _amount);
    event Payback(address _address, uint256 _amount);
    event DonationsReceived(address _address, uint256 _amount);
    event TimeExpired();

    // private variables
    mapping(address => Donor) private donors;
    address[] private donorAddresses;

    // public variables
    address public immutable owner;
    bytes32 public immutable partyName;
    uint256 public immutable creationTime; // (dd/mm/yyyy)
    uint256 public immutable expirationTime; // (dd/mm/yyyy)
    string public immutable partyProgramURL;
    mapping(bytes32 => Promise) public promises;
    bytes32[] public promiseTitles;

    // constructor
    constructor(
        bytes32 _partyName,
        uint256 _expirationTime,
        string _partyProgramURL,
        bytes32[] _promiseTitles, // optional
        string[] _descriptions // optional
    ) payable {
        require(
            _promiseTitles.length == _descriptions.length, "Length of promise titles and descriptions must be equal"
        );
        owner = msg.sender;
        partyName = _partyName;
        creationTime = block.timestamp;
        expirationTime = _expirationTime;
        partyProgramURL = bytes(_partyProgramURL).length > 0 ? _partyProgramURL : "Not set";
        if (_promiseTitles.length == 0) {
            return;
        }
        promiseTitles = _promiseTitles;
        for (uint256 i = 0; i < _promiseTitles.length; i++) {
            promises[_promiseTitles[i]].description = _descriptions[i];
            promises[_promiseTitles[i]].completed = false;
        }
    }

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

    modifier notOwner() {
        require(msg.sender != owner, "You are the owner");
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

    modifier notDonated() {
        require(donors[msg.sender] == 0, "You are already a donor");
        _;
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
        notDonated
    {
        require(
            _promiseTitles.length == _individualAmounts.length, "Length of promise titles and amounts must be equal"
        );

        donorAddresses.push(msg.sender);
        donors[msg.sender].totalAmount = _totalAmount;
        for (uint256 i = 0; i < _promiseTitles.length; i++) {
            donors[msg.sender].promiseDonations[_promiseTitles[i]] = _individualAmounts[i];
        }

        emit Donated(msg.sender, msg.value);
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
    function CompletePromise(bytes32 _title) external notExpired notOwner {
        promises[_title].completed = true;
        emit PromiseCompleted(_title);
    }

    /**
     * Uncompletes a promise. Only addresses verified by EAS will be allowed to call this function
     * @param _title - title of the promise
     */
    function UncompletePromise(bytes32 _title) external notExpired {
        promises[_title].completed = false;
        emit PromiseUncompleted(_title);
    }

    /**
     * Withdraws the adequate amount of funds from the contract for every promise completed
     * For every promise not completed, the funds will be sent back to the donors
     */
    function HandlePromiseFunds() external isOwner isExpired {
        uint256 balanceToPayback;
        // for loop for handling every single donor
        for (uint256 i = 0; i < donorAddresses.length; i++) {
            balanceToPayback = 0;
            // for loop for every single promise
            for (uint256 j = 0; j < promiseTitles.length; j++) {
                if (
                    donors[donorAddresses[i]].promiseDonations[promiseTitles[j]] != 0
                        && promises[promiseTitles[j]].completed == true
                ) {
                    balanceToPayback += donors[donorAddresses[i]].promiseDonations[promiseTitles[j]];
                }
            }
            // transfer funds back to donor
            if (balanceToPayback < donorAddresses[i].totalAmount) {
                donorAddresses[i].transfer(balanceToPayback);
            } else {
                donorAddresses[i].transfer(donorAddresses[i].totalAmount);
            }
            emit Payback(donorAddresses[i], balanceToPayback);
        }
        // wire all remaining funds to party
        uint256 partyBalance = address(this).balance;
        owner.transfer(address(this).balance);
        emit DonationsReceived(owner, partyBalance);
    }

    // getters: promises
    function GetPromiseTitles() external view returns (bytes32[] memory) {
        return promiseTitles;
    }

    function GetPromises() external view returns (mapping(bytes32 => Promise) memory) {
        return promises;
    }

    function GetPromiseDescription(bytes32 _title) external view returns (string memory) {
        return promises[_title].description;
    }

    function GetPromiseCompleted(bytes32 _title) external view returns (bool) {
        return promises[_title].completed;
    }

    // getters: donors
    function GetDonorAddresses() external view returns (address[] memory) {
        return donorAddresses;
    }

    function GetDonorTotalAmount(address _donor) external view returns (uint256) {
        return donors[_donor].totalAmount;
    }

    function GetDonorPromiseDonations(address _donor) external view returns (uint256) {
        return donors[_donor].promiseDonations;
    }

    // getters: owner, partyName, creationTime, expirationTime
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

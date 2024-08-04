// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract PartyPromises {
    // Struct for storing a donator
    struct Donor {
        uint256 totalAmount;
        bytes32[] promiseTitles; // list of promises the donator chooses to donate to
        mapping(bytes32 => uint256) promiseDonations; // promise titles && donated amounts
    }

    // Struct for storing a promise
    struct Promise {
        string description;
        bool completed;
    }

    // events
    event PromiseAdded(bytes32 _title, string _description);
    event PromiseCompleted(bytes32 _title);
    event PromiseUncompleted(bytes32 _title);
    event Donated(address _address, uint256 _amount);
    event Payback(address _address, uint256 _amount);
    event DonationsReceived(address _address, uint256 _amount);
    event TimeExpired();

    // private variables
    mapping(address => Donor) private donors;
    address payable[] private donorAddresses;

    // public variables
    address payable public immutable owner;
    bytes32 public immutable partyName;
    uint32 public immutable creationTime; // (dd/mm/yyyy) ONLY VIABLE UNTIL 2106!
    uint32 public immutable expirationTime; // (dd/mm/yyyy) ONLY VIABLE UNTIL 2106!
    string public partyProgramURL;
    mapping(bytes32 => Promise) public promises;
    bytes32[] public promiseTitles;

    // constructor
    constructor(
        bytes32 _partyName,
        uint32 _expirationTime,
        string memory _partyProgramURL,
        bytes32[] memory _promiseTitles, // optional
        string[] memory _descriptions // optional
    ) {
        require(
            _promiseTitles.length == _descriptions.length, "Length of promise titles and descriptions must be equal"
        );
        owner = payable(msg.sender);
        partyName = _partyName;
        creationTime = uint32(block.timestamp);
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
        require(uint32(block.timestamp) <= expirationTime, "Contract has expired");
        _;
    }

    modifier isExpired() {
        require(uint32(block.timestamp) > expirationTime, "Contract has not expired");
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
        require(bytes(promises[_title].description).length == 0, "Promise already exists");
        _;
    }

    modifier notDonated() {
        require(donors[msg.sender].totalAmount == 0, "You are already a donor");
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

        donorAddresses.push(payable(msg.sender));
        donors[msg.sender].totalAmount = _totalAmount;
        donors[msg.sender].promiseTitles = _promiseTitles;
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
            if (balanceToPayback < donors[donorAddresses[i]].totalAmount) {
                donorAddresses[i].transfer(balanceToPayback);
            } else {
                donorAddresses[i].transfer(donors[donorAddresses[i]].totalAmount);
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

    function GetPromises() external view returns (bytes32[] memory, string[] memory, bool[] memory) {
        string[] memory descriptions = new string[](promiseTitles.length);
        bool[] memory completions = new bool[](promiseTitles.length);
        for (uint256 i = 0; i < promiseTitles.length; i++) {
            descriptions[i] = promises[promiseTitles[i]].description;
            completions[i] = promises[promiseTitles[i]].completed;
        }
        return (promiseTitles, descriptions, completions);
    }

    function GetPromiseDescription(bytes32 _title) external view returns (string memory) {
        return promises[_title].description;
    }

    function GetPromiseCompleted(bytes32 _title) external view returns (bool) {
        return promises[_title].completed;
    }

    // getters: donors
    function GetDonorAddresses() external view returns (address payable[] memory) {
        return donorAddresses;
    }

    function GetDonorTotalAmount(address _donor) external view returns (uint256) {
        return donors[_donor].totalAmount;
    }

    function GetDonorPromiseDonations(address _donor) external view returns (bytes32[] memory, uint256[] memory) {
        uint256[] memory amounts;
        for (uint256 i = 0; i < donors[_donor].promiseTitles.length; i++) {
            amounts[i] = donors[_donor].promiseDonations[donors[_donor].promiseTitles[i]];
        }
        return (donors[_donor].promiseTitles, amounts);
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

    function GetCreationTime() external view returns (uint32) {
        return creationTime;
    }

    function GetExpirationTime() external view returns (uint32) {
        return expirationTime;
    }

    function GetPartyProgramURL() external view returns (string memory) {
        return partyProgramURL;
    }
}

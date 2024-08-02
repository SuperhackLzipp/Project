// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract PartyPromises {

    // Struct for storing a promise donation
    struct PromiseDonation {
        bytes32 promiseTitle;
        uint256 amount;
    }
    // Struct for storing a donator
    struct Donator {
        address             donatorAddress;
        uint256             totalAmount;
        PromiseDonation[]   promiseDonations; // list of promises the donator chooses to donate to
    }
    // Struct for storing a promise
    struct Promise {
        bytes32     promiseTitle;
        string      description;
        bool        completed;
    }

    // events
    event Received(address, uint);
    event PromiseAdded(bytes32 _title, string _description, uint8 _priority);
    event PromiseCompleted(bytes32 _title);
    event TimeExpired();

    // state variables
    address private immutable   owner; // owner of the contract
    bytes32 public immutable    partyName; // name of the party
    uint256 public immutable    creationTime; // time of creation (dd/mm/yyyy)
    uint256 public immutable    expirationTime; // time of expiration (dd/mm/yyyy)
    Promise[] public            promises; // list of promises
    Donator[] public            donators; // list of donators

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

    // constructor
    constructor(bytes32 _partyName, uint256 _expirationTime) {
        partyName = _partyName;
        creationTime = block.timestamp;
        expirationTime = _expirationTime;
    }

    // payable default functions
    receive() external payable {
        require(msg.value > 0, "Must send some Ether");
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable{
        require(msg.value > 0, "Must send some Ether");
        emit Received(msg.sender, msg.value);
    }

    /**
     * Adds a promise to the list of promises
     * @param _title - title of the promise
     * @param _description - description of the promise
     */
    function AddPromise(bytes32 _title, string calldata _description) public notExpired isOwner {
        Promise memory newPromise = Promise(_title, _description, false);
        promises.push(newPromise);
        emit PromiseAdded(_title, _description);
    }

    /**
     * Completes a promise. Only addresses verified by EAS will be allowed to call this function
     * @param _title - title of the promise
     */
    function CompletePromise(bytes32 _title) public notExpired {
        for (uint i = 0; i < promises.length; i++) {
            if (promises[i].title == _title) {
                promises[i].completed = true;
                emit PromiseCompleted(_title);
                return;
            }
        }
    }

    // helpers
    function checkAllPromisesCompleted() public view returns (bool) {
        for (uint i = 0; i < promises.length; i++) {
            if (!promises[i].completed) {
                return false;
            }
        }
        return true;
    }
}

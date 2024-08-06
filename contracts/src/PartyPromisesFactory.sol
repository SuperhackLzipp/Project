// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./PartyPromises.sol";

contract PartyPromisesFactory {
    // events
    event PartyCreated(address _partyAddress, bytes32 _partyName, uint32 _expirationTime);

    modifier expiredGreaterStart(uint32 _expirationTime) {
        require(_expirationTime > uint32(block.timestamp), "Expiration time must be greater than creation time");
        _;
    }

    // private variables
    address[] private partyAddresses;

    // public variables
    address public immutable owner;

    // constructor
    constructor() {
        owner = msg.sender;
    }

    // create a new party
    function CreateParty(
        bytes32 _partyName,
        uint32 _expirationTime,
        string memory _partyProgramURL,
        bytes32[] memory _promiseTitles,
        string[] memory _descriptions
    ) public expiredGreaterStart(_expirationTime) returns (address) {
        PartyPromises party =
            new PartyPromises(msg.sender, _partyName, _expirationTime, _partyProgramURL, _promiseTitles, _descriptions);
        partyAddresses.push(address(party));

        emit PartyCreated(address(party), _partyName, _expirationTime);

        return address(party);
    }

    // get party addresses
    function getPartyAddresses() public view returns (address[] memory) {
        return partyAddresses;
    }
}

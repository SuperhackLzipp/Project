// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./PartyPromises.sol";

contract PartyPromisesFactory {
    // Struct for storing a party
    struct Party {
        address partyAddress;
        bytes32 partyName;
        uint32 expirationTime;
    }

    // events
    event PartyCreated(address _partyAddress, bytes32 _partyName, uint32 _expirationTime);

    // private variables
    mapping(address => Party) private parties;
    address[] private partyAddresses;

    // public variables
    address public immutable owner;

    // constructor
    constructor() {
        owner = msg.sender;
    }

    // create a new party
    function createParty(
        bytes32 _partyName,
        uint32 _expirationTime,
        string memory _partyProgramURL,
        bytes32[] memory _promiseTitles,
        string[] memory _descriptions
    ) public {
        PartyPromises party = new PartyPromises(
            _partyName,
            _expirationTime,
            _partyProgramURL,
            _promiseTitles,
            _descriptions
        );
        parties[address(party)] = Party(address(party), _partyName, _expirationTime);
        partyAddresses.push(address(party));
        emit PartyCreated(address(party), _partyName, _expirationTime);
    }

    // get party addresses
    function getPartyAddresses() public view returns (address[] memory) {
        return partyAddresses;
    }

    // get party details
    function getPartyDetails(address _partyAddress) public view returns (Party memory) {
        return parties[_partyAddress];
    }
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {PartyPromises} from "../src/PartyPromises.sol";
import {PartyPromisesFactory} from "../src/PartyPromisesFactory.sol";

contract PartyPromisesFactoryTest is Test {
    PartyPromisesFactory partyPromisesFactory;
    uint32 creationTime;
    bytes32 partyName;
    uint32 expirationTime;
    string partyProgramURL;
    bytes32 promiseTitle1;
    bytes32 promiseTitle2;
    bytes32[] promiseTitles;
    string description1;
    string description2;
    string[] descriptions;
    string url;

    receive() external payable {}

    fallback() external payable {}

    function setUp() public {
        partyPromisesFactory = new PartyPromisesFactory();
    }

    function test_CreateParty() public {
        creationTime = uint32(block.timestamp);
        expirationTime = uint32(creationTime + 2 days);
        partyName = "Party Name";
        expirationTime = 100;
        partyProgramURL = "https://partyprogram.com";
        promiseTitle1 = "Promise 1";
        promiseTitle2 = "Promise 2";
        promiseTitles = new bytes32[](2);
        promiseTitles[0] = promiseTitle1;
        promiseTitles[1] = promiseTitle2;
        description1 = "Description 1";
        description2 = "Description 2";
        descriptions = new string[](2);
        descriptions[0] = description1;
        descriptions[1] = description2;
        url = "https://partyprogram.com";

        address partyAddress =
            partyPromisesFactory.CreateParty(partyName, expirationTime, partyProgramURL, promiseTitles, descriptions);

        PartyPromises partyPromises = PartyPromises(partyAddress);

        assertEq(partyPromises.GetOwner(), address(this));
        assertEq(partyPromises.GetPartyName(), partyName);
        assertEq(partyPromises.creationTime(), creationTime);
        assertEq(partyPromises.GetExpirationTime(), expirationTime);
        assertEq(partyPromises.GetPartyProgramURL(), url);
        assertEq(partyPromises.GetPartyBalance(), 0);

        bytes32[] memory _promiseTitles = partyPromises.GetPromiseTitles();
        assertEq(_promiseTitles[0], promiseTitle1);
        assertEq(_promiseTitles[1], promiseTitle2);

        string[] memory _descriptions;
        bool[] memory _completions;
        (_promiseTitles, _descriptions, _completions) = partyPromises.GetPromises();
        assertEq(_promiseTitles[0], promiseTitle1);
        assertEq(_promiseTitles[1], promiseTitle2);
        assertEq(_descriptions[0], description1);
        assertEq(_descriptions[1], description2);
        assertEq(_completions[0], false);
        assertEq(_completions[1], false);
    }

    function test_CreatePartyNoArgs() public {
        creationTime = uint32(block.timestamp);
        expirationTime = uint32(creationTime + 2 days);
        address partyAddress =
            partyPromisesFactory.CreateParty(partyName, expirationTime, "", new bytes32[](0), new string[](0));

        PartyPromises partyPromises = PartyPromises(partyAddress);

        assertEq(partyPromises.GetOwner(), address(this));
        assertEq(partyPromises.GetPartyName(), partyName);
        assertApproxEqAbs(partyPromises.GetCreationTime(), creationTime, 2);
        assertEq(partyPromises.GetExpirationTime(), expirationTime);
        assertEq(partyPromises.GetPartyProgramURL(), "Not set");
        assertEq(partyPromises.GetPartyBalance(), 0);

        bytes32[] memory _promiseTitles = partyPromises.GetPromiseTitles();
        assertEq(_promiseTitles.length, 0);

        string[] memory _descriptions;
        bool[] memory _completions;
        (_promiseTitles, _descriptions, _completions) = partyPromises.GetPromises();
        assertEq(_promiseTitles.length, 0);
        assertEq(_descriptions.length, 0);
        assertEq(_completions.length, 0);
    }

    function testFail_CreatePartyDifferentLengths() public {
        creationTime = uint32(block.timestamp);
        expirationTime = uint32(creationTime + 2 days);
        bytes32[] memory _promiseTitles = new bytes32[](1);
        _promiseTitles[0] = "Promise 1";
        partyPromisesFactory.CreateParty(partyName, expirationTime, "", _promiseTitles, descriptions);
    }

    function testFail_CreatePartyExpiredTooSmall() public {
        uint32 _expirationTime = uint32(block.timestamp - 1 days);
        partyPromisesFactory.CreateParty(partyName, _expirationTime, "", promiseTitles, descriptions);
    }
}

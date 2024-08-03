// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {PartyPromises} from "../src/PartyPromises.sol";

contract PartyPromisesTest is Test {
    PartyPromises public partyPromises;
    uint256 public creationTime;
    uint256 public expirationTime;
    address public owner;

    function setUp() public {
        creationTime = block.timestamp;
        expirationTime = creationTime + 1 days;
        partyPromises = new PartyPromises("Example Party".toBytes32(), creationTime, expirationTime);
        owner = address(this);
    }

    function test_AddPromise() public {
        bytes32 promiseTitle = "Promise 1".toBytes32();
        partyPromises.addPromise(promiseTitle, "Description 1");

        assertEq(partyPromises.promiseTitles(0), promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).description, "Description 1");
        assertEq(partyPromises.promises(promiseTitle).completed, false);
    }

    function test_completePromise() public {
        bytes32 promiseTitle = "Promise 1".toBytes32();
        partyPromises.addPromise(promiseTitle, "Description 1");

        partyPromises.completePromise(promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).completed, true);

        partyPromises.completePromise(promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).completed, true);
    }
}

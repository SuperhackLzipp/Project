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

    /**
     * The following tests will test all promise related functions
     */
    function test_AddPromise() public {
        bytes32 promiseTitle = "Promise 1".toBytes32();
        partyPromises.addPromise(promiseTitle, "Description 1");

        assertEq(partyPromises.promiseTitles(0), promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).description, "Description 1");
        assertEq(partyPromises.promises(promiseTitle).completed, false);
    }

    function test_CompletePromise() public {
        bytes32 promiseTitle = "Promise 1".toBytes32();
        partyPromises.addPromise(promiseTitle, "Description 1");

        partyPromises.completePromise(promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).completed, true);

        partyPromises.completePromise(promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).completed, true);
    }

    function test_UncompletePromise() public {
        bytes32 promiseTitle = "Promise 1".toBytes32();
        partyPromises.addPromise(promiseTitle, "Description 1");

        partyPromises.completePromise(promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).completed, true);

        partyPromises.uncompletePromise(promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).completed, false);

        partyPromises.uncompletePromise(promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).completed, false);
    }

    function test_GetPromiseTitles() public {
        bytes32 promiseTitle1 = "Promise 1".toBytes32();
        bytes32 promiseTitle2 = "Promise 2".toBytes32();
        partyPromises.addPromise(promiseTitle1, "Description 1");
        partyPromises.addPromise(promiseTitle2, "Description 2");

        bytes32[] memory promiseTitles = partyPromises.getPromiseTitles();
        assertEq(promiseTitles[0], promiseTitle1);
        assertEq(promiseTitles[1], promiseTitle2);
    }

    function test_GetPromises() public {
        bytes32 promiseTitle1 = "Promise 1".toBytes32();
        bytes32 promiseTitle2 = "Promise 2".toBytes32();
        partyPromises.addPromise(promiseTitle1, "Description 1");
        partyPromises.addPromise(promiseTitle2, "Description 2");

        mapping(bytes32 => PartyPromises.Promise) memory promises = partyPromises.getPromises();
        assertEq(promises[promiseTitle1].description, "Description 1");
        assertEq(promises[promiseTitle1].completed, false);
        assertEq(promises[promiseTitle2].description, "Description 2");
        assertEq(promises[promiseTitle2].completed, false);
    }

    function test_GetPromiseDescription() public {
        bytes32 promiseTitle = "Promise 1".toBytes32();
        partyPromises.addPromise(promiseTitle, "Description 1");

        string description = partyPromises.getPromiseDescription(promiseTitle);
        assertEq(description, "Description 1");
    }

    function test_GetPromiseCompleted() public {
        bytes32 promiseTitle = "Promise 1".toBytes32();
        partyPromises.addPromise(promiseTitle, "Description 1");

        bool completed = partyPromises.getPromiseCompleted(promiseTitle);
        assertEq(completed, false);

        partyPromises.completePromise(promiseTitle);
        completed = partyPromises.getPromiseCompleted(promiseTitle);
        assertEq(completed, true);
    }

    /**
     * The following tests will test all donation related functions
     */
    function

    /**
     * The following tests will test all donor related functions
     */
}

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
        vm.deal(address(this), 100 ether);
    }

    /**
     * The following tests will test the receive && fallback functions
     */
    function test_ReceiveFunction() public {
        (bool success, ) = address(partyPromises).call{value: 1 ether}("");
        require(success, "Ether transfer failed");

        assertEq(address(partyPromises).balance, 1 ether);
    }

    function test_FallbackFunction() public {
        (bool success, ) = address(partyPromises).call{value: 1 ether}("0x1234");
        require(success, "Ether transfer with data failed");

        assertEq(address(partyPromises).balance, 1 ether);
    }

    function test_NonExistentFunctionCall() public {
        (bool success, ) = address(partyPromises).call(abi.encodeWithSignature("nonExistentFunction()"));
        require(success, "Call to non-existent function failed");
    }

    /**
     * The following tests will test all promise-related functions
     */
    function test_AddPromise() public {
        bytes32 promiseTitle = "Promise 1".toBytes32();
        partyPromises.AddPromise(promiseTitle, "Description 1");

        assertEq(partyPromises.promiseTitles(0), promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).description, "Description 1");
        assertEq(partyPromises.promises(promiseTitle).completed, false);
    }

    function test_CompletePromise() public {
        bytes32 promiseTitle = "Promise 1".toBytes32();
        partyPromises.AddPromise(promiseTitle, "Description 1");

        partyPromises.CompletePromise(promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).completed, true);

        partyPromises.CompletePromise(promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).completed, true);
    }

    function test_UnCompletePromise() public {
        bytes32 promiseTitle = "Promise 1".toBytes32();
        partyPromises.AddPromise(promiseTitle, "Description 1");

        partyPromises.CompletePromise(promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).completed, true);

        partyPromises.UncompletePromise(promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).completed, false);

        partyPromises.UncompletePromise(promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).completed, false);
    }

    function test_GetPromiseTitles() public {
        bytes32 promiseTitle1 = "Promise 1".toBytes32();
        bytes32 promiseTitle2 = "Promise 2".toBytes32();
        partyPromises.AddPromise(promiseTitle1, "Description 1");
        partyPromises.AddPromise(promiseTitle2, "Description 2");

        bytes32[] memory promiseTitles = partyPromises.GetPromiseTitles();
        assertEq(promiseTitles[0], promiseTitle1);
        assertEq(promiseTitles[1], promiseTitle2);
    }

    function test_GetPromises() public {
        bytes32 promiseTitle1 = "Promise 1".toBytes32();
        bytes32 promiseTitle2 = "Promise 2".toBytes32();
        partyPromises.AddPromise(promiseTitle1, "Description 1");
        partyPromises.AddPromise(promiseTitle2, "Description 2");

        mapping(bytes32 => PartyPromises.Promise) memory promises = partyPromises.getPromises();
        assertEq(promises[promiseTitle1].description, "Description 1");
        assertEq(promises[promiseTitle1].completed, false);
        assertEq(promises[promiseTitle2].description, "Description 2");
        assertEq(promises[promiseTitle2].completed, false);
    }

    function test_GetPromiseDescription() public {
        bytes32 promiseTitle = "Promise 1".toBytes32();
        partyPromises.AddPromise(promiseTitle, "Description 1");

        string description = partyPromises.GetPromiseDescription(promiseTitle);
        assertEq(description, "Description 1");
    }

    function test_GetPromiseCompleted() public {
        bytes32 promiseTitle = "Promise 1".toBytes32();
        partyPromises.AddPromise(promiseTitle, "Description 1");

        bool completed = partyPromises.GetPromiseCompleted(promiseTitle);
        assertEq(completed, false);

        partyPromises.CompletePromise(promiseTitle);
        completed = partyPromises.GetPromiseCompleted(promiseTitle);
        assertEq(completed, true);
    }

    /**
     * The following tests will test all donation-related functions
     */
    function test_Donate() public {
        bytes32 promiseTitle1 = "Promise 1".toBytes32();
        bytes32 promiseTitle2 = "Promise 2".toBytes32();
        partyPromises.AddPromise(promiseTitle1, "Description 1");
        partyPromises.AddPromise(promiseTitle2, "Description 2");

        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;
        bytes32[] memory promiseTitles = [promiseTitle1, promiseTitle2];
        uint256[] memory amounts = [amount1, amount2];
        partyPromises.Donate{value: amount1 + amount2}(amount1 + amount2, promiseTitles, amounts);

        assertEq(partyPromises.donors(address(this)).totalAmount, amount1 + amount2);
        assertEq(partyPromises.donors(address(this)).promiseDonations(promiseTitle1), amount1);
        assertEq(partyPromises.donors(address(this)).promiseDonations(promiseTitle2), amount2);
    }

    function test_DonateAnonymouslyNonRefundable() {
        partyPromises.DonateAnonymouslyNonRefundable{value: 1 ether}();
    }

    /**
     * The following tests will test all donor-related functions
     */
    function test_GetDonorAddresses() public {
        bytes32 promiseTitle1 = "Promise 1".toBytes32();
        bytes32 promiseTitle2 = "Promise 2".toBytes32();
        partyPromises.AddPromise(promiseTitle1, "Description 1");
        partyPromises.AddPromise(promiseTitle2, "Description 2");

        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;
        bytes32[] memory promiseTitles = [promiseTitle1, promiseTitle2];
        uint256[] memory amounts = [amount1, amount2];
        partyPromises.donate(amount1 + amount2, promiseTitles, amounts);

        address[] addresses = partyPromises.GetDonorAddresses();
        assertEq(addresses[0], address(this));
    }
}

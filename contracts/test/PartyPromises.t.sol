// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {PartyPromises} from "../src/PartyPromises.sol";

contract PartyPromisesTest is Test {
    PartyPromises public partyPromises;
    bytes32 public partyName;
    uint32 public creationTime;
    uint32 public expirationTime;
    address public owner;
    bytes32 public promiseTitle1;
    bytes32 public promiseTitle2;
    string public description1;
    string public description2;
    bytes32[] public promiseTitles;
    string[] public descriptions;
    string public url;

    function setUp() public {
        partyName = "Example Party";
        creationTime = uint32(block.timestamp);
        expirationTime = creationTime + 1 days;
        owner = address(this);
        promiseTitle1 = "Promise1";
        promiseTitle2 = "Promise2";
        description1 = "Description 1";
        description2 = "Description 2";
        url = "https://example.com";

        promiseTitles = new bytes32[](2);
        promiseTitles[0] = promiseTitle1;
        promiseTitles[1] = promiseTitle2;

        descriptions = new string[](2);
        descriptions[0] = description1;
        descriptions[1] = description2;

        partyPromises = new PartyPromises(partyName, expirationTime, url, promiseTitles, descriptions);

        vm.deal(address(this), 100 ether);
    }

    /**
     * The following tests will test the constructor
     */
    function test_Constructor() public {
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

    function test_ConstructorNoArgs() public {
        PartyPromises partyPromises2 = new PartyPromises(partyName, expirationTime, "", new bytes32[](0), new string[](0));

        assertEq(partyPromises2.GetOwner(), address(this));
        assertEq(partyPromises2.GetPartyName(), partyName);
        assertEq(partyPromises2.creationTime(), creationTime);
        assertEq(partyPromises2.GetExpirationTime(), expirationTime);
        assertEq(partyPromises2.GetPartyProgramURL(), "Not set");
        assertEq(partyPromises2.GetPartyBalance(), 0);

        bytes32[] memory _promiseTitles = partyPromises2.GetPromiseTitles();
        assertEq(_promiseTitles.length, 0);

        string[] memory _descriptions;
        bool[] memory _completions;
        (_promiseTitles, _descriptions, _completions) = partyPromises2.GetPromises();
        assertEq(_promiseTitles.length, 0);
        assertEq(_descriptions.length, 0);
        assertEq(_completions.length, 0);
    }

    function testFail_ConstructorDifferentLengths() public {
        bytes32[] memory _promiseTitles = new bytes32[](1);
        _promiseTitles[0] = promiseTitle1;

        string[] memory _descriptions = new string[](2);
        _descriptions[0] = description1;
        _descriptions[1] = description2;
        new PartyPromises(partyName, expirationTime, url, _promiseTitles, _descriptions);
    }

    /**
     * The following tests will test the receive && fallback functions
     */
    function testFail_SendEthAnonymously() public {
        (bool success,) = address(partyPromises).call{value: 1 ether}("");
        require(!success, "Ether transfer should fail");
    }

    /**
     * The following tests will test all promise-related functions
     */
    function test_AddPromise() public {
        bytes32 promiseTitle = "Promise3";
        string memory description = "Description 3";
        partyPromises.AddPromise(promiseTitle, description);

        assertEq(partyPromises.promiseTitles(2), promiseTitle);
        assertEq(partyPromises.promises(promiseTitle).description, description1);
        assertEq(partyPromises.promises(promiseTitle).completed, false);
    }

    function test_CompletePromise() public {
        partyPromises.CompletePromise(promiseTitle1);
        assertEq(partyPromises.promises(promiseTitle1).completed, true);

        partyPromises.CompletePromise(promiseTitle1);
        assertEq(partyPromises.promises(promiseTitle1).completed, true);
    }

    function test_UncompletePromise() public {
        partyPromises.CompletePromise(promiseTitle1);
        assertEq(partyPromises.promises(promiseTitle1).completed, true);

        partyPromises.UncompletePromise(promiseTitle1);
        assertEq(partyPromises.promises(promiseTitle1).completed, false);

        partyPromises.UncompletePromise(promiseTitle1);
        assertEq(partyPromises.promises(promiseTitle1).completed, false);
    }

    function test_GetPromiseTitles() public {
        bytes32[] memory _promiseTitles = partyPromises.GetPromiseTitles();
        assertEq(_promiseTitles[0], promiseTitle1);
        assertEq(_promiseTitles[1], promiseTitle2);
    }

    function test_GetPromises() public {
        mapping(bytes32 => PartyPromises.Promise) memory promises = partyPromises.GetPromises();
        assertEq(promises[promiseTitle1].description, description1);
        assertEq(promises[promiseTitle1].completed, false);
        assertEq(promises[promiseTitle2].description, description2);
        assertEq(promises[promiseTitle2].completed, false);
    }

    function test_GetPromiseDescription() public {
        string memory description = partyPromises.GetPromiseDescription(promiseTitle1);
        assertEq(description, description1);
    }

    function test_GetPromiseCompleted() public {
        bool completed = partyPromises.GetPromiseCompleted(promiseTitle1);
        assertEq(completed, false);

        partyPromises.CompletePromise(promiseTitle1);
        completed = partyPromises.GetPromiseCompleted(promiseTitle1);
        assertEq(completed, true);
    }

    /**
     * The following tests will test all donation-related functions
     */
    function test_Donate() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;
        bytes32[] memory _promiseTitles = [promiseTitle1, promiseTitle2];
        uint256[] memory amounts = [amount1, amount2];
        partyPromises.Donate{value: amount1 + amount2}(amount1 + amount2, _promiseTitles, amounts);

        assertEq(partyPromises.donors(address(this)).totalAmount, amount1 + amount2);
        assertEq(partyPromises.donors(address(this)).promiseDonations(promiseTitle1), amount1);
        assertEq(partyPromises.donors(address(this)).promiseDonations(promiseTitle2), amount2);
    }

    function testFail_DonatedAlready() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;
        bytes32[] memory _promiseTitles = [promiseTitle1, promiseTitle2];
        uint256[] memory amounts = [amount1, amount2];

        partyPromises.Donate{value: amount1 + amount2}(amount1 + amount2, _promiseTitles, amounts);
        partyPromises.Donate{value: amount1 + amount2}(amount1 + amount2, _promiseTitles, amounts);
    }

    function test_HandlePromiseFundsOneCompleted() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;
        bytes32[] memory _promiseTitles = [promiseTitle1, promiseTitle2];
        uint256[] memory amounts = [amount1, amount2];
        partyPromises.Donate{value: amount1 + amount2}(amount1 + amount2, _promiseTitles, amounts);

        partyPromises.CompletePromise(promiseTitle1);
        vm.warp(creationTime + 2 days);

        partyPromises.HandlePromiseFunds();
        assertEq(partyPromises.GetPartyBalance(), 2 ether);
        assertEq(address(this).balance, 98 ether);
    }

    function test_HandlePromiseFundsAllCompleted() public {
        partyPromises.CompletePromise(promiseTitle1);
        partyPromises.CompletePromise(promiseTitle2);
        vm.warp(creationTime + 2 days);

        partyPromises.HandlePromiseFunds();
        assertEq(partyPromises.GetPartyBalance(), 0);
    }

    function testFail_HandlePromiseFundsTooEarly() public {
        vm.warp(creationTime + 1 days);
        partyPromises.CompletePromise(promiseTitle1);
    }

    function testFail_HandlePromiseFundsCalledByWrongAddress() public {
        address unauthorizedAddress = address(0x123);
        vm.prank(unauthorizedAddress);

        partyPromises.HandlePromiseFunds();
    }

    /**
     * The following tests will test all donor-related functions
     */
    function test_GetDonorAddresses() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;
        bytes32[] memory _promiseTitles = [promiseTitle1, promiseTitle2];
        uint256[] memory amounts = [amount1, amount2];
        partyPromises.donate(amount1 + amount2, _promiseTitles, amounts);

        address[] memory addresses = partyPromises.GetDonorAddresses();
        assertEq(addresses[0], address(this));
    }

    function test_GetDonorTotalAmount() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;
        bytes32[] memory _promiseTitles = [promiseTitle1, promiseTitle2];
        uint256[] memory amounts = [amount1, amount2];
        partyPromises.donate(amount1 + amount2, _promiseTitles, amounts);

        uint256 totalAmount = partyPromises.GetDonorTotalAmount(address(this));
        assertEq(totalAmount, amount1 + amount2);
    }

    function test_GetDonorPromiseDonations() public {
        mapping(bytes32 => uint256) memory promiseDonations = partyPromises.GetDonorPromiseDonations(address(this));
    }

    /**
     * The following tests will test all party-contract-related functions
     */
    function test_GetPartyBalance() public {
        partyPromises.DonateAnonymouslyNonRefundable{value: 1 ether}();
        assertEq(partyPromises.GetPartyBalance(), 1 ether);
    }

    function test_GetOwner() public {
        assertEq(partyPromises.GetOwner(), address(this));
    }

    function test_GetPartyName() public {
        assertEq(partyPromises.GetPartyName(), "Example Party");
    }

    function test_GetCreationTime() public {
        assertEq(partyPromises.GetCreationTime(), creationTime);
    }

    function test_GetExpirationTime() public {
        assertEq(partyPromises.GetExpirationTime(), expirationTime);
    }
}

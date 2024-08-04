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

    receive() external payable {}

    fallback() external payable {}

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
    function test_Constructor() public view {
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
        (bool success, ) = address(partyPromises).call{value: 1 ether}("");
        require(success, "Call should have failed");
    }

    /**
     * The following tests will test all promise-related functions
     */
    function test_AddPromise() public {
        bytes32 _promiseTitle = "Promise3";
        string memory _description = "Description 3";
        partyPromises.AddPromise(_promiseTitle, _description);

        bytes32[] memory _promiseTitles;
        string[] memory _descriptions;
        bool[] memory _completions;
        (_promiseTitles, _descriptions, _completions) = partyPromises.GetPromises();
        assertEq(_promiseTitles[2], _promiseTitle);
        assertEq(_descriptions[2], _description);
        assertEq(_completions[2], false);
    }

    function test_CompletePromise() public {
        address validatorAddress = address(0x123);
        vm.startPrank(validatorAddress);
        partyPromises.CompletePromise(promiseTitle1);
        assertEq(partyPromises.GetPromiseCompleted(promiseTitle1), true);
        vm.stopPrank();
    }

    function test_UncompletePromise() public {
        address validatorAddress = address(0x123);
        vm.startPrank(validatorAddress);
        partyPromises.CompletePromise(promiseTitle1);
        assertEq(partyPromises.GetPromiseCompleted(promiseTitle1), true);

        partyPromises.UncompletePromise(promiseTitle1);
        assertEq(partyPromises.GetPromiseCompleted(promiseTitle1), false);

        partyPromises.UncompletePromise(promiseTitle1);
        assertEq(partyPromises.GetPromiseCompleted(promiseTitle1), false);
        vm.stopPrank();
    }

    function test_GetPromiseTitles() public view {
        bytes32[] memory _promiseTitles = partyPromises.GetPromiseTitles();
        assertEq(_promiseTitles[0], promiseTitle1);
        assertEq(_promiseTitles[1], promiseTitle2);
    }

    function test_GetPromises() public view {
        bytes32[] memory _promiseTitles;
        string[] memory _descriptions;
        bool[] memory _completions;
        (_promiseTitles, _descriptions, _completions) = partyPromises.GetPromises();

        assertEq(_promiseTitles[0], promiseTitle1);
        assertEq(_descriptions[0], description1);
        assertEq(_completions[0], false);
        assertEq(_promiseTitles[1], promiseTitle2);
        assertEq(_descriptions[1], description2);
        assertEq(_completions[1], false);
    }

    function test_GetPromiseDescription() public view {
        string memory _description = partyPromises.GetPromiseDescription(promiseTitle1);
        assertEq(_description, description1);
    }

    function test_GetPromiseCompleted() public {
        bool completed = partyPromises.GetPromiseCompleted(promiseTitle1);
        assertEq(completed, false);

        address validatorAddress = address(0x123);
        vm.startPrank(validatorAddress);
        partyPromises.CompletePromise(promiseTitle1);
        vm.stopPrank();

        completed = partyPromises.GetPromiseCompleted(promiseTitle1);
        assertEq(completed, true);
    }

    /**
     * The following tests will test all donation-related functions
     */
    function test_Donate() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;

        bytes32[] memory _promiseTitles = new bytes32[](2);
        _promiseTitles = new bytes32[](2);
        _promiseTitles[0] = promiseTitle1;
        _promiseTitles[1] = promiseTitle2;

        uint256[] memory _amounts = new uint256[](2);
        _amounts = new uint256[](2);
        _amounts[0] = amount1;
        _amounts[1] = amount2;

        partyPromises.Donate{value: amount1 + amount2}(amount1 + amount2, _promiseTitles, _amounts);

        assertEq(partyPromises.GetPartyBalance(), amount1 + amount2);
        assertEq(address(this).balance, 97 ether);
    }

    function testFail_DonatedAlready() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;

        bytes32[] memory _promiseTitles = new bytes32[](2);
        _promiseTitles = new bytes32[](2);
        _promiseTitles[0] = promiseTitle1;
        _promiseTitles[1] = promiseTitle2;

        uint256[] memory _amounts = new uint256[](2);
        _amounts = new uint256[](2);
        _amounts[0] = amount1;
        _amounts[1] = amount2;

        partyPromises.Donate{value: amount1 + amount2}(amount1 + amount2, _promiseTitles, _amounts);
        partyPromises.Donate{value: amount1 + amount2}(amount1 + amount2, _promiseTitles, _amounts);
    }

    function test_HandlePromiseFundsOneCompleted() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;

        bytes32[] memory _promiseTitles = new bytes32[](2);
        _promiseTitles = new bytes32[](2);
        _promiseTitles[0] = promiseTitle1;
        _promiseTitles[1] = promiseTitle2;

        uint256[] memory _amounts = new uint256[](2);
        _amounts = new uint256[](2);
        _amounts[0] = amount1;
        _amounts[1] = amount2;

        partyPromises.Donate{value: amount1 + amount2}(amount1 + amount2, _promiseTitles, _amounts);

        address validatorAddress = address(0x123);
        vm.startPrank(validatorAddress);
        partyPromises.CompletePromise(promiseTitle1);
        vm.stopPrank();

        vm.warp(expirationTime + 1 days);

        partyPromises.HandlePromiseFunds();
        assertApproxEqAbs(partyPromises.GetPartyBalance(), 0, 21000);
        assertApproxEqAbs(address(this).balance, 100 ether, 21000);
    }

    function test_HandlePromiseFundsAllCompleted() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;

        bytes32[] memory _promiseTitles = new bytes32[](2);
        _promiseTitles = new bytes32[](2);
        _promiseTitles[0] = promiseTitle1;
        _promiseTitles[1] = promiseTitle2;

        uint256[] memory _amounts = new uint256[](2);
        _amounts = new uint256[](2);
        _amounts[0] = amount1;
        _amounts[1] = amount2;

        partyPromises.Donate{value: amount1 + amount2}(amount1 + amount2, _promiseTitles, _amounts);

        address validatorAddress = address(0x123);
        vm.startPrank(validatorAddress);
        partyPromises.CompletePromise(promiseTitle1);
        partyPromises.CompletePromise(promiseTitle2);
        vm.stopPrank();
        vm.warp(creationTime + 2 days);

        partyPromises.HandlePromiseFunds();
        assertApproxEqAbs(partyPromises.GetPartyBalance(), 0, 21000);
    }

    function testFail_HandlePromiseFundsTooEarly() public {
        vm.warp(creationTime + 1 days);

        address validatorAddress = address(0x123);
        vm.startPrank(validatorAddress);
        partyPromises.CompletePromise(promiseTitle1);
        vm.stopPrank();

        partyPromises.HandlePromiseFunds();
    }

    function testFail_HandlePromiseFundsCalledByWrongAddress() public {
        address unauthorizedAddress = address(0x123);
        vm.startPrank(unauthorizedAddress);

        partyPromises.HandlePromiseFunds();
    }

    /**
     * The following tests will test all donor-related functions
     */
    function test_GetDonorAddresses() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;

        bytes32[] memory _promiseTitles = new bytes32[](2);
        _promiseTitles = new bytes32[](2);
        _promiseTitles[0] = promiseTitle1;
        _promiseTitles[1] = promiseTitle2;

        uint256[] memory _amounts = new uint256[](2);
        _amounts = new uint256[](2);
        _amounts[0] = amount1;
        _amounts[1] = amount2;

        partyPromises.Donate{value: amount1 + amount2}(amount1 + amount2, _promiseTitles, _amounts);

        address payable[] memory addresses = partyPromises.GetDonorAddresses();
        assertEq(addresses[0], address(this));
    }

    function test_GetDonorTotalAmount() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;

        bytes32[] memory _promiseTitles = new bytes32[](2);
        _promiseTitles = new bytes32[](2);
        _promiseTitles[0] = promiseTitle1;
        _promiseTitles[1] = promiseTitle2;

        uint256[] memory _amounts = new uint256[](2);
        _amounts = new uint256[](2);
        _amounts[0] = amount1;
        _amounts[1] = amount2;

        partyPromises.Donate{value: amount1 + amount2}(amount1 + amount2, _promiseTitles, _amounts);

        uint256 totalAmount = partyPromises.GetDonorTotalAmount(address(this));
        assertEq(totalAmount, amount1 + amount2);
    }

    function test_GetDonorPromiseDonations() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;

        bytes32[] memory _promiseTitles = new bytes32[](2);
        _promiseTitles = new bytes32[](2);
        _promiseTitles[0] = promiseTitle1;
        _promiseTitles[1] = promiseTitle2;

        uint256[] memory _amounts = new uint256[](2);
        _amounts = new uint256[](2);
        _amounts[0] = amount1;
        _amounts[1] = amount2;

        partyPromises.Donate{value: amount1 + amount2}(amount1 + amount2, _promiseTitles, _amounts);

        bytes32[] memory _promiseTitles2;
        uint256[] memory _promiseDonations;
        (_promiseTitles2, _promiseDonations) = partyPromises.GetDonorPromiseDonations(address(this));

        assertEq(_promiseTitles2[0], promiseTitle1);
        assertEq(_promiseDonations[0], amount1);
        assertEq(_promiseTitles2[1], promiseTitle2);
        assertEq(_promiseDonations[1], amount2);
    }

    /**
     * The following tests will test all party-contract-related functions
     */
    function test_GetPartyBalance() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;

        bytes32[] memory _promiseTitles = new bytes32[](2);
        _promiseTitles = new bytes32[](2);
        _promiseTitles[0] = promiseTitle1;
        _promiseTitles[1] = promiseTitle2;

        uint256[] memory _amounts = new uint256[](2);
        _amounts = new uint256[](2);
        _amounts[0] = amount1;
        _amounts[1] = amount2;

        partyPromises.Donate{value: amount1 + amount2}(amount1 + amount2, _promiseTitles, _amounts);
        assertEq(partyPromises.GetPartyBalance(), amount1 + amount2);
    }

    function test_GetOwner() public view {
        assertEq(partyPromises.GetOwner(), address(this));
    }

    function test_GetPartyName() public view {
        assertEq(partyPromises.GetPartyName(), "Example Party");
    }

    function test_GetCreationTime() public view {
        assertEq(partyPromises.GetCreationTime(), creationTime);
    }

    function test_GetExpirationTime() public view {
        assertEq(partyPromises.GetExpirationTime(), expirationTime);
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {PartyPromises} from "../src/PartyPromises.sol";

contract PartyPromisesFactoryTest is Test {
    receive() external payable {}

    fallback() external payable {}

    function setUp() public {}
}

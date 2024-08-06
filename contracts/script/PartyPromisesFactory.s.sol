// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {PartyPromisesFactory} from "../src/PartyPromisesFactory.sol";

import "forge-std/console.sol";

contract PartyPromisesFactoryScript is Script {
    PartyPromisesFactory public companyFactory;

    function setUp() public {}

    function run() public {
        uint256 privateKey = vm.envUint("DEV_PRIVATE_KEY");

        vm.startBroadcast(privateKey);

        companyFactory = new PartyPromisesFactory();
        console.log("PartyPromisesFactory created at address: ", address(companyFactory));

        vm.stopBroadcast();
    }
}

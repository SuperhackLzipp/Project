// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {CompanyFactory} from "../src/CompanyFactory.sol";

import "forge-std/console.sol";

contract CompanyFactoryScript is Script {
    CompanyFactory public companyFactory;

    function setUp() public {}

    function run() public {
        uint256 privateKey = vm.envUint("DEV_PRIVATE_KEY");
        address account = vm.addr(privateKey);

        vm.startBroadcast(privateKey);

        companyFactory = new CompanyFactory();

        vm.stopBroadcast();
    }
}

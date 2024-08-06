// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Resolver} from "../src/Resolver.sol";
import {IEAS, Attestation} from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";

import "forge-std/console.sol";

contract ResolverScript is Script {
    Resolver public resolver;

    function setUp() public {}

    function run() public {
        uint256 privateKey = vm.envUint("DEV_PRIVATE_KEY");
        address easAddress = vm.envAddress("BASE_SEPOLIA_EAS_ADDRESS");

        IEAS eas = IEAS(easAddress);
        bytes32 companyName = keccak256(abi.encodePacked("Example Company"));
        bytes32[] memory validAttesters = new bytes32[](1);
        validAttesters[0] = keccak256(abi.encodePacked(vm.addr(privateKey)));

        vm.startBroadcast(privateKey);

        resolver = new Resolver(eas, companyName, validAttesters);

        vm.stopBroadcast();
    }
}

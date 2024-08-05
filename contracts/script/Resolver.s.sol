// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {ComplaintResolver} from "../src/ComplaintResolver.sol";
import { IEAS, Attestation } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";

import "forge-std/console.sol";

contract ComplaintResolverScript is Script {
    ComplaintResolver public complaintResolver;

    function setUp() public {}

    function run() public {
        uint256 privateKey = vm.envUint("DEV_PRIVATE_KEY");
        address easAddress = vm.envAddress("ETH_SEPOLIA_EAS_ADDRESS");

        IEAS eas = IEAS(easAddress);
        bytes32 companyName = keccak256(abi.encodePacked("Example Company"));
        address[] memory validAttesters = new address[](1);
        validAttesters[0] = vm.addr(privateKey);

        vm.startBroadcast(privateKey);

        complaintResolver = new ComplaintResolver(
            eas,
            companyName,
            validAttesters
        );

        vm.stopBroadcast();
    }
}

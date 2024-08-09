// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import { SchemaResolver } from "@ethereum-attestation-service/eas-contracts/contracts/resolver/SchemaResolver.sol";
// contracts/node_modules/@ethereum-attestation-service/eas-contracts/contracts/resolver/SchemaResolver.sol
import { IEAS, Attestation } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";

/**
 * @title AttesterResolver
 * @notice A sample schema resolver that checks whether the attestation is from a specific attester.
 */
contract AttesterResolver is SchemaResolver {
    address private immutable targetAttester;

    constructor(IEAS eas, address _targetAttester) SchemaResolver(eas) {
        targetAttester = _targetAttester;
    }

    function onAttest(Attestation calldata attestation, uint256 /*value*/) internal view override returns (bool) {
        return attestation.attester == targetAttester;
    }

    function onRevoke(Attestation calldata /*attestation*/, uint256 /*value*/) internal pure override returns (bool) {
        return true;
    }
}

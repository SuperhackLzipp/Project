// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@ethereum-attestation-service/eas-contracts/contracts/resolver/SchemaResolver.sol";

contract ComplaintResolver is SchemaResolver {
    bytes32 public immutable partyName;
    bytes32[] private validAttestersHashed;

    constructor(IEAS eas, bytes32 _partyName, bytes32[] memory _validAttestersHashed) SchemaResolver(eas) {
        partyName = _partyName;
        validAttestersHashed = _validAttestersHashed;
    }

    function onAttest(Attestation calldata attestation, uint256 /*value*/ ) internal view override returns (bool) {
        bytes32 attesterHash = keccak256(abi.encodePacked(attestation.attester));
        for (uint256 i = 0; i < validAttestersHashed.length; i++) {
            if (attesterHash == validAttestersHashed[i]) {
                return true;
            }
        }
        return false;
    }

    function onRevoke(Attestation calldata, /*attestation*/ uint256 /*value*/ ) internal pure override returns (bool) {
        return true;
    }
}

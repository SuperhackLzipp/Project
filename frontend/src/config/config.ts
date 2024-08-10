// Ethereum Sepolia
export const ETH_SEPOLIA_EAS_ADDRESS =
    "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
export const ETH_SEPOLIA_SCHEMA_REGISTRY_ADDRESS =
    "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
export const ETH_SEPOLIA_FACTORY_ADDRESS =
    "0xb7e0f07a837e95c26f86e8230c79dfe461f06b2a";
// Base Sepolia
export const BASE_SEPOLIA_EAS_ADDRESS =
    "0x4200000000000000000000000000000000000021";
export const BASE_SEPOLIA_SCHEMA_REGISTRY_ADDRESS =
    "0x4200000000000000000000000000000000000020";

// ABIs
import ABI1 from "../../../contracts/out/PartyPromises.sol/PartyPromises.json";
export const ABI_PARTY = ABI1;

import ABI2 from "../../../contracts/out/PartyPromisesFactory.sol/PartyPromisesFactory.json";
export const ABI_FACTORY = ABI2;

// Schema
export const SCHEMA =
    "bytes32 promiseTitle, string description, bool isCompleted";
export const SCHEMA_DETAILS = {
    schemaName: "Party Promise Attestation Schema",
    promiseTitle: "byte32 (title of promise)",
    description: "string (description of promise)",
    isCompleted: "bool (is promise completed)",
};

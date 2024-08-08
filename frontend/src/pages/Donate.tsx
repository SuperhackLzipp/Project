import React, { useState } from "react";

import AddressInputForm from "../components/AddressInputForm";

export const DonationPage: React.FC = () => {
    const [contractAddress, setContractAddress] = useState<string>("");

    return (
        <AddressInputForm
            contractAddress={contractAddress}
            setContractAddress={setContractAddress}
        />
    );
};

export default DonationPage;

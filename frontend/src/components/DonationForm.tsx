import React from "react";
import DonationPromisesList from "./DonationPromisesList";

interface Promise {
    title: string;
    description: string;
    amount: number;
}

interface DonationPromisesListProps {
    promises: Promise[];
    setPromises: React.Dispatch<React.SetStateAction<Promise[]>>;
}

const DonationForm: React.FC<DonationPromisesListProps> = ({
    promises,
    setPromises,
}) => {
    return (
        <DonationPromisesList promises={promises} setPromises={setPromises} />
    );
};

export default DonationForm;

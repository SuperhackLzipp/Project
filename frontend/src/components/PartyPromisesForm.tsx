import React, { useState, useEffect } from "react";

export const PartyPromisesForm: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [promises, setPromises] = useState<string[]>([]);
    const [newPromise, setNewPromise] = useState<string>("");

    const handleAddPromise = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newPromise.trim() !== "") {
            setPromises([...promises, newPromise]);
            setNewPromise(""); // Reset input field after adding
        }
    };

    return (
        <div>
            <form>
                <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="party"
                >
                    PartyName
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </form>
            <ul>
                {promises.map((promise, index) => (
                    <li key={index}>{promise}</li>
                ))}
            </ul>
            <form onSubmit={handleAddPromise}>
                <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="newPromise"
                >
                    Add New Promise
                </label>
                <input
                    type="text"
                    id="newPromise"
                    value={newPromise}
                    onChange={(e) => setNewPromise(e.target.value)}
                    className="mt-1 block w-full"
                />
                <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Add Promise
                </button>
            </form>
        </div>
    );
};

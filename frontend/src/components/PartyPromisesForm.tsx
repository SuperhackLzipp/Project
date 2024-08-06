import React, { useState } from "react";
import "../styles/PartyPromisesForm.css";

export const PartyPromisesForm: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [promises, setPromises] = useState<
        Array<{ title: string; description: string; attester: string }>
    >([]);
    const [newPromise, setNewPromise] = useState<{
        title: string;
        description: string;
        attester: string;
    }>({ title: "", description: "", attester: "" });

    const handleAddPromise = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (
            newPromise.title.trim() !== "" &&
            newPromise.description.trim() !== "" &&
            newPromise.attester.trim() !== ""
        ) {
            setPromises([...promises, newPromise]);
            setNewPromise({ title: "", description: "", attester: "" }); // Reset input fields after adding
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPromise((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <form className="partyField">
                <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="party"
                >
                    Party Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </form>
            <ul className="formItem">
                {promises.map((promise, index) => (
                    <li key={index}>
                        <div>
                            <label>Title</label>
                            <h3>{promise.title}</h3>
                        </div>
                        <div>
                            <label>Description</label>
                            <p>{promise.description}</p>
                        </div>
                        <div>
                            <label>Attester</label>
                            <p>{promise.attester}</p>
                        </div>
                        <button
                            onClick={() => {
                                const updatedPromises = promises.filter(
                                    (_, i) => i !== index
                                );
                                setPromises(updatedPromises);
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddPromise} className="promiseField">
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="title"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={newPromise.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="description"
                    >
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={newPromise.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="description"
                    >
                        Attester
                    </label>
                    <input
                        type="text"
                        id="attester"
                        name="attester"
                        value={newPromise.attester}
                        onChange={handleChange}
                        pattern="[0-9a-fA-F]+"
                        title="Please enter a hexadecimal value."
                    />
                </div>
                <button type="submit">Add Promise</button>
            </form>
        </div>
    );
};

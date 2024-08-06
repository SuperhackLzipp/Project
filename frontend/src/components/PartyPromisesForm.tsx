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
                <label className="label" htmlFor="party">
                    Party Name
                </label>
                <input
                    className="textField"
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
                <div className="titleField">
                    <label className="label" htmlFor="title">
                        Title
                    </label>
                    <input
                        className="textField"
                        type="text"
                        id="title"
                        name="title"
                        value={newPromise.title}
                        onChange={handleChange}
                    />
                </div>
                <div className="descriptionField">
                    <label className="label" htmlFor="description">
                        Description
                    </label>
                    <input
                        className="textField"
                        type="text"
                        id="description"
                        name="description"
                        value={newPromise.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="attesterField">
                    <label className="label" htmlFor="description">
                        Attester
                    </label>
                    <input
                        className="textField"
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

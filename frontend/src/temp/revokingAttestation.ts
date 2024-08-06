const transaction = await eas.revoke({
    schema: "0x85500e806cf1e74844d51a20a6d893fe1ed6f6b0738b50e43d774827d08eca61",
    data: {
        uid: "0x6776de8122c352b4d671003e58ca112aedb99f34c629a1d1fe3b332504e2943a",
    },
});

// Optional: Wait for transaction to be validated
await transaction.wait();

// Import required modules
const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
require('dotenv').config();

// State object to hold the database connection
const state = {
    db: null,
};

// Function to connect to the database
module.exports.connect = (done) => {
    const url = 'mongodb://muhammednawafbuissness:WEPrNexnl2CNM1Jf@cluster0.cnkil.mongodb.net/Auditorium-Bookings?retryWrites=true&w=majority';

    const client = new MongoClient(url, {
        tls: false, // Force TLS
        tlsAllowInvalidCertificates: true, // Prevent invalid certificates
        serverSelectionTimeoutMS: 5000 // Reduce timeout
      });
    const dbName = 'Auditorium-Bookings';

    async function main() {
        try {
            await client.connect();
            console.log('Connected successfully to server');
            state.db = client.db(dbName);
            done(); // Call done callback after successful connection
        } catch (error) {
            console.error(error);
            console.error("MongoDB Connection Error:", error);
            done(error); // Call done with error if connection fails
        }
    }

    main();
};

// Function to get the database instance
module.exports.get = () => {
    return state.db;
};

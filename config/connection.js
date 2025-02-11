const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const express = require('express');
const router = express.Router();

const state = {
    db: null,
};

// Function to connect to the database
module.exports.connect = async (done) => {
    const uri = process.env.MONGO_URI || "mongodb+srv://muhammednawafbuissness:WEPrNexnl2CNM1Jf@cluster0.cnkil.mongodb.net/Auditorium-Bookings?retryWrites=true&w=majority&appName=Cluster0";

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        state.db = client.db("Auditorium-Bookings"); // Assign the connected database to state.db
        console.log("✅ MongoDB Connected Successfully!");
        done();
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        done(error);
    }
};

// Function to get the database instance
module.exports.get = () => {
    return state.db;
};

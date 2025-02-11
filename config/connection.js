// Import required modules
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const router = express.Router();
require('dotenv').config();

// State object to hold the database connection
const state = {
    db: null,
};

// Function to connect to the database
module.exports.connect = (done) => {
    
const uri = "mongodb+srv://muhammednawafbuissness:WEPrNexnl2CNM1Jf@cluster0.cnkil.mongodb.net/Auditorium-Bookings?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

};

// Function to get the database instance
module.exports.get = () => {
    return state.db;
};

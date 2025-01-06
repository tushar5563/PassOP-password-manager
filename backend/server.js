const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors=require('cors')

dotenv.config();

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'passop';
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors())
// Ensure MongoDB connection
client.connect()
  .then(() => console.log('Connected successfully to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit if connection fails
  });

// Get all the passwords
app.get('/', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('paswordss');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data', details: err.message });
  }
});

// Save a password
app.post('/', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('paswordss');
    const passwordData = req.body;
    const insertResult = await collection.insertOne(passwordData);
    res.json(insertResult);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save data', details: err.message });
  }
});

// Delete a password
app.delete('/', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('paswordss');
    const passwordData = req.body; // Assuming the request body contains the filter criteria
    const deleteResult = await collection.deleteOne(passwordData);
    res.json(deleteResult);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete data', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

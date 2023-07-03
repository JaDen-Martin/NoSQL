// app.js
//
// Routes that connect to frontend and call
// queries to request data

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const { allData, getByGrowthRate, allDataNum, getByNames, getByRank, getSingleName, topTen } = require('./Functions/function.js');

const app = express();


const uri = "mongodb+srv://Admin:nyjd-2023@nyjd.xa26v9a.mongodb.net/?retryWrites=true&w=majority";
app.use(cors());

app.listen(3000, () => console.log("Server is running"));


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const myDB = client.db("NoSql");
const myColl = myDB.collection("baby_names");

app.get('/', (req, res) => {
  res.send('root'); 
});

app.get('/allData', async (req, res) =>  { 

  const data = await allData(myColl); 
  res.json(data);
});

app.get('/allData/:field/:pageNumber/:order/:gender', async (req, res) =>  { 
  
  const { field, pageNumber, order, gender } = req.params;
  const data = await allDataNum(field, pageNumber, order, gender, myColl); 
  res.json(data);
 
});

app.get('/names/:searchTerm', async (req, res) =>  { 
  const { searchTerm } = req.params;
  const names = await getByNames(searchTerm, myColl); 
  // Needs a route
  // await allDataJoined(searchTerm, mycoll);
  res.json(names);
 
});

app.get('/name/:name', async (req, res) =>  { 
  const { name } = req.params;
  const names = await getSingleName(name, myColl); 
  // const ranks = await getByRank(name, 10);
  res.json(names);
 
});

// Gets names for a certain rank and above
app.get('/name/:name/:rank', async (req, res) => {
  const { name, rank } = req.params;
  const names = await getByRank(name, rank, myColl);

  res.json(names);
});

app.get('/topTenMaleNames', async (req, res) => {
  const data = await topTen('Male', myColl);
  res.json(data);
});

app.get('/topTenFemaleNames', async (req, res) => {
  const data = await topTen('Female', myColl);
   res.json(data);
});

app.get('/topTenGrowthRate', async (req, res) => {
  const data = await getByGrowthRate(myColl);
  res.json(data);
});

app.get('/botTenGrowthRate', async (req, res) => {
  const data = await getByGrowthRate(myColl, low = true);
  res.json(data);
});


// connect to the database
async function run() {
    try {
      // Connect the client to the server    (optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
}
  run().catch(console.dir);

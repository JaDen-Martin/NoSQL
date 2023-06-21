const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion } = require('mongodb');
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

app.get('/', (req, res) => {
  res.send('root')
});

app.get('/allData', async (req, res) =>  { 
  const data = await allData(); res.send(JSON.stringify(data)) 
});

app.get('/allData/' + ':pageNumber', async (req, res) =>  { 
  var page = req.params.pageNumber;
  const data = await allDataNum(page); res.send(JSON.stringify(data)) 
});

const myDB = client.db("NoSql");
const myColl = myDB.collection("baby_names");

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

// Function call to import all data from the database
async function allData() {

  let category = "rank";
  const data = await myColl.find().sort({[category]: 1}).toArray();
  return data;
}

async function allDataNum(page) {

  let category = "rank";
  const data = await myColl.find().sort({[category]: 1}).toArray();

  let list = [];

  var set = page * 500;
  
  for(var x = set - 1; x <= page * 500; x++) {
    list[x] = data[x];
  }
  console.log(x - set);
  return list;
}
// Rank values within a threshold
async function listByOrderedRank() {

  let category = "rank";
  for(let x = 0; x < 100; x++) {
  
      const data = await myColl.find({ "rank": x}).toArray();
      console.log(data);
  }
}

// Rank top or lowest items
async function listByRank() {

   let x = 5;
   const data = await myColl.find( {"rank":{$lt: x}}).toArray();
   console.log(data);

}

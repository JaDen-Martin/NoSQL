const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const uri = "mongodb+srv://Admin:nyjd-2023@nyjd.xa26v9a.mongodb.net/?retryWrites=true&w=majority";
const ROWSPERPAGE = 500; // A global constant that stores the amount of documents to serve
const INITIALSORTFIELD = 'name'; //String to hold the sort criteria for initial queries
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

  const data = await allData(); 
  res.json(data);
});

app.get('/allData/:field/:pageNumber/:order/:gender', async (req, res) =>  { 
  const { field, pageNumber, order, gender } = req.params;

    const data = await allDataNum(field, pageNumber, order, gender); 
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

// Function call to import all data from the database
async function allData() {


  const data = await myColl.find().sort({[INITIALSORTFIELD]: 1, _id: 1}).limit(ROWSPERPAGE).toArray(); 
  return data;
}

async function allDataNum(field, page, order, gender) {
  let data;
  const skip = +page * ROWSPERPAGE;
  let sortInt;
  let sortQuery = {};
  let findQuery = {};
  if (field == "name") { //Here name is the only string type 
  
    if (order == 'desc') {
        sortInt = 1;
    } else {
      sortInt = -1;
      }
    } else { // Here field is of type int 
      if (order == 'desc') {
      sortInt = -1;
    } else {
      sortInt = 1;
      }
    }

      sortQuery[field] = sortInt;
      sortQuery['_id'] = 1;
      if (gender == 'm'){
        findQuery['gender'] = 'Male';
      } else if (gender == 'f') {
        findQuery['gender'] = 'Female';
      }

      data = await myColl.find(findQuery).sort(sortQuery).limit(ROWSPERPAGE).skip(skip).toArray();
      return data;
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

async function listByName (name) { // To do: return all docs with the given name - order chronologically? For use in a line graph 


}

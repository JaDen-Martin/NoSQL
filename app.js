const express = require("express");

const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const uri = "mongodb+srv://Admin:nyjd-2023@nyjd.xa26v9a.mongodb.net/?retryWrites=true&w=majority";


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

function allUsers() {

  let sortedData = [];

    fs.readFile(path, 'utf8', (error, data) => {
        if(error){
           console.log(error);
           return;
        }

       const json = (JSON.parse(data));

       let i = 0;

       // Algorithm

       writeToFile(writePath, JSON.stringify(sortedData));

     });
}
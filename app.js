const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion } = require('mongodb');
const { getByGrowthRate, getByNames, topTen } = require('./Functions/function.js')
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

app.get('/names/:searchTerm', async (req, res) =>  { 
  const { searchTerm } = req.params;
  const names = await getByNames(searchTerm, myColl); 
  // Needs a route
  // await allDataJoined(searchTerm);
  res.json(names);
 
});

app.get('/name/:name', async (req, res) =>  { 
  const { name } = req.params;
  const names = await getSingleName(name); 
  // const ranks = await getByRank(name, 10);
  res.json(names);
 
});

// Gets names for a certain rank and above
app.get('/name/:name/:rank', async (req, res) => {
  const { name, rank } = req.params;
  const names = await getByRank(name, rank);

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

// Function call to import all data from the database
async function allData() {


  const data = await myColl.find().sort({[INITIALSORTFIELD]: 1, _id: 1}).limit(ROWSPERPAGE).toArray(); 
  return data;
}

// Aggregates all names within a certain year, regardless of race
async function allDataJoined(name) {

   const pipeline = [
   {
      '$match': {
        'name': {
          '$regex': new RegExp(`^${name}`, 'i')
        }
      }
    },  
   {
    '$bucket': {
        'groupBy': '$year',
        'boundaries': [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
        'default': 2019,
        'output': {
           "Total" : { '$count': {} },
           "TotalNumber": { '$sum': '$number'},
           "Name": { '$push': '$name'},
           "Rank": {'$avg': {'$sum': '$rank'} }

          }      
      }      
   } 
]
  const data = await myColl.aggregate(pipeline).toArray();

  console.log(data);
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
      
  
      if (field == 'rank') { // if we are sorting based on rank sort it secondly by number in the opposite order so if Rank 1 is first the highest number of all ranks is listed first
        sortQuery['number'] = -sortInt;
      } 
        sortQuery['_id'] = 1;
      

      if (gender == 'm'){
        findQuery['gender'] = 'Male';
      } else if (gender == 'f') {
        findQuery['gender'] = 'Female';
      }

      data = await myColl.find(findQuery).sort(sortQuery).limit(ROWSPERPAGE).skip(skip).toArray();
      return data;
}

async function getByRank(name, rank) {

  const findQuery = {name, 'rank': {$lte: rank}};
  const options = { 
    sort: {'rank': 1},
  };

  const data = await myColl.find(findQuery, options).toArray();

  console.log(data);
  return data;

}


async function getSingleName( name ) {
  const findQuery = {name}
  // console.log(findQuery)
  const data = await myColl.find(findQuery).sort({"year": 1}).toArray();
 // console.log(data);
  return data;
}

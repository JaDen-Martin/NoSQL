// function.js
// 
// Database queries, functions, and pipelines that are exported
// to app.js

// Database Connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Admin:nyjd-2023@nyjd.xa26v9a.mongodb.net/?retryWrites=true&w=majority";

// global variables
const ROWSPERPAGE = 500; // A global constant that stores the amount of documents to serve
const INITIALSORTFIELD = 'name'; //String to hold the sort criteria for initial queries

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

// JSON Collection
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

// Get all Data from database
async function allData() {

  const data = await myColl.find().sort({[INITIALSORTFIELD]: 1, _id: 1}).limit(ROWSPERPAGE).toArray(); 
  return data;
}

// Get all data for one specific name in a year
async function allDataJoined() {
   
  const pipeline = [
     {
      '$group': {'_id': '$name', 
                  'nameYear': {'$addToSet':
                    {'$concat': ['$name', "-", {'$toString':'$year'  }, "-", {'$toString':'$number'}] } },// Filters out each unique name + year
      }
    },
    {
      '$unwind': '$nameYear'
    },
    {
        '$addFields': { 
            'year': { '$toInt': {'$arrayElemAt': [ { "$split": [ "$nameYear", "-"] }, 1 ]} },
            'number': { '$toInt': {'$arrayElemAt': [ { "$split": [ "$nameYear", "-"] }, 2 ]} },
        }
    },
  {
    '$sort':{'_id': 1}
  }
]
  const data = await myColl.aggregate(pipeline).toArray();

  console.log(data);
  return data;
}

// Get all data within a certain range
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

// Data sorted by rank
async function getByRank(name, rank) {

  const findQuery = {name, 'rank': {$lte: rank}};
  const options = { 
    sort: {'rank': 1},
  };

  const data = await myColl.find(findQuery, options).toArray();

  console.log(data);
  return data;

}

// Search for names that start with the term
async function getByNames (term) { 

  const pipeline = [ 
    {
      '$match': {
        'name': {
          '$regex': new RegExp(`^${term}`, 'i')
        }
      }
    }, 
    {
      '$group': {
        '_id': '$name'
      } 
    },{
      '$sort': { '_id': 1 }

    }
    , {
      '$limit': 5
    }
  ]

  const names = await myColl.aggregate(pipeline).toArray();

  return names;

}

// Get top ten names for a specific gender
async function topTen(gender) {

  const findQuery = {gender, 'rank': {$lte: 10}};
  const options = { 
    sort: {'number': 'desc'},
  };

  const data = await myColl.find(findQuery, options).toArray();

  console.log(data);
  return data;
}

// Query data for a single name
async function getSingleName( name ) {
  const findQuery = {name}
  // console.log(findQuery)
  const data = await myColl.find(findQuery).sort({"year": 1}).toArray();
 // console.log(data);
  return data;
}

// Create a growth rate overtime parameter and sort
async function getByGrowthRate(coll) {
    const pipeline = 
    [
        {
          '$group': {
            '_id': {
              'name': '$name', 
              'year': '$year'
            }, 
            'total': {
              '$sum': '$number'
            }
          }
        }, {
          '$sort': {
            '_id.year': 1
          }
        }, {
          '$group': {
            '_id': '$_id.name', 
            'yearsCombined': {
              '$push': {
                'year': '$_id.year', 
                'number': '$total'
              }
            }
          }
        }, {
          '$addFields': {
            'growthRate': {
              '$multiply': [
                {
                  '$divide': [
                    {
                      '$subtract': [
                        {
                          '$arrayElemAt': [
                            '$yearsCombined.number', -1
                          ]
                        }, {
                          '$arrayElemAt': [
                            '$yearsCombined.number', 0
                          ]
                        }
                      ]
                    }, {
                      '$arrayElemAt': [
                        '$yearsCombined.number', 0
                      ]
                    }
                  ]
                }, 100
              ]
            }
          }
        }, {
          '$sort': {
            'growthRate': -1
          }
        }, {
          '$limit': 10
        }
      ];

      const data = await coll.aggregate(pipeline).toArray();
      return data;
}

// Export functions to app.js
module.exports = {
    getByGrowthRate, allData, allDataJoined, allDataNum, getSingleName, getByNames, getByRank, topTen
}
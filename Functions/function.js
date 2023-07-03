const ROWSPERPAGE = 500; // A global constant that stores the amount of documents to serve
const INITIALSORTFIELD = 'name'; //String to hold the sort criteria for initial queries
 
// Function call to import all data from the database
async function allData(coll) {


  const data = await coll.find().sort({[INITIALSORTFIELD]: 1, _id: 1}).limit(ROWSPERPAGE).toArray(); 
  return data;
}

 async function getByGrowthRate(coll, low=false) {
let sortInt = -1;
  if (low) {
    sortInt = 1;
  }

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
            'growthRate': sortInt
          }
        }, {
          '$limit': 10
        }
      ];

      const data = await coll.aggregate(pipeline).toArray();
      return data;
}

// Do a search for names that start with the term
async function getByNames (term, coll) { 

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

  const names = await coll.aggregate(pipeline).toArray();

  return names;

}

async function topTen(gender, coll) {

  const pipeline = [
    {
      '$match': {
        'gender': gender
      }
    }, {
      '$group': {
        '_id': {
          'name': '$name', 
          'year': '$year'
        }, 
        'number': {
          '$sum': '$number'
        }
      }
    },{
      '$sort': {
        '_id.year': 1
      }
    }, {
      '$group': {
        '_id': '$_id.name', 
        'yearsCombined': {
          '$push': {
            'year': '$_id.year', 
            'number': '$number'
          }
        }
      }
    }, {
      '$addFields': {
        'averageNumber': {
          '$avg': '$yearsCombined.number'
        }
      }
    }, {
      '$sort': {
        'averageNumber': -1
      }
    },
    {
      '$limit': 10
    }
  ]

  const data = await coll.aggregate(pipeline).toArray();
  
  return data;
}

async function getByRank(name, rank, coll) {

  const findQuery = {name, 'rank': {$lte: rank}};
  const options = { 
    sort: {'rank': 1},
  };

  const data = await coll.find(findQuery, options).toArray();

  console.log(data);
  return data;

}


async function getSingleName( name, coll ) {
  const findQuery = {name}
  // console.log(findQuery)
  const data = await coll.find(findQuery).sort({"year": 1}).toArray();
 // console.log(data);
  return data;
}


// Aggregates all names within a certain year, regardless of race
async function allDataJoined(name, coll) {

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
 const data = await coll.aggregate(pipeline).toArray();

 console.log(data);
}

async function allDataNum(field, page, order, gender, coll) {
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

      data = await coll.find(findQuery).sort(sortQuery).limit(ROWSPERPAGE).skip(skip).toArray();
      return data;
}

module.exports = {
    getByGrowthRate, allData, allDataNum, getSingleName, getByNames, getByRank, topTen
}
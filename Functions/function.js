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

module.exports = {
    getByGrowthRate,
    getByNames,
    topTen
    
}
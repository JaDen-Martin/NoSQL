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

module.exports = {
    getByGrowthRate
}
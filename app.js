// app.js
//
// Routes that connect to frontend and call
// queries to request data

const express = require("express");
const cors = require("cors");

const { allData, getByGrowthRate, allDataJoined, allDataNum, getByNames, getByRank, getSingleName, topTen } = require('./Functions/function.js');
const app = express();

app.use(cors());
app.listen(3000, () => console.log("Server is running"));

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
  const names = await getByNames(searchTerm); 

  res.json(names);
 
});

app.get('/name/:name', async (req, res) =>  { 
  const { name } = req.params;
  const names = await getSingleName(name); 
  const ranks = await getByRank(name, 10);
  
  res.json(names);
 
});

// Gets names for a certain rank and above
app.get('/name/:name/:rank', async (req, res) => {
  const { name, rank } = req.params;
  const names = await getByRank(name, rank);

  res.json(names);
});

app.get('/topTenMaleNames', async (req, res) => {
  const data = await getTen('Male');

  res.json(data);

});

app.get('/topTenFemaleNames', async (req, res) => {
  const data = await getTen('Female');

   res.json(data);
});

app.get('/topTenGrowthRate', async (req, res) => {
  const data = await getByGrowthRate(myColl);
  res.json(data);
});
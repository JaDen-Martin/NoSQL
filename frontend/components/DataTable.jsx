import {useState} from 'react';
import {Table, TableRow, TableBody, TableCell, TableContainer, TableHead, Paper } from '@mui/material'
import './table.css'




   function createData(number, item, qty, price) {
    return { number, item, qty, price };
   }
    
   function getAllData() {


   }
   const rows = [
    createData(1, "Apple", 5, 3),
    createData(2, "Orange", 2, 2),
    createData(3, "Grapes", 3, 1),
    createData(4, "Tomato", 2, 1.6),
    createData(5, "Mango", 1.5, 4)
   ];

function DataTable() {
  return (
    <>
    <h1>Test</h1>
    <TableContainer component={Paper} className='data-table'>
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell align="right">Year</TableCell>
          <TableCell align="right">Gender</TableCell>
          <TableCell align="right">Ethnicity</TableCell>
          <TableCell align="right">Number</TableCell>
          <TableCell align="right">Rank</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.number}>
            <TableCell component="th" scope="row">
              {row.number}
            </TableCell>
            <TableCell align="right">{row.item}</TableCell>
            <TableCell align="right">{row.qty}</TableCell>
            <TableCell align="right">{row.price}</TableCell>
            <TableCell align="right">{row.price}</TableCell>
            <TableCell align="right">{row.price}</TableCell>
          </TableRow>
        ))}
        <TableRow >
          <TableCell align="right" colSpan={5}>
            <b>Total Cost:</b> 100
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
  </>
  )
}

export default DataTable
import {useState, useEffect} from 'react';
import {Table, TableRow, TableBody, TableCell, TableContainer, TableHead, Paper, TableFooter, TablePagination, Select } from '@mui/material'
import './table.css'




   function createData(number, item, qty, price) {
    return { number, item, qty, price };
   }
    
  
function DataTable() {
  // const [data, setData] = useState([]);
  const [rows, setRows ] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    fetch("http://localhost:3000/allData").then(res => res.json()).then(json=> 
    setRows(json.slice(0, 35)));
  }, [rows])

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);

  }

  const handleNextPage = () => {
    // determine if we are on the last page
    if (rowsPerPage * (page + 1) >= rows.length) {
      return;

    }
    setPage(page => page + 1);

  }

  const handlePrevPage = () => {
    if (page <= 0) {
      return;
    } 

    setPage(page => page - 1);
    
  }

  const currentRow = page * rowsPerPage + 1;

  return (
    <>
    <h1>Test</h1>
    <TableContainer component={Paper} className='data-table'>
    <Table aria-label="simple table" stickyHeader>
      <TableHead className='table-header'>
        <TableRow >
          <TableCell>Name</TableCell>
          <TableCell align="right">Year</TableCell>
          <TableCell align="right">Gender</TableCell>
          <TableCell align="right">Ethnicity</TableCell>
          <TableCell align="right">Number</TableCell>
          <TableCell align="right">Rank</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.length > 1 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <TableRow key={row._id}>
            <TableCell component="th" scope="row" className="table-name">
              {row.name}
            </TableCell>
            <TableCell align="right" >{row.year}</TableCell>
            <TableCell align="right">{row.gender}</TableCell>
            <TableCell align="right">{row.ethnicity}</TableCell>
            <TableCell align="right">{row.number}</TableCell>
            <TableCell align="right">{row.rank}</TableCell>
          </TableRow>
        )) :
      
          <TableCell align="center" >Loading Data...</TableCell>

        
      }       
      </TableBody>
    </Table>
    <div className='table-footer'>
      <label htmlFor="rowsPerPage">Rows Per Page</label>
        <select htmlFor="rowsPerPage" defaultValue={"20"} onChange={handleChangeRowsPerPage}>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>

        </select>
        <div>
        <span>
          {currentRow} - {currentRow + rowsPerPage < rows.length ? currentRow + rowsPerPage : rows.length}
        </span>
        <span className='totalNo'> of {rows.length} </span>
        </div>
        <span className="table-arrows">
        <span onClick={handlePrevPage}>&lt;</span>
        <span onClick={handleNextPage}>&gt;</span>
        </span>
        
        
        </div>
  </TableContainer>
  
  </>
  )
}

export default DataTable
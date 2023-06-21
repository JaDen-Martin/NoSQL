import {useState, useEffect} from 'react';
import {Table, TableRow, TableBody, TableCell, TableContainer, TableHead, Paper, TableFooter, TablePagination, Divider } from '@mui/material'
import './table.css'

function sortData( { field, order }, data, setData) {

console.log("sorting data by " + field + ' ' + order)
const dataCopy = [...data]; //copy data to not mutate state directly
console.log(dataCopy[0][field])

if (field == 'name' ) { //Here we only care if field is name because it is the only string type 
  console.log("we are sorting by name");
  if (order == 'desc') {
    console.log("name desc")
    dataCopy.sort( (a, b) => a[field] - b[field]);
  } else { 
    console.log("name asc")
      dataCopy.sort( (a, b) => b[field] - a[field] );
    } 
  } else { // the rest of the fields store numbers and we can sort numerically
    if (order == 'desc') {
      dataCopy.sort( (a, b) => b[field] - a[field] );
    } else { 
        dataCopy.sort( (a, b) => a[field] - b[field]);
    } 

  } 

  setData(dataCopy);
}





function DataTable() {
  // const [data, setData] = useState([]);
  const [rows, setRows ] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState(rows.length >= 0 ? {field: "none", order: "desc" } : {field: "name", order: "desc" });

  useEffect(() => {
    if (rows.length > 0) return; //if we already have data do not send a request
    fetch("http://localhost:3000/allData").then(res => res.json()).then(json=> 
    setRows(json.slice(0, 75)));
  }, [])

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);

  }

  const handleNextPage = () => {
    // determine if we are on the last page
    if (rowsPerPage * (page + 1) >= rows.length) return;

    setPage(page => page + 1);
  }

  const handlePrevPage = () => {
    if (page <= 0) return;
 
    setPage(page => page - 1);
  }

  const currentRow = page * rowsPerPage + 1;

  const handleChangeSort = (e, field) => {
    if (rows.length <= 0 ) {
      return;
    }
    e.stopPropagation();
    let newOrder;
   
    if (field == sortBy.field) { // if we are already sorting by that field change it from asc to desc 
      newOrder = sortBy.order === 'asc' ? 'desc' : 'asc'; 
    } else {
      newOrder = 'desc'; // else default to desc  
    }
    
    const newState = { field, 'order': newOrder };
    setSortBy( newState );

    sortData( newState, rows, setRows)

  }

  return (
    <>
    <h1>Test</h1>
    <TableContainer component={Paper} className='data-table'>
    <Table aria-label="simple table" stickyHeader>
      <TableHead className='table-header'>
        <TableRow >
          <TableCell className = 'show-curs' onClick={ e => handleChangeSort(e, 'name') } > 
         
          { sortBy.field !== 'name' 
            ? '' 
            : sortBy.order == "desc" 
            ? <div className = 'sort-arrow'> &darr; </div> 
            : <div className = 'sort-arrow'>&uarr;</div> 
            }
            Name
          </TableCell>
          <TableCell align="right" className='show-curs' onClick={ e => handleChangeSort(e, 'year') }>
          { sortBy.field !== 'year' 
            ? '' 
            : sortBy.order == "desc" 
            ? <div className = 'sort-arrow'> &darr; </div> 
            : <div className = 'sort-arrow'>&uarr;</div> 
            }
            Year</TableCell>
          <TableCell align="right">Gender</TableCell>
          <TableCell align="right">Ethnicity</TableCell>
          <TableCell align="right" className='show-curs' onClick={ e => handleChangeSort(e, 'number') }>
          { sortBy.field !== 'number' 
            ? '' 
            : sortBy.order == "desc" 
            ? <div className = 'sort-arrow'> &darr; </div> 
            : <div className = 'sort-arrow'>&uarr;</div> 
            }
            Number</TableCell>
          <TableCell align="right" className='show-curs' onClick={ e => handleChangeSort(e, 'rank') }>
          { sortBy.field !== 'rank' 
            ? '' 
            : sortBy.order == "desc" 
            ? <div className = 'sort-arrow'> &darr; </div> 
            : <div className = 'sort-arrow'>&uarr;</div> 
            }
            Rank</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.length > 1 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row) => (
          <TableRow key={row._id}>
            <TableCell component="th" scope="row" className="table-name" align="center">
              {row.name}
            </TableCell>
            <TableCell align="right" >{row.year}</TableCell>
            <TableCell align="right">{row.gender}</TableCell>
            <TableCell align="right">{row.ethnicity}</TableCell>
            <TableCell align="right">{row.number}</TableCell>
            <TableCell align="right">{row.rank}</TableCell>
          </TableRow>
        )) :
      
          <TableCell align="center" style={{ height: "1000px" }}>Loading Data...</TableCell>

        
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
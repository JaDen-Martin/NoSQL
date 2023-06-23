import {useState, useEffect} from 'react';
import {Table, TableRow, TableBody, TableCell, TableContainer, TableHead, Paper, TableFooter, TablePagination, Divider } from '@mui/material'
import './table.css'
import GenderSelector from './GenderSelector';

function DataTable() {
  // const [data, setData] = useState([]);
  const [rows, setRows ] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState(rows?.length >= 0 ? {field: "none", order: "desc", gender: "a" } : {field: "name", order: "desc", gender: "a" });

  const [serverPageNumber, setServerPageNumber] = useState(0);
  // const [isLastServerPage, setIsLastServerPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (rows.length > 0) return; //if we already have data do not send a request
    setIsLoading(true);
    fetch(`http://localhost:3000/allData/`).then(res => {
      setIsLoading(false);
      return res.json();

    }).then(json=> 
    setRows(json));
    setSortBy({field: "name", order: "desc", gender: "a"});
  }, []);


  useEffect(() => { //run this effect whenever the gender filter changes 
    if (rows.length <= 0) return //if we dont have data (first render do not fire this request)
    console.log("sending request to for new data " + sortBy.gender)
    fetchDataAndResetPage(`http://localhost:3000/allData/${sortBy.field}/0/${sortBy.order}/${sortBy.gender}`);
    
  }, [sortBy.gender])
  

  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);

  }

  const handleNextPage = () => {
    if (isLoading || !rows?.length) return;
    if (rowsPerPage * (page + 1) >= rows.length) {  // determine if we are on the last page
      
        const newServerPage = serverPageNumber + 1;
        
        fetch(`http://localhost:3000/allData/${sortBy.field}/${newServerPage}/${sortBy.order}/${sortBy.gender}`).then(res => {
        setIsLoading(true);
        if (res.ok){
          setIsLoading(false);
          return res.json();
        }
        return null;
      }).catch(err => {
          if (err){
            console.log("unable to load paginated data " + err);
            return;
          }

        }).then(json=>  
        {
          if (!json) return;

          setRows(prev => [...prev, ...json]);
          setServerPageNumber(newServerPage);
        
        }).catch(err => console.log(err));
      
    }
    setPage(page => page + 1);
  }

  const handlePrevPage = () => {
    if (isLoading) return;
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
    
    const newState = { field, 'order': newOrder, "gender": sortBy.gender };
    setSortBy( newState );
    setIsLoading(true);
    fetchDataAndResetPage(`http://localhost:3000/allData/${field}/0/${newOrder}/${sortBy.gender}`);
    // sortData( newState, rows, setRows)  no longer need to call sort data, the data should come back sorted from the server 

  }

  function fetchDataAndResetPage(url){
    fetch(url).
    then(res => {
      if (res.ok) {
        return res.json();
      }
    }).then(json => {
      setServerPageNumber(0); 
      setPage(0);
      setRows(json)
      setIsLoading(false);
    }).catch(err => console.log(err));
  }

  return (
    <>
     <h1>N<span>Y</span>J<span>D</span></h1>
     <GenderSelector gender={sortBy.gender} setSortBy={setSortBy} />
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
        {!isLoading ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
        <TableRow className='no-data' >
          <TableCell align="center"  style={{ height: "1000px" }} colSpan={6}>Loading Data...</TableCell>
        </ TableRow>

        
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


// function sortData( { field, order }, data, setData) {

//   console.log("sorting data by " + field + ' ' + order)
//   const dataCopy = [...data]; //copy data to not mutate state directly
//   console.log(dataCopy[0][field])
  
//   if (field == 'name' ) { //Here we only care if field is name because it is the only string type 
//     console.log("we are sorting by name");
//     if (order == 'desc') {
//       console.log("name desc")
//       dataCopy.sort( (a, b) => a[field].localeCompare(b[field]));
//     } else { 
//       console.log("name asc")
//       dataCopy.sort( (a, b) => b[field].localeCompare(a[field]));
//       } 
//     } else { // the rest of the fields store numbers and we can sort numerically
//       if (order == 'desc') {
//         dataCopy.sort( (a, b) => b[field] - a[field] );
//       } else { 
//           dataCopy.sort( (a, b) => a[field] - b[field]);
//       } 
  
//     } 
  
//     setData(dataCopy);
//   }

export default DataTable
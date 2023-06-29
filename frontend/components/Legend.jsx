import { Select, FormControl, InputLabel, MenuItem } from '@mui/material'
import React from 'react'

function Legend( {colors, allColor='#32CD32', chartCriteria='ethnicity', handleChange } ) {
    const size = '20px';

  return (
   
    <div className='legend'>
         <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
         <InputLabel id="select-label">Showing by...</InputLabel>
        <Select 
        id="select"
        onChange={handleChange}
        value={chartCriteria} 
        label="chart criteria"
        > 
        <MenuItem value='ethnicity' >ethnicity</MenuItem>
        <MenuItem value='all' >all</MenuItem>
        </ Select>
        </FormControl>
        <div className='items-cont'>
        {
           chartCriteria == 'ethnicity' ? colors.map( color => {
                return (
                    <div key={color.color} className='legend-item'>
                        <span style={{backgroundColor: color.color, height: size, width: size}}>
                        </span>
                        <span>{color.ethnicity}</span>
                    </div>
                )
            }) :
            <div className='legend-item'>
            <span style={{backgroundColor: allColor, height: size, width: size}}>
            </span>
            <span>All</span>
        </div>

        }
        </div>
    </div>
  )
}

export default Legend
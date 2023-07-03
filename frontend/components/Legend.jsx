import { Select, FormControl, InputLabel, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'


function Legend( { options, values, chartCriteria='', handleChange } ) 
{ 
  const size = '20px';
  
  return ( 
    <div className='legend'>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="select-label">Showing by...</InputLabel>
        <Select 
        id="select"
        onChange={handleChange}
        value={options.length ? chartCriteria : ''} 
        label="chartCriteria"
          > 
        {
          options?.map( option => 
            <MenuItem value={option.field} key={option.field}>{option.text}</MenuItem>
          )
        }

        </ Select>
        </FormControl>
        <div className='items-cont'>
        {
          values.map( val => {
                return (
                    <div key={val.color} className='legend-item'>
                        <span style={{backgroundColor: val.color, height: size, width: size}}>
                        </span>
                        <span>{val.text}</span>
                        {val?.info && <span>{val.info}</span>}
                    </div>
                )
            }) 

        }
        </div>
      
    </div>
  )
}

export default Legend
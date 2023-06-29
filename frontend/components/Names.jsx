import React from 'react'
import { useParams } from 'react-router-dom'
import NameChart from './NameChart';
import SearchBar from './SearchBar';

function Names() {
  const { name } = useParams();


  return (
    <div>
    <h2 className='name-title'>{name}</h2>
    <SearchBar /> 
     <NameChart name={name}/> 
    
    </div>
  )
}

export default Names
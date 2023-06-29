import React from 'react'
import { useParams } from 'react-router-dom'
import NameChart from './NameChart';

function Names() {
  const { name } = useParams();

  return (
    <div>
    <h2 className='name-title'>{name}</h2>
    <NameChart />
    </div>
  )
}

export default Names
import React from 'react'
import { useParams } from 'react-router-dom'
import NameChart from './NameChart';

function Names() {
  const { name } = useParams();

  return (
    <>
    <div>Names</div>
    <div>{name}</div>
    <NameChart />
    </>
  )
}

export default Names
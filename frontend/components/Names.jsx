import React from 'react'
import { useParams } from 'react-router-dom'

function Names() {
  const { name } = useParams();

  return (
    <>
    <div>Names</div>
    <div>{name}</div>
    </>
  )
}

export default Names
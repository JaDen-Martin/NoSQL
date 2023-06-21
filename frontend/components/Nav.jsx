import React from 'react'
import { NavLink } from "react-router-dom";
import './styles.css'

function Nav() {
  return (
    <div className='nav'>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/'>Tab 2</NavLink>
        <NavLink to='/'>Tab 3</NavLink>
        <NavLink to='/about'>About</NavLink>
    </div>
  )
}

export default Nav
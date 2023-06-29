import React from 'react'
import { NavLink } from "react-router-dom";

function Nav() {
  return (
    <div className='nav'>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/name/search'>LineChart</NavLink>
        <NavLink to='/'>Tab 3</NavLink>
        <NavLink to='/about'>About</NavLink>
    </div>
  )
}

export default Nav
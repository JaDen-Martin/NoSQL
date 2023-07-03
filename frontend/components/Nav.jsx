import React from 'react'
import { NavLink } from "react-router-dom";
import logo from '../assets/PoliceTag.png'

function Nav() {
  return (
    <div className='nav'>
        <NavLink to='/'><img className='home-icon' src={logo} alt='logo'></img></NavLink>
        <NavLink to='/name/search'>LineChart</NavLink>
        <NavLink to='/scatter'>ScatterPlot</NavLink>
        <NavLink to='/about'>About</NavLink>
    </div>
  )
}

export default Nav
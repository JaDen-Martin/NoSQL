import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from '../components/Nav'
import DataTable from '../components/DataTable'
import Names from '../components/Names'

import About from '../components/About'
import './App.css'
import ScatterPlot from '../components/ScatterPlot'


function App() {

  return (
 
      <>
      <BrowserRouter>
       <Nav />     
       <Routes>
          <Route path='/' element={<DataTable />} />
          <Route path='/name/:name' element={ <Names / > } />
          <Route path='/about' element={ <About / > } />
          <Route path='/scatter' element={ <ScatterPlot / > } />
          <Route path='/*' element={<DataTable />} /> 
       </ Routes>
       </BrowserRouter>
       </>
  )
}

export default App

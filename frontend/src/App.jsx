import { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import DataTable from '../components/DataTable'
import { createBrowserRouter,BrowserRouter, Routes, Route } from 'react-router-dom'
import About from '../components/About'
import './App.css'


function App() {

  return (
 
      <>
      <BrowserRouter>
       <Nav />     
       <Routes>
          <Route path='/' element={<DataTable />} />
          <Route path='/about' element={ <About / > } />

          <Route path='/*' element={<DataTable />} /> 
       </ Routes>
       </BrowserRouter>
       </>
  )
}

export default App

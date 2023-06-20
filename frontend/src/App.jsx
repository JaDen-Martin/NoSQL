import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  useEffect(() => {
    fetch("/localhost::3000/").then(res => res.json()).then(data => console.log(data));
  }, [])
  

  return (
 
     
       <div>NYJD</div>
  )
}

export default App

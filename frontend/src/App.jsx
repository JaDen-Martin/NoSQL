import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import DataTable from '../components/DataTable'
import './App.css'


function App() {
  const [data, setData] = useState('');
  useEffect(() => {
    fetch("http://localhost:3000/").then(res => res.text()).then(text => setData(text));
  }, [])
  

  return (
 
      <>
       <div>NYJD</div>
       <div>{data}</div>
       < DataTable/>
       </>
  )
}

export default App

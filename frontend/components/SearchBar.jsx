import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [timer, setTimer] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([])
    const navigate = useNavigate();

    const inputChanged = e => {
        const input = e.target.value;

       if (input.length <= 0){
        setResults([]);
        setShowResults(false);
        return;
       }
      
        clearTimeout(timer);

        const newTimer = setTimeout(()=> {
            
           fetch(`http://localhost:3000/names/${input}`).then(res => {
            if (res.ok){
                return res.json();
            }
           }).then(data => {
            console.log(data.length)
                if (data.length > 0){
                    setResults(data);
                    setShowResults(true);
                    
                } else {
                    console.log('not found any')
                    setResults([{_id: '0 Found'}])
                }
            })

        }, 500);
        setTimer(newTimer);
    }

    const handleNavigate = (name) => {
        if (name.startsWith('0')){
            return;
        }
     
        navigate(`/name/${name}`);
    }

    const handleBlur = () => {
        setShowResults(false);
    }

    const handleFocus = () => {
        setShowResults(true)
    }

   
  return (
    <div className='search-cont'>
       <input type='search' spellCheck="false" onChange={inputChanged} placeholder='SEARCH NAME' onFocus={handleFocus} onBlur={handleBlur}></input>
       {showResults && results.length > 0 &&
       <ul className='search-res'>
            {
                results.map(res => <li key={res._id} onClick={(e) => handleNavigate(res._id)}>{res._id}</li>)
            }
        </ul>
       }
     
    </div>
  )
}

export default SearchBar
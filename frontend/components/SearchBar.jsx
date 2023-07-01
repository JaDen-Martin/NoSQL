import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useComponentVisible from './useComponentVisible';

function SearchBar() {
    const [timer, setTimer] = useState(null);
    const [results, setResults] = useState([])
    const navigate = useNavigate();
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(true);

    const inputChanged = e => {
        const input = e.target.value;

       if (input.length <= 0){
        setResults([]);
        setIsComponentVisible(false);
        return;
       }
      
        clearTimeout(timer);

        const newTimer = setTimeout(()=> {
            
           fetch(`http://localhost:3000/names/${input}`).then(res => {
            if (res.ok){
                return res.json();
            }
           }).then(data => {
                if (data.length > 0){
                    setResults(data);
                    setIsComponentVisible(true);
                } else {
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
        setIsComponentVisible(false);
        navigate(`/name/${name}`);
    }


    const handleClick = () => {
       setIsComponentVisible(true);
    }

   
  return (
    <div className='search-cont'>
       <input type='search' spellCheck="false" onChange={inputChanged} placeholder='SEARCH NAME' onClick={handleClick}></input>
       {isComponentVisible && results.length > 0 &&
       <ul className='search-res' ref={ref} >  
        { 
        results.map(res => <li key={res._id} onClick={(e) => handleNavigate(res._id)}>{res._id}</li>)
        }
        </ul>
       }
     
    </div>
  )
}

export default SearchBar
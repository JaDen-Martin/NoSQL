import React, { useState } from 'react'

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [timer, setTimer] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const inputChanged = e => {
        setSearchTerm(e.target.value);

    }

    const handleBlur = () => {
        setShowResults(false)
    }

    const handleFocus = () => {
        setShowResults(true)
    }

  return (
    <div className='search-cont'>
       <input type='search' onChange={inputChanged} placeholder='SEARCH NAME' onFocus={handleFocus} onBlur={handleBlur}></input>
    </div>
  )
}

export default SearchBar
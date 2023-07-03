import React from 'react'

function GenderSelector({gender="a", setSortBy}) {

    const handleSetGender = (e, letter) => {
       
        if (!setSortBy || letter == gender) return;
          
        console.log("changing gender search criteria")
        setSortBy(prev =>  ({ "field": prev.field, "order": prev.order, "gender": letter} ));
        };
      
        const selectedStyle = { color: "#535bf2", textDecoration: "underline" };
        const unSelectedStyle = { color: "rgba(255, 255, 255, 0.87)", textDecoration: "none" }; 

  return (
    <div className='gender-selector'>
        <div 
        style={ gender == 'a' ? selectedStyle : unSelectedStyle }
        onClick={e => handleSetGender(e, 'a')
        }
        >
            All
        </div>
        <div className='mOrF'>
        <div  style={ gender == 'm' ? selectedStyle : unSelectedStyle }
          onClick={e => handleSetGender(e, 'm')}
        >Male</div>

        <div  style={ gender == 'f' ? selectedStyle : unSelectedStyle }
          onClick={e => handleSetGender(e, 'f')}
        >Female</div>
        </div>
    </div>
  )
}

export default GenderSelector
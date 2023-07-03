import React, { useEffect, useState } from 'react'

function LineChartDescription({criteria='', name}) {
    const [text, setText] = useState('')

    useEffect(()=> {

        if (criteria == 'ethnicity' || criteria == 'all') {
            setText(`This chart shows information about the popularity of the name ${name} over time. Each line is broken down by ethnicity if multiple are provided. Some names only have data available of some of the ethnicties included in the data set overall. You may select "Showing by all" to combine the lines into one line.`)
        } else if (criteria == 'topGrowthRate' || criteria == 'botGrowthRate'){
            setText(`This chart displays the ${criteria.startsWith('top') ? 'top' : 'bottom'} 10 names in order of growth rate. Growth rate was calculated by taking the number of babies receiving that name in the lastest year minus the number in the earliest year, divded by the first year, and multiplied by 100 to get a percent (ethnicity was not taken into account, all ethnicites were combined). Disclaimer: some growrh rates may be misleading due to incomplete data.`)
        } else if (criteria == 'topMale' || 'topFemale'){
            setText(`This chart displays the highest 10 averages for for all ${criteria.includes('Male') ? 'male' : 'female'} names. To find the average a total of all occurances of the name was divided by the number of years provided.`)
        }

    }, [criteria])



  return (
    <div className='chart-desc'>
        <p>{text}</p>
    </div>
  )
}

export default LineChartDescription
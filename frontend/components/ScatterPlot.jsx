import React, {useState, useEffect, useRef, useLayoutEffect} from 'react'
import * as d3 from 'd3'
import '../chartStyles/scatter.css'

const width = '95%';
const height = 2000;
const margin = { top: 30, right: 20, bottom: 20, left: 20 };
const HIGHESTNUMBER = 426; //This is the highest number of any data point in the set. 

function setUpChart(ref) {
    const svg = d3.select(ref.current).attr('width', width).attr('height', height)
    .style('background' , '#f9f9f9').style('margin-top', margin.top).style('overflow', 'visible');

    const chartWidth = +ref.current.clientWidth;
    console.log(chartWidth /2)
    svg.append('text').attr("class", "axis-label").attr('text-anchor', 'middle').attr('x', chartWidth / 2
    ).attr('y', -10).attr('stroke', 'rgba(255, 255, 255)').attr('font-weight', height/4).attr("letter-spacing", 2).text('Year');

    svg.append('text').attr("class", "axis-label").attr('text-anchor', 'end').attr('x', -200).attr('y', -7).attr('stroke', 'rgba(255, 255, 255)').attr("letter-spacing", 2).attr("transform", "rotate(-90)").attr('font-weight', 100).text('Number');
  }

  function paintAxis() {
    
  }

function ScatterPlot() {
    // const [screenWidth, setScreenWidth] = useState();

    const scatterRef = useRef();

    useEffect(()=> {
        
        if (scatterRef.current){
            setUpChart(scatterRef)
        }
     
    }, [scatterRef])

  return (
    <div className='scatter-cont'>
        <svg ref={scatterRef} width={width} height={height}>
        </svg>

    </div>
  )
}

export default ScatterPlot
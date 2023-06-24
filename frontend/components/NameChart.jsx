import React, {useState, useEffect, useRef} from 'react'
import { data } from '../assets/testData'
import * as d3 from 'd3'

const years = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018 , 2019];
const testData = data;
const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

function NameChart() {
    const [data, setData ] = useState([]);
    const svgRef = useRef();


    useEffect( ()=> {
        //setting up svg
        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)
        .style('background' , '#f9f9f9').style('margin-top', margin.top).style('overflow', 'visible')

        //setting the scale

        //setting

    }, [data])

  return (
    <div>
        <svg ref={svgRef} ></svg>
    </div>
  )
}

export default NameChart
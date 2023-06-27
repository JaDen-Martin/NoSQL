import React, {useState, useEffect, useRef} from 'react'
import { data } from '../assets/testData'
import * as d3 from 'd3'

const years = 2011;
const testData = data;
const width = 650;
const height = 400;
const margin = { top: 30, right: 5, bottom: 30, left: 40 };

function NameChart() {
    const [data] = useState([14, 12, 10, 1, 22]);
    const svgRef = useRef();

    useEffect(()=> {
        //setting up svg
        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)
        .style('background' , '#d3d3d3').style('margin-top', margin.top).style('overflow', 'visible');

        //setting the scale
        const xScale = d3.scaleLinear()
            .domain([0, data.length - 1])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, height])
            .range([height, 0]);
        
        const generateScaledLine = d3.line()
            .x((d, i) => xScale(i))
            .y(yScale)
            .curve(d3.curveCardinal);

        const xAxis = d3.axisBottom(xScale)
            .ticks(data.length)
            .tickFormat(i => i + 1 + (years - 1));
        const yAxis = d3.axisLeft(yScale)
            .ticks(5);
        
         svg.append('g')
            .call(xAxis)
            .attr('transform', 'translate(0, ${height})');
        svg.append('g')
            .call(yAxis);   

        //setting up the data for the svg
        svg.selectAll('.line')
            .data([data])
            .join('path')
                .attr('d', d => generateScaledLine(d)) 
                .attr('fill', 'none')
                .attr('stroke', 'black');
        
        }, [data]); 

  return (
    <div>
        <svg ref={svgRef} ></svg>
    </div>
  ); 
}

export default NameChart
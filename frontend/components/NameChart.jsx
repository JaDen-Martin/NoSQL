import React, {useState, useEffect, useRef} from 'react'
import { data } from '../assets/testData'
import * as d3 from 'd3'

const testData = data;
const width = 720;
const height = 600;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const lineColors = ['#F51720', '#2FF3E0', '#F8D210', '#FA26A0']

function NameChart() {
    const [data, setData ] = useState([]);
    const [lines, setLines] = useState([]);
    const svgRef = useRef();


    useEffect( ()=> {
      console.log(
        'running the effect'
      )
        //setting up svg
        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)
        .style('background' , '#f9f9f9').style('margin-top', margin.top).style('overflow', 'visible');


        const wData = testData.filter( item => item.ethnicity == "White").sort( (a,b) => a.year - b.year);
        const bData = testData.filter( item => item.ethnicity == "Black").sort( (a,b) => a.year - b.year);
        const aData = testData.filter( item => item.ethnicity == "Asian").sort( (a,b) => a.year - b.year);
        const hData = testData.filter( item => item.ethnicity == "Hispanic").sort( (a,b) => a.year - b.year);


        //setting the scale
        const xScale = d3.scaleLinear().domain(d3.extent(testData.map(item => item.year))).range([0, width]);
        const numsInData = testData.map(d => d.number);
        const maxNumberY = Math.max(...numsInData);

        const yScale = d3.scaleLinear().domain([0, (maxNumberY + 20) ]).range([height, 0]);
      
        const xAxis = d3.axisBottom(xScale).tickSize([-(height + margin.top)]).tickFormat(d3.format("d"));
     
        const yAxis = d3.axisLeft(yScale).tickSize([-(width)]);
        
        
        svg.append('g').call(xAxis).attr('transform', `translate(0, ${height + margin.top})`);
        svg.append('g').call(yAxis).attr('transform', `translate(0, 0)`);
        
        svg.append('text').attr("class", "axis-label").attr('text-anchor', 'middle').attr('x', width / 2
        ).attr('y', height + 55).attr('stroke', 'rgba(255, 255, 255)').attr('font-weight', 100).attr("letter-spacing", 2).text('Year');

        svg.append('text').attr("class", "axis-label").attr('text-anchor', 'end').attr('x', -(height /2)).attr('y', -50).attr('stroke', 'rgba(255, 255, 255)').attr("letter-spacing", 2).attr("transform", "rotate(-90)").attr('font-weight', 100).text('Number');

        const lineGenerator = d3.line().x(d => xScale(d.year)).y(d => yScale(d.number));
      
        const wLine = lineGenerator(wData);
        const bLine = lineGenerator(bData);
        const aLine = lineGenerator(aData);
        const hLine = lineGenerator(hData);

        
        setLines([wLine, bLine, aLine, hLine]);
   
    }, [data])

  return (
    <div>
      <div>Legend</div>
        <svg ref={svgRef} width={width} height={height}>

          {lines.map ( (line, i)  => 
            <path fill='none' stroke={lineColors[i]} d={line} strokeWidth="2.5" key={line}/> 
          )}


        </svg>
    </div>
  )
}

export default NameChart


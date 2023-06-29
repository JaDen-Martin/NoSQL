import React, {useState, useEffect, useRef} from 'react'
import { useParams } from 'react-router-dom'
import { data } from '../assets/testData'
import * as d3 from 'd3'
import Legend from './Legend';

const testData = data;
const width = 720;
const height = 600;
const margin = { top: 5, right: 20, bottom: 20, left: 20 };
const lineColors = {White:'#F51720', Black:'#2FF3E0', Asian:'#F8D210', Hispanic:'#FA26A0'}
const allColor = '#32CD32'


function NameChart() {
    const [data, setData ] = useState([]);
    const [lines, setLines] = useState([]);
    const [allLine, setAllLine ] = useState('');
    const [showChart, setShowChart] = useState('ethnicity') //this will be either the string ethnicity or all and shows which version of the chart to display
    const [colorsState, setColorsState] = useState([]);
    const svgRef = useRef();
    // const showChartRef = useRef();
    // showChartRef.current = showChart;
    const {name} = useParams();
 
    useEffect( ()=> {
        //setting up svg
        if (data.length > 0) return;
        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)
        .style('background' , '#f9f9f9').style('margin-top', margin.top).style('overflow', 'visible');

        let incomingData;
        fetch(`http://localhost:3000/name/${name}`).then(res => res.json()).then(json => {
          if (json){
            incomingData = json;
            setData(json);
          }
        })
   
    }, [])

    useEffect(()=> {
      if (!data.length) return;

      const svg = d3.select(svgRef.current);

      const wData = data.filter( item => item.ethnicity == "White").sort( (a,b) => a.year - b.year);
      const bData = data.filter( item => item.ethnicity == "Black").sort( (a,b) => a.year - b.year);
      const aData = data.filter( item => item.ethnicity == "Asian").sort( (a,b) => a.year - b.year);
      const hData = data.filter( item => item.ethnicity == "Hispanic").sort( (a,b) => a.year - b.year);

      svg.append('text').attr("class", "axis-label").attr('text-anchor', 'middle').attr('x', width / 2
      ).attr('y', height + 55).attr('stroke', 'rgba(255, 255, 255)').attr('font-weight', 100).attr("letter-spacing", 2).text('Year');

      svg.append('text').attr("class", "axis-label").attr('text-anchor', 'end').attr('x', -(height /2)).attr('y', -50).attr('stroke', 'rgba(255, 255, 255)').attr("letter-spacing", 2).attr("transform", "rotate(-90)").attr('font-weight', 100).text('Number');
      
      const numsInData = data.map(d => d.number);
      const max = Math.max(...numsInData);

      const linesArray = []; //the svg paths will be calculated and added to this array
      const newColorsState = []; //push only the colors that are in the data 

      function generateLineAndColors(data, ethnicity, newState){
        if (data.length > 0) {
          const line = lineGenerator(data);
          newState.push([line, lineColors[ethnicity]]);
          newColorsState.push({ethnicity, color: lineColors[ethnicity]});
        } 
      }

      const {lineGenerator} = paintChart(data, max);
      generateLineAndColors(wData, 'White', linesArray);
      generateLineAndColors(bData, 'Black', linesArray);
      generateLineAndColors(aData, 'Asian', linesArray);
      generateLineAndColors(hData, 'Hispanic', linesArray);
        
      setColorsState(newColorsState);
      setLines(linesArray); 
      
    }, [data]);


    function clearSvg() {
      console.log('clearing svg')
      d3.selectAll('svg g').remove();
    }

    function paintChart(dataArr, maxYVal) {
      console.log('painting chart...' + maxYVal)
      const svg = d3.select(svgRef.current);
      const xScale = d3.scaleLinear().domain(d3.extent(dataArr.map(item => item.year))).range([0, width]);

      const yScale = d3.scaleLinear().domain([0, (maxYVal + 20) ]).range([height, 0]);
    
      const xAxis = d3.axisBottom(xScale).tickSize([-(height + margin.top)]).tickFormat(d3.format("d"));
   
      const yAxis = d3.axisLeft(yScale).tickSize([-(width)]);
      
      
      svg.append('g').call(xAxis).attr('transform', `translate(0, ${height + margin.top + 5})`);
      svg.append('g').call(yAxis).attr('transform', `translate(0, 0)`);
      

      const lineGenerator = d3.line().x(d => xScale(d.year)).y(d => yScale(d.number));
      return {
        xScale,
        yScale,
        lineGenerator
      }

    }


    const handleShowChartChange = (e) => {
      const value = e.target.value;
      if(!data.length || !lines.length) return;
      clearSvg();
      setShowChart(value);

      if (value == 'all'){
        if (!allLine) {
          console.log('we haven"t calculated all line yet');
          const combinedVals = combineData(data);
          const numbers = combinedVals.map(item => item.number);

          const max = Math.max(...numbers);

          const { xScale,
            yScale,
            lineGenerator
          } = paintChart(combinedVals, max);
          const newAllLine = lineGenerator(combinedVals);
          setAllLine(newAllLine);
        } 
        const combinedVals = combineData(data);
        const numbers = combinedVals.map(item => item.number);
        const max = Math.max(...numbers);

        const { xScale,
          yScale,
          lineGenerator
        } = paintChart(combinedVals, max);
    
        
      }  else { //value is ethnicity and we can paint the lines for ethnicity 
        const numsInData = data.map(d => d.number);
        const max = Math.max(...numsInData);
        const {lineGenerator} = paintChart(data, max);
      }
    
      }
    

    function combineData(arr) {

      const combinedData = {};
      const combinedDataArr = [];
      for (let item of arr){
        if (!combinedData[item.year]){
          combinedData[item.year] = item.number;
        } else {
          combinedData[item.year]+= item.number
        }
      }
      
      for (let key of Object.keys(combinedData)){
        combinedDataArr.push({year: key, number: combinedData[key]});
      }
      return combinedDataArr;
    }
  
  
  return (
    <div className='line-chart'>
      {console.log(allLine)}
        <svg ref={svgRef} width={width} height={height}>
        
          { showChart == 'ethnicity' ? lines.map ( (line, i)  => 
            <path fill='none' stroke={line[1]} d={line[0]} strokeWidth="2.5" key={line}/> 
          )  : 
           allLine && <path fill='none' stroke={allColor} d={allLine} strokeWidth="2.5" /> 
          }


        </svg>

        <Legend colors={colorsState} allColor={allColor} showChart={showChart} setShowChart={setShowChart} handleChange={handleShowChartChange} />
    </div>
  )
}


export default NameChart


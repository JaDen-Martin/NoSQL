import React, {useState, useEffect, useRef} from 'react'
import { useParams } from 'react-router-dom'
import * as d3 from 'd3'
import Legend from './Legend';

const width = 720;
const height = 600;
const margin = { top: 5, right: 20, bottom: 20, left: 20 };
const lineColors = {White:'#F51720', Black:'#2FF3E0', Asian:'#F8D210', Hispanic:'#FA26A0'}
const allColor = '#32CD32'

function filterByEthnicity(data, ethnicity) {
  return data.filter( item => item.ethnicity == ethnicity).sort( (a,b) => a.year - b.year)
}


function NameChart( { name } ) {
    const [data, setData ] = useState([]);
    const [lines, setLines] = useState([]);
    const [allLine, setAllLine ] = useState('');
    const [chartCriteria, setChartCriteria] = useState('ethnicity') //this will be either the string ethnicity or all and shows which version of the chart to display
    const [colorsState, setColorsState] = useState([]);
    const svgRef = useRef();

    function setUpChart(htmlNode = svgRef.current) {
      const svg = d3.select(htmlNode).attr('width', width).attr('height', height)
      .style('background' , '#f9f9f9').style('margin-top', margin.top).style('overflow', 'visible');
      svg.append('text').attr("class", "axis-label").attr('text-anchor', 'middle').attr('x', width / 2
      ).attr('y', height + 55).attr('stroke', 'rgba(255, 255, 255)').attr('font-weight', 100).attr("letter-spacing", 2).text('Year');

      svg.append('text').attr("class", "axis-label").attr('text-anchor', 'end').attr('x', -(height /2)).attr('y', -50).attr('stroke', 'rgba(255, 255, 255)').attr("letter-spacing", 2).attr("transform", "rotate(-90)").attr('font-weight', 100).text('Number');
    }
    
    useEffect(()=> {
      setUpChart(svgRef.current);
    }, [])
 
    useEffect( ()=> { //fetching effect runs on initial load, and evertime name changes

        setChartCriteria('ethnicity'); //set to default chart on name change

        if (name !== 'search'){
          fetch(`http://localhost:3000/name/${name}`).then(res => res.json()).then(json => {
            if (json) {
              setData(json);
              console.log(json)
              clearSvg();
              const wData = filterByEthnicity(json, "White");
              const bData = filterByEthnicity(json, "Black");
              const aData = filterByEthnicity(json, "Asian");
              const hData = filterByEthnicity(json, "Hispanic");
           
              const numsInData = json.map(d => d.number);
              const max = Math.max(...numsInData);
           
              const {xScale, yScale} = paintAxis(json, max);
              const lineGenerator = paintChart(xScale, yScale);
              const linesArray = []; //the svg paths will be calculated and added to this array
              const newColorsState = []; //push only the colors that are in the data 

              function generateLineAndColors(arr, ethnicity){
                if (arr.length > 0) {
                  const line = lineGenerator(arr);
                  linesArray.push([line, lineColors[ethnicity]]);
                  newColorsState.push({ethnicity, color: lineColors[ethnicity]});
                }
                
              }

              generateLineAndColors(wData, 'White');
              generateLineAndColors(bData, 'Black');
              generateLineAndColors(aData, 'Asian');
              generateLineAndColors(hData, 'Hispanic');
              setColorsState(newColorsState);
              setLines(linesArray); 
              
            }
          })
        } else { // if name is search and we can show another chart

        }
       
    }, [name]);

    function clearSvg() {
      d3.selectAll('svg g').remove();
    }

    function paintAxis (dataArr, maxYVal) {
      const svg = d3.select(svgRef.current);
      const xScale = d3.scaleLinear().domain(d3.extent(dataArr.map(item => item.year))).range([0, width]);

      const yScale = d3.scaleLinear().domain([0, (maxYVal + 20) ]).range([height, 0]);
    
      const xAxis = d3.axisBottom(xScale).tickSize([-(height + margin.top)]).tickFormat(d3.format("d"));
   
      const yAxis = d3.axisLeft(yScale).tickSize([-(width)]);
      
      svg.append('g').call(xAxis).attr('transform', `translate(0, ${height + margin.top + 5})`);
      svg.append('g').call(yAxis).attr('transform', `translate(0, 0)`);
      return { xScale, yScale };
    }

    function paintChart(x, y) {
      return d3.line().x(d => x(d.year)).y(d => y(d.number));
    }

    // function paintCircles() { I would like to be able to paint a circle at each point on the graph
    //   return 
    // }

    const handleCriteriaChange = (e) => { //efect runs when select menu option changes
      const value = e.target.value;
      if(!data.length || !lines.length) return;
      clearSvg();
      setChartCriteria(value);

      if (value == 'all'){
          const combinedVals = combineData(data);
          const numbers = combinedVals.map(item => item.number);
          const max = Math.max(...numbers);
          const {xScale, yScale} = paintAxis(combinedVals, max);
          const lineGenerator  = paintChart(xScale, yScale);
          const newAllLine = lineGenerator(combinedVals);
          setAllLine(newAllLine);
        
      }  else { //value is ethnicity and we can paint the lines for ethnicity 
        const numsInData = data.map(d => d.number);
        const max = Math.max(...numsInData);
        const {xScale, yScale} = paintAxis(data, max);
        paintChart(xScale, yScale);
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
      console.log(combinedDataArr);
      return combinedDataArr;
    }
  
  
  return (
    <div className='line-chart'>
        <svg ref={svgRef} width={width} height={height}>
        
          { 
          chartCriteria == 'ethnicity' ? lines.map ( line  => 
            <path fill='none' stroke={line[1]} d={line[0]} strokeWidth="2.5" key={line[0]}/> 
          )  : 
           allLine && <path fill='none' stroke={allColor} d={allLine} strokeWidth="2.5" /> 
          }


        </svg>

        <Legend colors={colorsState} chartCriteria={chartCriteria} handleChange={handleCriteriaChange} />
    </div>
  )
}


export default NameChart


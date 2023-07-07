import React, {useState, useEffect, useRef} from 'react'
import { useParams } from 'react-router-dom'
import * as d3 from 'd3'
import Legend from './Legend';

const width = 720;
const height = 600;
const margin = { top: 5, right: 20, bottom: 20, left: 20 };
const lineColors = {White:'#F51720', Black:'#2FF3E0', Asian:'#F8D210', Hispanic:'#FA26A0'}
const allColor = '#32CD32'
const topTenColors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#008000", "#FFC0CB" ];
const years = [{year: 2011}, {year: 2012}, {year: 2013}, {year: 2014}, {year: 2015}, {year: 2016}, {year: 2017}, {year: 2018}, {year: 2019} ]

function filterByEthnicity(data, ethnicity) {
  return data.filter( item => item.ethnicity == ethnicity).sort( (a,b) => a.year - b.year)
}


function NameChart( { chartData, svg, chartCriteria, setLegendValues} ) {

    const [lines, setLines] = useState([]);

  function generateCircles(arr, color, x, y, className){
    const circles = d3.select(svg)
    .selectAll(`.${className}`) 
    .data(arr)
    .join('circle')
    .attr('class', className)
    .attr('cx', d => x(d.year))
    .attr('cy', d => y(d.number))
    .attr('r', 4)
    .attr('fill', color);

    circles.append('title') // Add title elements to circles
    .text(d => `Year: ${d.year}, Number: ${d.number}`);
    // Add tooltip behavior
    circles.on('mouseover', function (event, d) {
    d3.select(this)
      .attr('r', 8); // Increase circle radius on mouseover
      
    // Show tooltip
    const tooltip = d3.select('.tooltip');
    
    tooltip.style('display', 'block')
      .style('left', `${event.pageX}px`)
      .style('top', `${event.pageY}px`)
      .text(`Year: ${d.year}, Number: ${d.number}`);
  }).on('mouseout', function () {
    d3.select(this)
      .attr('r', 4); // Reset circle radius on mouseout

    // Hide tooltip
    d3.select('#tooltip')
      .style('display', 'none');
  });
}

    useEffect(()=> {
      let d3Svg = d3.select(svg.current);
      if (!chartData.length ) return;
      clearSvg();

      if (chartCriteria == 'ethnicity'){

        const wData = filterByEthnicity(chartData, "White");
        const bData = filterByEthnicity(chartData, "Black");
        const aData = filterByEthnicity(chartData, "Asian");
        const hData = filterByEthnicity(chartData, "Hispanic");
        
        const numsInData = chartData.map(d => d.number);
        const max = Math.max(...numsInData);
        const {xScale, yScale} = paintAxis(chartData, max);
 
        const lineGenerator = paintChart(xScale, yScale);
        const linesArray = [];
        const legendOptionsArr = [];
      
        
        function generateLineAndColors(arr, ethnicity, i){
          if (arr.length > 0) {
            const line = lineGenerator(arr);
            linesArray.push({line, color: lineColors[ethnicity]});
            legendOptionsArr.push({text: ethnicity, color: lineColors[ethnicity]});
            generateCircles(arr, lineColors[ethnicity], xScale, yScale, `circle${i}`);
        }
      }
        generateLineAndColors(wData, 'White', 1);
        generateLineAndColors(bData, 'Black', 2);
        generateLineAndColors(aData, 'Asian'), 3;
        generateLineAndColors(hData, 'Hispanic', 4);
  
        setLines(linesArray)
        setLegendValues(legendOptionsArr);
  
      } else if (chartCriteria == 'all') {
        const combinedVals = combineData(chartData);
        const numbers = combinedVals.map(item => item.number);
        const max = Math.max(...numbers);
        const {xScale, yScale} = paintAxis(combinedVals, max);
        const lineGenerator  = paintChart(xScale, yScale);
        const newAllLine = lineGenerator(combinedVals);
        const newState = [{line: newAllLine, color: allColor}];
        setLines(newState);
        setLegendValues([{text: 'all', color: allColor}]);
        generateCircles(combinedVals, allColor, xScale, yScale, 'circle')

      } else {  //criteria is any of the top names stats in the overview tab
        const numbers = [];
        chartData.map( entry => {
          let name = entry._id;
          entry.yearsCombined.map( entry => {
            numbers.push(entry.number)
          } )
        });
        const maxNum = Math.max(...numbers);
        const {xScale, yScale} = paintAxis(years, maxNum);
        const linesArr = [];
        const lineGenerator = paintChart(xScale, yScale);
  
        chartData.forEach( (item, i) => {
          const line = lineGenerator(item.yearsCombined);
          linesArr.push({line, color: topTenColors[i]}); 
          generateCircles(item.yearsCombined, topTenColors[i], xScale, yScale, `circle${i}`)
            
        })
        
        setLines(linesArr);
      }
    }, [chartCriteria])
   

    function clearSvg() {
      d3.selectAll('svg g,circle').remove();
    }

    function paintAxis (dataArr, maxYVal) {
      const d3Svg = d3.select(svg);
      const xScale = d3.scaleLinear().domain(d3.extent(dataArr.map(item => item.year))).range([0, width]);

      const yScale = d3.scaleLinear().domain([0, (maxYVal + 20) ]).range([height, 0]);
    
      const xAxis = d3.axisBottom(xScale).tickSize([-(height + margin.top)]).tickFormat(d3.format("d"));
   
      const yAxis = d3.axisLeft(yScale).tickSize([-(width)]);
      
      d3Svg.append('g').call(xAxis).attr('transform', `translate(0, ${height + margin.top + 5})`);
      d3Svg.append('g').call(yAxis).attr('transform', `translate(0, 0)`);
      d3Svg.append('text').attr("class", "axis-label").attr('text-anchor', 'middle').attr('x', width / 2
      ).attr('y', height + 55).attr('stroke', 'rgba(255, 255, 255)').attr('font-weight', 100).attr("letter-spacing", 2).text('Year');
  
      d3Svg.append('text').attr("class", "axis-label").attr('text-anchor', 'end').attr('x', -(height /2)).attr('y', -50).attr('stroke', 'rgba(255, 255, 255)').attr("letter-spacing", 2).attr("transform", "rotate(-90)").attr('font-weight', 100).text('Number');
      return { xScale, yScale };
    }

    function paintChart(x, y) {
      return d3.line().x(d => x(d.year)).y(d => y(d.number));
    }

    // function paintCircles() { I would like to be able to paint a circle at each point on the graph
    //   return 
    // }
    
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
    
    <>
      { 
        lines?.map ( line  => 
        <path fill='none' stroke={line.color} d={line.line} strokeWidth="2.5" key={line.line}/> 
      )}
      <div className="tooltip"></div>
  </>
  )
}


export default NameChart


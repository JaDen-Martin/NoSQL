import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import * as d3 from 'd3'
import { useNavigate } from 'react-router-dom';
import {fetchData} from '../functions/fetchData'
import NameChart from './NameChart';
import Legend from './Legend'
import SearchBar from './SearchBar';
import LineChartDescription from './LineChartDescription';

const width = 720;
const height = 600;
const margin = { top: 5, right: 20, bottom: 20, left: 20 };
const lineColors = {White:'#F51720', Black:'#2FF3E0', Asian:'#F8D210', Hispanic:'#FA26A0'}
const allColor = '#32CD32'
const topTenColors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#008000", "#FFC0CB" ];
const nameOptions = [{field: 'ethnicity', text: 'ethnicity'}, {field: 'all', text: 'all'} ];
const topOptions = [{field: 'topGrowthRate', text: 'Top Growth Rate'}, {field: 'botGrowthRate', text: 'Lowest Growth Rate' }, {field: 'topMale', text: 'Most Popular Male'}, {field: 'topFemale', text: 'Most Popular Female' }];

function Names() {
  const { name } = useParams();
  const [data, setData] = useState([]);
  const [chartCriteria, setChartCriteria] = useState('');
  const [legendOptions, setLegendOptions] = useState([]);
  const [legendValues, setLegendValues] = useState([]);
  const svgRef = useRef();
  const navigate = useNavigate();

  function setUpChart(htmlNode = svgRef.current) {
    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)
    .style('background' , '#f9f9f9').style('margin-top', margin.top).style('overflow', 'visible');
    svg.append('text').attr("class", "axis-label").attr('text-anchor', 'middle').attr('x', width / 2
    ).attr('y', height + 55).attr('stroke', 'rgba(255, 255, 255)').attr('font-weight', 100).attr("letter-spacing", 2).text('Year');

    svg.append('text').attr("class", "axis-label").attr('text-anchor', 'end').attr('x', -(height /2)).attr('y', -50).attr('stroke', 'rgba(255, 255, 255)').attr("letter-spacing", 2).attr("transform", "rotate(-90)").attr('font-weight', 100).text('Number');
  }

  function getLegendPercentValues (data) {
    return data.map((item, i) => ({text: item._id, color: topTenColors[i], info: item?.averageNumber.toFixed(1)}));
  }

  useEffect(()=> {
    setUpChart(svgRef.current);
  }, [])

  useEffect( ()=> {
    if (name ==='search'){  
  
      fetchData('http://localhost:3000/topTenGrowthRate').then(data => {
      setData(data)
      setChartCriteria('topGrowthRate');
      setLegendOptions(topOptions);
      const newLegendVals = data.map((item, i) => ({text: item._id, color: topTenColors[i], info: `${item?.growthRate.toFixed(1)}%` }));
      setLegendValues(newLegendVals);
    });
   
    } else {
      fetchData(`http://localhost:3000/name/${name}`).then(data => {
      setData(data)
      setChartCriteria('ethnicity');
      setLegendOptions(nameOptions);
        }
      );

    }
  }, [name]);

  const handleCriteriaChange = (e) => { //effect runs when select menu option changes
    const value = e.target.value; 

    if (value == 'botGrowthRate'){
      fetchData('http://localhost:3000/botTenGrowthRate').then(data => {
        setData(data);
        const newLegendVals = data.map((item, i) => ({text: item._id, color: topTenColors[i], info: `${item?.growthRate.toFixed(1)}%` }));
        setLegendValues(newLegendVals);
        setChartCriteria(value);
      });
    } else if (value == 'topGrowthRate'){
      fetchData('http://localhost:3000/topTenGrowthRate').then(data => {
        setData(data);
        const newLegendVals = data.map((item, i) => ({text: item._id, color: topTenColors[i], info: `${item?.growthRate.toFixed(1)}%` }));
        setLegendValues(newLegendVals);
        setChartCriteria(value);
    })} else if (value == 'topMale'){
      fetchData('http://localhost:3000/topTenMaleNames').then(data => {
        setData(data);
        console.log(data);
        const newLegendVals = getLegendPercentValues(data);
        setLegendValues(newLegendVals);
        setChartCriteria(value);
    
    })
      
    } else if (value == 'topFemale'){
      fetchData('http://localhost:3000/topTenFemaleNames').then(data => {
        setData(data);
        const newLegendVals = getLegendPercentValues(data);
        setLegendValues(newLegendVals);
        setChartCriteria(value);
        setChartCriteria(value);
        
    })
    } else{
      setChartCriteria(value);
    }

  }

  const handleNavigate = () => {
    navigate(`/name/search`);
  }

  return (
    <>
    <h2 className='name-title'>{name == 'search' ? 'Overview' : name}</h2>
    <div className='chart-cont'>
      <LineChartDescription criteria={chartCriteria} name={name} />
      <div className='inner-cont'>
    
    <div className='chart-controls'>
    <SearchBar /> 
    { name != 'search' && <span onClick={handleNavigate}> overview </span> }
    </div>
    <div className='line-chart'>
     <svg ref={svgRef} width={width} height={height}>
     {data.length  &&
      <NameChart chartData={data} svg={svgRef.current} chartCriteria={chartCriteria} setLegendValues={setLegendValues} /> 

      }
      </svg>
   
     <Legend chartCriteria={chartCriteria} values={legendValues} options={legendOptions} handleChange={handleCriteriaChange} />
     </div>
     </div>
    </div>
    </>
  )
}

export default Names
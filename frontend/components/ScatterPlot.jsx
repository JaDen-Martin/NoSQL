import React, {useState, useEffect, useRef, useLayoutEffect} from 'react'
import * as d3 from 'd3'
import '../chartStyles/scatter.css'
import { fetchData } from '../functions/fetchData';



const width = '95%';
const height = 3000;
const margin = { top: 30, right: 20, bottom: 20, left: 20 };
const HIGHESTNUMBER = 426; //This is the highest number of any data point in the set. 
const ethColors = {White:'#F51720', Black:'#2FF3E0', Asian:'#F8D210', Hispanic:'#FA26A0'}

function ScatterPlot() {


    
    // const [chartData, setChartData] = useState([]);
    const scatterRef = useRef();
    const widthRef = useRef(scatterRef.current ? scatterRef.current.clientWidth : 0);

    const debounceId = useRef(null)
    const intervalIdRef = useRef(null)
    // const isLoaded = useRef(false)
    

    useEffect(()=>{
      if (scatterRef.current){
        setUpChart(scatterRef);
        const{ xScale, yScale } = paintAxis( HIGHESTNUMBER, scatterRef);
        widthRef.current = scatterRef.current.clientWidth;

        const id = getDataInPages(xScale, yScale);
        intervalIdRef.current = id;
        return () => clearInterval(id);
      }
     
    }, []);

    useEffect(() => {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useLayoutEffect(() => {
      handleResize();
    }, []);

    function setUpChart(ref) {
      const svg = d3.select(ref.current).attr('width', width).attr('height', height)
      .style('background' , '#f9f9f9').style('margin-top', margin.top).style('overflow', 'visible');
  
      const chartWidth = +ref.current.clientWidth;
      svg.append('text').attr("class", "axis-label").attr('text-anchor', 'middle').attr('x', chartWidth / 2
      ).attr('y', -10).attr('stroke', 'rgba(255, 255, 255)').attr('font-weight', 100).attr("letter-spacing", 2).text('Year');
  
      svg.append('text').attr("class", "axis-label").attr('text-anchor', 'end').attr('x', -200).attr('y', -40).attr('stroke', 'rgba(255, 255, 255)').attr("letter-spacing", 2).attr("transform", "rotate(-90)").attr('font-weight', 100).text('Number');
    }
  
    function paintAxis ( maxYVal, ref) {
      const chartWidth = +ref.current.clientWidth;
      const d3Svg = d3.select(ref.current);
      const xScale = d3.scaleLinear().domain([2011, 2020]).range([0, chartWidth]);
  
      const yScale = d3.scaleLinear().domain([0, (maxYVal + 20)]).range([0, height]);
    
      const xAxis = d3.axisBottom(xScale).tickSize([-(height + margin.top)]).tickFormat(d3.format("d"));
   
      const yAxis = d3.axisLeft(yScale).tickSize(-(chartWidth));
      
      d3Svg.append('g').call(xAxis).attr('transform', `translate(0, ${height + margin.top + 5})`);
      d3Svg.append('g').call(yAxis).attr('transform', `translate(0, 0)`);
      return { xScale, yScale };
  
    };

    function getDataInPages(xScale, yScale){
      let page = 0;
      setChartData([]);
      let circleSize = d3.scaleSqrt().domain([0,HIGHESTNUMBER]).range([0, 8]);
      const id = setInterval(()=> {
        if (page < 36) { // the number of pages needed to get all the data
          const url = `http://localhost:3000/allData/year/${page}/asc/all`;
          fetchData(url).then((data)=>{
            // const newState = [...chartData, ...data];
            // setChartData(newState);
            page++;
            if (data.length) {
              console.log(page)
              generateCircles(data, xScale, yScale, `circle${page}`, circleSize);
          
            } else {
              clearInterval(id);
            }
          }).catch(err => {if(err) clearInterval(id);   console.log(err) });
        } else {
          clearInterval(id)
        }
   
      }, 700);
    
      return id;
    }

    function generateCircles(arr, x, y, className, size) {
      const collWidth = +scatterRef.current.clientWidth / 9;

      const circles = d3.select(scatterRef.current)
      .selectAll(`.${className}`) 
      .data(arr)
      .join('circle')
      .attr('class', className)
      .attr('cx', d => x(d.year) + randomIntFromInterval(0, collWidth))
      .attr('cy', d => y(d.number))
      .attr('r', d => size(d.number))
      .attr('fill', (d, i) => ethColors[d.ethnicity]);
    };

    function handleResize() {
      if (widthRef.current && scatterRef.current.clientWidth != widthRef.current){
        d3.selectAll('svg *').remove();
        clearInterval(intervalIdRef.current);
        clearTimeout(debounceId.current)
        let debounce;
        // console.log('handling resize')
        widthRef.current = scatterRef.current.clientWidth;
        debounce = setTimeout(paintNewChart(), 800);
        debounceId.current = debounce;
      }
    }

    function paintNewChart() {
      setUpChart(scatterRef);
      const{ xScale, yScale } = paintAxis( HIGHESTNUMBER, scatterRef);
        const id = getDataInPages(xScale, yScale);
        intervalIdRef.current = id;
       
      }
   
  

  return (
    <div className='scatter-cont'>
        <svg ref={scatterRef} width={width} height={height}>
        </svg>

    </div>
  )
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export default ScatterPlot
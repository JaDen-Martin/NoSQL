import React from 'react'

function About() {
  return (
    <div className='outer-abt'>
     <img src="./assets/PoliceTag.png" style={{width:'250px', height:'250px'}}></img>
         <h1>JSON Data SQencing</h1>
      <div className='inner-abt' style={{fontSize: 22}}>
        <section>
          <p>
            Our project is a MongoDB driven application that explores the different mechanisms and functions that are capable with MongoDB.
            We use NodeJS and ExpressJS as our backend and ReactJS for our frontend. All graphs were created using the d3JS library.</p>
          <p>
            Our first display is a  table that retrieves all data from our database and allows sorting based on different criterias.
            Names can be displayed on a page in different increments (20,50,100) and are loaded 500 at a time. Both of these features signifcantly imporve performance.
          </p>
          <p>
            Our second display is a line chart that shows the count of a name sorted by ethinicty during the course of several years.
            The data can also be conjoined and show a line based soley on the name.
          </p>
          <p>
            Our thrid display is a scatter plot that is a combination of our first and second displays.
            It loads data onto a chart and populates the graph with data accumlating overtime.
          </p>
        </section>
      </div>
    </div>
  )
}

export default About
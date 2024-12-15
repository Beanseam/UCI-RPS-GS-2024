import './App.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios'

import Title from './components/Title.jsx'
import AltGraph from './components/AltGraph.jsx'
import AcelGraph from './components/AcelGraph.jsx'
import GyroGraph from './components/GyroGraph.jsx'
import MagGraph from './components/MagGraph.jsx'
import AcelGraph2 from './components/AcelGraph2.jsx'
import AltMeter from './components/AltMeter.jsx'
import PresMeter from './components/PresMeter.jsx'
import States from './components/States.jsx'

function download(data) {
  // Create a Blob with the CSV data and type
  const blob = new Blob([data], { type: 'text/csv' });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create an anchor tag for downloading
  const a = document.createElement('a');
  
  // Set the URL and download attribute of the anchor tag
  a.href = url;
  a.download = 'data.csv';
  
  // Trigger the download by clicking the anchor tag
  a.click();
}

function saveData(data) {
  const headers = ['Altitude','Temperature','Pressure','Acceleration_X','Acceleration_Y','Acceleration_Z',
    'Gyroscope_X','Gyroscope_Y','Gyroscope_Z','Magnetometer_X','Magnetometer_Y','Magnetometer_Z','Acceleration2_X',
    'Acceleration2_Y','Acceleration2_Z'];
  const values = Object.values(data);
  const csvData = [headers.join(','), values.join(',')].join('\n');
  download(csvData);
}

function resetData(data) {
  data = {
    time: [], alt: [], temp: [], pres: [],
    acc_x: [], acc_y: [], acc_z: [],
    gyro_x: [], gyro_y: [], gyro_z: [],
    mag_x: [], mag_y: [], mag_z: [],
    acc_x_2: [], acc_y_2: [], acc_z_2: [], state: []
  };
  alert("Deleted Data");
}

function App() {
  const [sensorData, setSensorData] = useState({
    time: [], alt: [], temp: [], pres: [],
    acc_x: [], acc_y: [], acc_z: [],
    gyro_x: [], gyro_y: [], gyro_z: [],
    mag_x: [], mag_y: [], mag_z: [],
    acc_x_2: [], acc_y_2: [], acc_z_2: [], state: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("REQUEST------------");
        const response = await axios.get('http://127.0.0.1:5000/data');
        console.log("SUCCESS------------");

        console.log(response.data);

        // const dataString = JSON.stringify(response);
        const dataString = response.data
        console.log(dataString);

        const values = dataString.split(',');
        console.log(values);


        if (values.length === 17 && prevState.time[prevState.time.length-1] != values[0]) {
          setSensorData(prevState => ({
            ...prevState,
            time: [...prevState.time, parseFloat(values[0])],
            alt: [...prevState.alt, parseFloat(values[1])],
            temp: [...prevState.temp, parseFloat(values[2])],
            pres: [...prevState.pres, parseFloat(values[3])],
            acc_x: [...prevState.acc_x, parseFloat(values[4])],
            acc_y: [...prevState.acc_y, parseFloat(values[5])],
            acc_z: [...prevState.acc_z, parseFloat(values[6])],
            gyro_x: [...prevState.gyro_x, parseFloat(values[7])],
            gyro_y: [...prevState.gyro_y, parseFloat(values[8])],
            gyro_z: [...prevState.gyro_z, parseFloat(values[9])],
            mag_x: [...prevState.mag_x, parseFloat(values[10])],
            mag_y: [...prevState.mag_y, parseFloat(values[11])],
            mag_z: [...prevState.mag_z, parseFloat(values[12])],
            acc_x_2: [...prevState.acc_x_2, parseFloat(values[13])],
            acc_y_2: [...prevState.acc_y_2, parseFloat(values[14])],
            acc_z_2: [...prevState.acc_z_2, parseFloat(values[15])],
            state: [...prevState.state, parseFloat(values[16])]
          }));
        }
        console.log();

      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [sensorData]);

  return (
    <div>
      <body>
        <header class="page-title">
        <div className="title">
            <p class="alignleft"><button class="reset-button" type="button" onClick={() => resetData(sensorData)}>Reset Data</button></p>
            <h1 style={{ fontSize: '2.5em', width: "33.33333%", textAlign:"center", float: "left"}}>UCI Rocket Project Solids - Ground Station</h1>
            <p class="alignright"><button class="save-button" type="button" onClick={() => saveData(sensorData)}>Save Data</button></p>
          </div>
        </header>
        <main class="page-content">

          <nav class="content-one">
            <AltGraph altData={sensorData['alt']} timeData={sensorData['time']}/>

            <States stateData={sensorData['state']}/>
            
          </nav>

          <article class="content-two">
            <AcelGraph
              acelDataX = {sensorData['acc_x']}
              acelDataY = {sensorData['acc_y']}
              acelDataZ = {sensorData['acc_z']}
            />
            <GyroGraph
              gyroDataX = {sensorData['gyro_x']}
              gyroDataY = {sensorData['gyro_y']}
              gyroDataZ = {sensorData['gyro_z']}
            />
            <MagGraph
              magDataX = {sensorData['mag_x']}
              magDataY = {sensorData['mag_y']}
              magDataZ = {sensorData['mag_z']}
            />
          </article>

          <aside class="content-three">
            <AcelGraph2
              acelDataX2 = {sensorData['acc_x_2']}
              acelDataY2 = {sensorData['acc_y_2']}
              acelDataZ2 = {sensorData['acc_z_2']}
            />
            <AltMeter altValue={sensorData['alt'][sensorData['alt'].length-1]}/>
            <PresMeter presValue={sensorData['pres'][sensorData['pres'].length-1]}/>
          </aside>
          
        </main>

        <footer class="page-footer">
        </footer>

      </body>

    </div>
  );
}

export default App;

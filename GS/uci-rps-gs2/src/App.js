import "./index.css";

import React, { useState, useEffect } from 'react';
import axios from 'axios'

import Model from "./components/model.jsx";
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
      <body className='bg-blue-900 font-serif'>
        <header class="page-title">
        <div className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-50 shadow-lg h-1/15">
            <p class="alignleft"><button class="reset-button" type="button" onClick={() => resetData(sensorData)}>Reset Data</button>
            <button class="save-button" type="button" onClick={() => saveData(sensorData)}>Save Data</button></p>
            <h1 style={{ fontSize: '2.5em', width: "33.33333%", textAlign:"center", float: "left"}}>UCI Rocket Project Solids - Ground Station</h1>
            <p class="alignright"><States stateData={sensorData['state']} /></p>
          </div>
        </header>

        <main className="px-10 bg-blue-900 p-0 m-0 mt-16 h-3/4 w-full">
          <div className="flex flex-cols-2 bg-blue-900 p-0 m-0" >
            <div className="w-1/2 bg-blue-900 p-0 m-0 h-3/4">
              <AltGraph altData={sensorData['alt']} timeData={sensorData['time']}/>  
              <GyroGraph
                gyroDataX = {sensorData['gyro_x']}
                gyroDataY = {sensorData['gyro_y']}
                gyroDataZ = {sensorData['gyro_z']}
              />          
            </div>
      
            <div className='flex flex-col bg-blue-900 p-0 m-1px w-1/2 h-3/4'>
              <AcelGraph 
                acelDataX = {sensorData['acc_x']}
                acelDataY = {sensorData['acc_y']}
                acelDataZ = {sensorData['acc_z']}
              />
              <AcelGraph2
                acelDataX2 = {sensorData['acc_x_2']}
                acelDataY2 = {sensorData['acc_y_2']}
                acelDataZ2 = {sensorData['acc_z_2']}
              />
            </div>
            <div className='flex flex-col bg-blue-900 p-0 m-0 w-1/2 h-3/4'>
              <MagGraph
                  magDataX = {sensorData['mag_x']}
                  magDataY = {sensorData['mag_y']}
                  magDataZ = {sensorData['mag_z']}
              />
            </div>
          </div>

          
          
        </main>


        <footer className="flex flex-row justify-between items-center bg-gray-800 text-white p-4">
          <div>
            <Model/>
          </div>
          <div className="text-center pr-10">
            <p className="text-lg">
              Time: {typeof values !== "undefined" && values[0] ? parseFloat(values[0]) : 'N/A'} | 
              Altitude: {typeof values !== "undefined" && values[1] ? parseFloat(values[1]) : 'N/A'} | 
              Temperature: {typeof values !== "undefined" && values[2] ? parseFloat(values[2]) : 'N/A'} | 
              Pressure: {typeof values !== "undefined" && values[3] ? parseFloat(values[3]) : 'N/A'}
            </p>

            <table className="overflow-y-auto h-1/4 w-full border border-gray-500 text-white">
              <thead className="bg-gray-700">
                <tr>
                  <th className="border border-gray-500 px-4 py-2">Sensor</th>
                  <th className="border border-gray-500 px-4 py-2">X</th>
                  <th className="border border-gray-500 px-4 py-2">Y</th>
                  <th className="border border-gray-500 px-4 py-2">Z</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800">
                <tr>
                  <td className="border border-gray-500 px-4 py-2">Acceleration LSM</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof values !== "undefined" && values[4] ? parseFloat(values[4]) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof values !== "undefined" && values[5] ? parseFloat(values[5]) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof values !== "undefined" && values[6] ? parseFloat(values[6]) : 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-500 px-4 py-2">Acceleration LIS</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof values !== "undefined" && values[13] ? parseFloat(values[13]) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof values !== "undefined" && values[14] ? parseFloat(values[14]) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof values !== "undefined" && values[15] ? parseFloat(values[15]) : 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-500 px-4 py-2">Angular Speed</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof values !== "undefined" && values[7] ? parseFloat(values[7]) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof values !== "undefined" && values[8] ? parseFloat(values[8]) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof values !== "undefined" && values[9] ? parseFloat(values[9]) : 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-500 px-4 py-2">Magnetometer</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof values !== "undefined" && values[10] ? parseFloat(values[10]) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof values !== "undefined" && values[11] ? parseFloat(values[11]) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof values !== "undefined" && values[12] ? parseFloat(values[12]) : 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </footer>


      </body>
  );
}

export default App;

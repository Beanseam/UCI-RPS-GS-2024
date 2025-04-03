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
 
// function download(data) {
//   // Create a Blob with the CSV data and type
//   const blob = new Blob([data], { type: 'text/csv' });
 
//   // Create a URL for the Blob
//   const url = URL.createObjectURL(blob);
 
//   // Create an anchor tag for downloading
//   const a = document.createElement('a');
 
//   // Set the URL and download attribute of the anchor tag
//   a.href = url;
//   a.download = 'data.csv';
 
//   // Trigger the download by clicking the anchor tag
//   a.click();
// }
 
// function saveData(data) {
//   const headers = ['Altitude','Temperature','Pressure','Acceleration_X','Acceleration_Y','Acceleration_Z',
//     /*'Gyroscope_X','Gyroscope_Y','Gyroscope_Z',*/'Magnetometer_X','Magnetometer_Y','Magnetometer_Z','Acceleration2_X',
//     'Acceleration2_Y','Acceleration2_Z'];
//   const values = Object.values(data);
//   const csvData = [headers.join(','), values.join(',')].join('\n');
//   download(csvData);
// }
 
// function resetData(data) {
//   data = {
//     time: [], alt: [], temp: [], pres: [],
//     acc_x: [], acc_y: [], acc_z: [],
//     // gyro_x: [], gyro_y: [], gyro_z: [],
//     mag_x: [], mag_y: [], mag_z: [],
//     acc_x_2: [], acc_y_2: [], acc_z_2: []//, state: []
//   };
//   alert("Deleted Data");
// }
 
function App() {
  const [sensorData, setSensorData] = useState({
    time: [], alt: [], temp: [], pres: [],
    acc_x: [], acc_y: [], acc_z: [],
    gyro_x: [], gyro_y: [], gyro_z: [],
    mag_x: [], mag_y: [], mag_z: [],
    acc_x_2: [], acc_y_2: [], acc_z_2: [], state: []
  });
 
  // sensorData = useState({
  //   time: [], alt: [], temp: [], pres: [],
  //   acc_x: [], acc_y: [], acc_z: [],
  //   gyro_x: [], gyro_y: [], gyro_z: [],
  //   mag_x: [], mag_y: [], mag_z: [],
  //   acc_x_2: [], acc_y_2: [], acc_z_2: [], state: []
  // });
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("REQUEST------------");
        const response = await axios.get('http://127.0.0.1:5000/data');
        console.log("SUCCESS------------");
 
        console.log(response.data);
 
        let dataString = response.data;
 
        console.log("Processed DataString:", dataString);
 
 
        if (true) {
          setSensorData(sensorData => ({
            ...sensorData,
           
            temp: [...sensorData.temp, parseInt(dataString['temperature'])],
            pres: [...sensorData.pres, parseInt(dataString['press'])],
            alt: [...sensorData.alt, parseInt(dataString['altitude'])],
            acc_x_2: [...sensorData.acc_x_2, parseInt(dataString['acceleration']['x2'])],
            acc_y_2: [...sensorData.acc_y_2, parseInt(dataString['acceleration']['y2'])],
            acc_z_2: [...sensorData.acc_z_2, parseInt(dataString['acceleration']['z2'])],
            acc_x: [...sensorData.acc_x, parseInt(dataString['acceleration']['x'])],
            acc_y: [...sensorData.acc_y, parseInt(dataString['acceleration']['y'])],
            acc_z: [...sensorData.acc_z, parseInt(dataString['acceleration']['z'])],
            gyro_x: [...sensorData.gyro_x, parseInt(dataString['gyro']['x'])],
            gyro_y: [...sensorData.gyro_y, parseInt(dataString['gyro']['y'])],
            gyro_z: [...sensorData.gyro_z, parseInt(dataString['gyro']['z'])],
            mag_x: [...sensorData.mag_x, parseInt(dataString['mag']['x'])],
            mag_y: [...sensorData.mag_y, parseInt(dataString['mag']['y'])],
            mag_z: [...sensorData.mag_z, parseInt(dataString['mag']['z'])],
            quat: {
              x: parseFloat(dataString['quaternion']['1']),
              y: parseFloat(dataString['quaternion']['2']),
              z: parseFloat(dataString['quaternion']['3']),
              w: parseFloat(dataString['quaternion']['4'])
            },
            state: [...sensorData.state, parseInt(dataString['state'])],
            time: [...sensorData.time, parseInt(dataString['timestamp'])]
          }));
        }
       
       
 
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };
 
    fetchData();
 
    const intervalId = setInterval(fetchData, 500);
 
    return () => clearInterval(intervalId);
  }, [sensorData]);
 
  return (
      <body className='bg-blue-900 font-serif'>
        <header class="page-title">
          {/* <div className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-50 shadow-lg h-1/15">
            <p class="alignleft"><button class="reset-button" type="button" onClick={() => resetData(sensorData)}>Reset Data</button>
            <button class="save-button" type="button" onClick={() => saveData(sensorData)}>Save Data</button></p>
            <h1 style={{ fontSize: '2.5em', width: "33.33333%", textAlign:"center", float: "left"}}>UCI Rocket Project Solids - Ground Station</h1>
            <p class="alignright"><States stateData={sensorData['state']} /></p>
          </div> */}
        </header>
 
        <main className="px-10 bg-blue-900 p-0 m-0 mt-16 h-3/4 w-full">
          <div>
            {/* <div className="w-1/2 bg-blue-900 p-0 m-0 h-3/4"> */}
              <AltGraph altData={sensorData['alt']} timeData={sensorData['time']}/>  
              <GyroGraph
                timeData={sensorData['time']}
                gyroDataX = {sensorData['gyro_x']}
                gyroDataY = {sensorData['gyro_y']}
                gyroDataZ = {sensorData['gyro_z']}
              />          
            {/* </div> */}
     
            {/* <div className='flex flex-col bg-blue-900 p-0 m-1px w-1/2 h-3/4'> */}
              <AcelGraph
                timeData={sensorData['time']}
                acelDataX = {sensorData['acc_x']}
                acelDataY = {sensorData['acc_y']}
                acelDataZ = {sensorData['acc_z']}
              />
              <AcelGraph2
                timeData={sensorData['time']}
                acelDataX2 = {sensorData['acc_x_2']}
                acelDataY2 = {sensorData['acc_y_2']}
                acelDataZ2 = {sensorData['acc_z_2']}
              />
            {/* </div> */}
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
            <Model quaternion={sensorData?.['quat'] ?? { x: 0, y: 0, z: 0, w: 1 }} />
          </div>
          <div className="text-center pr-10">
            <p className="text-lg">
              Time: {sensorData?.['time'][sensorData['time'].length-1] ?? 'N/A'} |
              Altitude: {sensorData?.['alt'][sensorData['alt'].length-1] ?? 'N/A'} |
              Temperature: {sensorData?.['temp'][sensorData['temp'].length-1] ?? 'N/A'} |
              Pressure: {sensorData?.['pres'][sensorData['pres'].length-1] ?? 'N/A'}
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
                  <td className="border border-gray-500 px-4 py-2">{sensorData?.['acc_x'][sensorData['acc_x'].length-1] ?? 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{sensorData?.['acc_y'][sensorData['acc_y'].length-1] ?? 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{sensorData?.['acc_z'][sensorData['acc_z'].length-1] ?? 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-500 px-4 py-2">Acceleration LIS</td>
                  <td className="border border-gray-500 px-4 py-2">{sensorData?.['acc_x_2'][sensorData['acc_x_2'].length-1] ?? 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{sensorData?.['acc_y_2'][sensorData['acc_y_2'].length-1] ?? 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{sensorData?.['acc_z_2'][sensorData['acc_z_2'].length-1] ?? 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-500 px-4 py-2">Angular Speed</td>
                  <td className="border border-gray-500 px-4 py-2">{sensorData?.['time'][sensorData['time'].length-1] ?? 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{sensorData?.['time'][sensorData['time'].length-1] ?? 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{sensorData?.['time'][sensorData['time'].length-1] ?? 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-500 px-4 py-2">Magnetometer</td>
                  <td className="border border-gray-500 px-4 py-2">{sensorData?.['mag_x'][sensorData['mag_x'].length-1] ?? 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{sensorData?.['mag_y'][sensorData['mag_y'].length-1] ?? 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{sensorData?.['mag_z'][sensorData['mag_z'].length-1] ?? 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </footer>
 
 
      </body>
  );
}
 
export default App;
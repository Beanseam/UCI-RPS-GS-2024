import "./index.css";

import React, { useState, useEffect, useRef } from 'react';

import Model from "./components/model.jsx";
//import Title from './components/Title.jsx';
import AltGraph from './components/AltGraph.jsx';
import AcelGraph from './components/AcelGraph.jsx';
import GyroGraph from './components/GyroGraph.jsx';
import MagGraph from './components/MagGraph.jsx';
import AcelGraph2 from './components/AcelGraph2.jsx';
import States from './components/States.jsx';

function App() {
  const [sensorData, setSensorData] = useState({
    time: [], alt: [], temp: [], pres: [],
    acc_x: [], acc_y: [], acc_z: [],
    gyro_x: [], gyro_y: [], gyro_z: [],
    mag_x: [], mag_y: [], mag_z: [],
    acc_x_2: [], acc_y_2: [], acc_z_2: [],
    state: [],
    quat: { x: 0, y: 0, z: 0, w: 1 }
  });

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080");

    socketRef.current.onmessage = (event) => {
      try {
        const dataString = JSON.parse(event.data);

        setSensorData(prevData => ({
          ...prevData,
          temp: [...prevData.temp, parseInt(dataString['temperature'])],
          pres: [...prevData.pres, parseInt(dataString['press'])],
          alt: [...prevData.alt, parseInt(dataString['altitude'])],
          acc_x_2: [...prevData.acc_x_2, parseInt(dataString['acceleration']['x2'])],
          acc_y_2: [...prevData.acc_y_2, parseInt(dataString['acceleration']['y2'])],
          acc_z_2: [...prevData.acc_z_2, parseInt(dataString['acceleration']['z2'])],
          acc_x: [...prevData.acc_x, parseInt(dataString['acceleration']['x'])],
          acc_y: [...prevData.acc_y, parseInt(dataString['acceleration']['y'])],
          acc_z: [...prevData.acc_z, parseInt(dataString['acceleration']['z'])],
          gyro_x: [...prevData.gyro_x, parseInt(dataString['gyro']['x'])],
          gyro_y: [...prevData.gyro_y, parseInt(dataString['gyro']['y'])],
          gyro_z: [...prevData.gyro_z, parseInt(dataString['gyro']['z'])],
          mag_x: [...prevData.mag_x, parseInt(dataString['mag']['x'])],
          mag_y: [...prevData.mag_y, parseInt(dataString['mag']['y'])],
          mag_z: [...prevData.mag_z, parseInt(dataString['mag']['z'])],
          quat: {
            x: parseFloat(dataString['quaternion']['1']),
            y: parseFloat(dataString['quaternion']['3']),
            z: parseFloat(dataString['quaternion']['2']),
            w: parseFloat(dataString['quaternion']['4'])
          },
          state: [...prevData.state, parseInt(dataString['state'])],
          time: [...prevData.time, parseInt(dataString['timestamp'])]
        }));
      } catch (err) {
        console.error("WebSocket data error:", err);
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket connection error:", err);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  //command send function
  const sendCommand = (command) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ command }));
    } else {
      console.warn("WebSocket not open. Cannot send command.");
    }
  };

  const resetData = () => {
    setSensorData(prev => ({
      ...prev,
      temp: [], pres: [], alt: [],
      acc_x_2: [], acc_y_2: [], acc_z_2: [],
      acc_x: [], acc_y: [], acc_z: [],
      gyro_x: [], gyro_y: [], gyro_z: [],
      mag_x: [], mag_y: [], mag_z: [],
      state: [], time: []
    }));
  };

  return (
    <body className='bg-blue-900 font-serif'>
      <header className="page-title">
        <div className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-50 shadow-lg h-1/15">
          <p className="alignleft">
            <button className="reset-button" type="button" onClick={resetData}>Reset Data</button>
          </p>
          <h1 style={{ fontSize: '2.5em', width: "33.33333%", textAlign:"center", float: "left"}}>
            UCI Rocket Project Solids - Ground Station
          </h1>
          <p className="alignright">
            {/* <States stateData={sensorData['state']} /> */}
          </p>
        </div>
      </header>

      <main>
        <div>
          <AltGraph altData={sensorData['alt']} timeData={sensorData['time']}/>  
          <GyroGraph
            timeData={sensorData['time']}
            gyroDataX={sensorData['gyro_x']}
            gyroDataY={sensorData['gyro_y']}
            gyroDataZ={sensorData['gyro_z']}
          />
          <AcelGraph
            timeData={sensorData['time']}
            acelDataX={sensorData['acc_x']}
            acelDataY={sensorData['acc_y']}
            acelDataZ={sensorData['acc_z']}
          />
          <AcelGraph2
            timeData={sensorData['time']}
            acelDataX2={sensorData['acc_x_2']}
            acelDataY2={sensorData['acc_y_2']}
            acelDataZ2={sensorData['acc_z_2']}
          />
          <MagGraph
            magDataX={sensorData['mag_x']}
            magDataY={sensorData['mag_y']}
            magDataZ={sensorData['mag_z']}
          />
        </div>
      </main>

      <footer className="flex flex-row justify-between items-center bg-gray-800 text-white p-4">
        <div>
          <Model quaternion={sensorData?.['quat']} />
        </div>
        <div className="text-center pr-10">
          <p className="text-lg">
            Time: {sensorData?.['time'].at(-1) ?? 'N/A'} |
            Altitude: {sensorData?.['alt'].at(-1) ?? 'N/A'} |
            Temperature: {sensorData?.['temp'].at(-1) ?? 'N/A'} |
            Pressure: {sensorData?.['pres'].at(-1) ?? 'N/A'}
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
                <td className="border border-gray-500 px-4 py-2">{sensorData?.['acc_x'].at(-1) ?? 'N/A'}</td>
                <td className="border border-gray-500 px-4 py-2">{sensorData?.['acc_y'].at(-1) ?? 'N/A'}</td>
                <td className="border border-gray-500 px-4 py-2">{sensorData?.['acc_z'].at(-1) ?? 'N/A'}</td>
              </tr>
              <tr>
                <td className="border border-gray-500 px-4 py-2">Acceleration LIS</td>
                <td className="border border-gray-500 px-4 py-2">{sensorData?.['acc_x_2'].at(-1) ?? 'N/A'}</td>
                <td className="border border-gray-500 px-4 py-2">{sensorData?.['acc_y_2'].at(-1) ?? 'N/A'}</td>
                <td className="border border-gray-500 px-4 py-2">{sensorData?.['acc_z_2'].at(-1) ?? 'N/A'}</td>
              </tr>
              <tr>
                <td className="border border-gray-500 px-4 py-2">Angular Speed</td>
                <td className="border border-gray-500 px-4 py-2">{sensorData?.['gyro_x'].at(-1) ?? 'N/A'}</td>
                <td className="border border-gray-500 px-4 py-2">{sensorData?.['gyro_y'].at(-1) ?? 'N/A'}</td>
                <td className="border border-gray-500 px-4 py-2">{sensorData?.['gyro_z'].at(-1) ?? 'N/A'}</td>
              </tr>
              <tr>
                <td className="border border-gray-500 px-4 py-2">Magnetometer</td>
                <td className="border border-gray-500 px-4 py-2">{sensorData?.['mag_x'].at(-1) ?? 'N/A'}</td>
                <td className="border border-gray-500 px-4 py-2">{sensorData?.['mag_y'].at(-1) ?? 'N/A'}</td>
                <td className="border border-gray-500 px-4 py-2">{sensorData?.['mag_z'].at(-1) ?? 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </footer>
    </body>
  );
}

export default App;

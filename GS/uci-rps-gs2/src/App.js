import "./index.css";

import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import Model from "./components/model.jsx";
//import Title from './components/Title.jsx';
import AltGraph from './components/AltGraph.jsx';
import AcelGraph from './components/AcelGraph.jsx';
import GyroGraph from './components/GyroGraph.jsx';
import MagGraph from './components/MagGraph.jsx';
import AcelGraph2 from './components/AcelGraph2.jsx';
import States from './components/States.jsx';
import CameraButton from "./components/CameraButton.jsx";


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
  
  const socketRef = io("http://localhost:5000");
  const USE_TEST_MODE = true; // switch to false for real sensor data
  
  useEffect(() => {

  
    socketRef.on("connect", () => {
      console.log("Socket connected");
      socketRef.emit(USE_TEST_MODE ? "test" : "data");
    });
  
    socketRef.on("json_response", (dataString) => {
      console.log(dataString);
      if (dataString){
      try {
        setSensorData(prevData => ({
          ...prevData,
          temp: [...prevData.temp, parseInt(dataString['temperature'])],
          pres: [...prevData.pres, parseInt(dataString['pressure'])],
          alt: [...prevData.alt, parseInt(dataString['altitude'])],
          acc_x_2: [...prevData.acc_x_2, parseFloat(dataString['acceleration']['x2'])],
          acc_y_2: [...prevData.acc_y_2, parseFloat(dataString['acceleration']['y2'])],
          acc_z_2: [...prevData.acc_z_2, parseFloat(dataString['acceleration']['z2'])],
          acc_x: [...prevData.acc_x, parseFloat(dataString['acceleration']['x'])],
          acc_y: [...prevData.acc_y, parseFloat(dataString['acceleration']['y'])],
          acc_z: [...prevData.acc_z, parseFloat(dataString['acceleration']['z'])],
          gyro_x: [...prevData.gyro_x, 0], 
          gyro_y: [...prevData.gyro_y, 0],
          gyro_z: [...prevData.gyro_z, 0],
          mag_x: [...prevData.mag_x, parseFloat(dataString['mag']['x'])],
          mag_y: [...prevData.mag_y, parseFloat(dataString['mag']['y'])],
          mag_z: [...prevData.mag_z, parseFloat(dataString['mag']['z'])],
          quat: {
            x: parseFloat(dataString['quaternion']['1']),
            y: parseFloat(dataString['quaternion']['3']),
            z: parseFloat(dataString['quaternion']['2']),
            w: parseFloat(dataString['quaternion']['4'])
          },
          state: [...prevData.state, 0],
          time: [...prevData.time, new Date(dataString['timestamp']).getTime()]
        }));
      } catch (err) {
        console.error("Data parse error:", err);
      }
      } 
    });
  
    socketRef.on("disconnect", () => {
      console.warn("Socket disconnected");
    });
  
    return () => {
      socketRef.off();
    };
  }, []);
  

  //command send function
  const sendCommand = (command) => {
    if (socketRef?.connected) {
      socketRef.emit("command", { command });
    } else {
      console.warn("Socket not connected.");
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
  const saveData = () => {
    if (!sensorData || !sensorData.time) return;
      const headers = [
        "time",
        "alt",
        "gyro_x", "gyro_y", "gyro_z",
        "acc_x", "acc_y", "acc_z",
        "acc_x_2", "acc_y_2", "acc_z_2",
        "mag_x", "mag_y", "mag_z"
      ];

      const rows = sensorData.time.map((_, index) => [
        sensorData.time[index] ?? "",
        sensorData.alt?.[index] ?? "",
        sensorData.gyro_x?.[index] ?? "",
        sensorData.gyro_y?.[index] ?? "",
        sensorData.gyro_z?.[index] ?? "",
        sensorData.acc_x?.[index] ?? "",
        sensorData.acc_y?.[index] ?? "",
        sensorData.acc_z?.[index] ?? "",
        sensorData.acc_x_2?.[index] ?? "",
        sensorData.acc_y_2?.[index] ?? "",
        sensorData.acc_z_2?.[index] ?? "",
        sensorData.mag_x?.[index] ?? "",
        sensorData.mag_y?.[index] ?? "",
        sensorData.mag_z?.[index] ?? ""
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sensor_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };
  return (
    <body className='bg-gray-800 font-serif'>
      <header className="page-title " >
        <div className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-50 shadow-lg flex flex-row justify-center">
          <p className="alignleft">
            <button className="reset-button" type="button" onClick={resetData}>Reset Data</button>
            <button className="reset-button" type="button" onClick={saveData}>Save Data</button>
          </p>
          <h1 style={{ fontSize: '2.5em', width: "33.33333%", textAlign:"center", float: "left"}}>
            UCI Rocket Project Solids - Ground Station
          </h1>
          <p className="alignright">
            <States stateData={sensorData['state']} />
          </p>
        </div>
      </header>

      <main>
        <div className="my-14 flex pt-8">
          <div>
            <AltGraph altData={sensorData['alt']} timeData={sensorData['time']}/>  
            
            <GyroGraph
              timeData={sensorData['time']}
              gyroDataX={sensorData['gyro_x']}
              gyroDataY={sensorData['gyro_y']}
              gyroDataZ={sensorData['gyro_z']}
            />
            
          </div>
          <div>
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
          </div>
          <div>
           <MagGraph
            timeData={sensorData['time']}
            magDataX={sensorData['mag_x']}
            magDataY={sensorData['mag_y']}
            magDataZ={sensorData['mag_z']}
            />
            <div className="text-center pr-10">
              <p className="text-lg text-white">
              Time: {sensorData?.['time']?.at(-1) !== undefined ? ((sensorData['time'].at(-1)-sensorData['time'].at(0))/1000/60).toFixed(2) : 'N/A'} |
              Altitude: {sensorData?.['alt']?.at(-1) !== undefined ? sensorData['alt'].at(-1).toFixed(2) : 'N/A'} |
              Temperature: {sensorData?.['temp']?.at(-1) !== undefined ? sensorData['temp'].at(-1).toFixed(2) : 'N/A'} |
              Pressure: {sensorData?.['pres']?.at(-1) !== undefined ? sensorData['pres'].at(-1).toFixed(2) : 'N/A'}
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
                  <td className="border border-gray-500 px-4 py-2">{typeof sensorData?.['acc_x']?.at(-1) === 'number' ? sensorData['acc_x'].at(-1).toFixed(2) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof sensorData?.['acc_y']?.at(-1) === 'number' ? sensorData['acc_y'].at(-1).toFixed(2) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof sensorData?.['acc_z']?.at(-1) === 'number' ? sensorData['acc_z'].at(-1).toFixed(2) : 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-500 px-4 py-2">Acceleration LIS</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof sensorData?.['acc_x_2']?.at(-1) === 'number' ? sensorData['acc_x_2'].at(-1).toFixed(2) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof sensorData?.['acc_y_2']?.at(-1) === 'number' ? sensorData['acc_y_2'].at(-1).toFixed(2) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof sensorData?.['acc_z_2']?.at(-1) === 'number' ? sensorData['acc_z_2'].at(-1).toFixed(2) : 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-500 px-4 py-2">Angular Speed</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof sensorData?.['gyro_x']?.at(-1) === 'number' ? sensorData['gyro_x'].at(-1).toFixed(2) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof sensorData?.['gyro_y']?.at(-1) === 'number' ? sensorData['gyro_y'].at(-1).toFixed(2) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof sensorData?.['gyro_z']?.at(-1) === 'number' ? sensorData['gyro_z'].at(-1).toFixed(2) : 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-500 px-4 py-2">Magnetometer</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof sensorData?.['mag_x']?.at(-1) === 'number' ? sensorData['mag_x'].at(-1).toFixed(2) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof sensorData?.['mag_y']?.at(-1) === 'number' ? sensorData['mag_y'].at(-1).toFixed(2) : 'N/A'}</td>
                  <td className="border border-gray-500 px-4 py-2">{typeof sensorData?.['mag_z']?.at(-1) === 'number' ? sensorData['mag_z'].at(-1).toFixed(2) : 'N/A'}</td>
                </tr>
                
                </tbody>
              </table>
              <CameraButton/>
            </div>
          </div>
          
        </div>
      </main>

      <footer className="flex flex-row justify-center items-center bg-gray-800 text-white p-4 flex">
        <div className="justify-center">
          <Model quaternion={sensorData?.['quat']} />
        </div>
      </footer>
    </body>
  );
}

export default App;
import React, { useState } from 'react';

export default function CameraButton({ voltage1, voltage2 }) {
  const isOn1 = voltage1 <50;
  const isOn2 = voltage2 <50;
  const [MP, setMPFired] = useState(false);
  const [MS, setMSFired] = useState(false);
  const [DP, setDPFired] = useState(false);
  const [DS, setDSFired] = useState(false);

  const onClick1 = async () => {
    console.log("Cam 1 button pressed")
    let res;
    if (!isOn1) {
      res = await fetch('http://localhost:7000/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: "Cam1on" }),
      });
    } else {
      res = await fetch('http://localhost:7000/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: "Cam1off" }),
      });
    }
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    } else {
      const data = await res.json();
      // if (data.state === "on") {
      //   setIsOn1(true);
      // } else {
      //   setIsOn1(false);
      // }
    }
  };

  const onClick2 = async () => {
    console.log("Cam 2 button pressed")
    let res;
    if (!isOn2) {
      res = await fetch('http://localhost:7000/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: "Cam2on" }),
      });
    } else {
      res = await fetch('http://localhost:7000/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: "Cam2off" }),
      });
    }
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    } else {
      const data = await res.json();
      // if (data.state === "on") {
      //   setIsOn2(true);
      // } else {
      //   setIsOn2(false);
      // }
    }
  };

  const handleButtonClick = async (stateName, isActive, setActive) => {
    const res = await fetch('http://localhost:7000/command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state: `${stateName}` }),
    });
    console.log("firing button pressed")
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    } else {
      const data = await res.json();
      setActive(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <button
        className="camera-button"
        onClick={onClick1}
        style={{
          backgroundColor: isOn1 ? "green" : "red",
          border: "none",
          cursor: "pointer",
          padding: "10px",
        }}
      >
        Cam 1 is {isOn1 ? "On" : "Off"}
      </button>

      <button
        className="camera-button"
        onClick={onClick2}
        style={{
          backgroundColor: isOn2 ? "green" : "red",
          border: "none",
          cursor: "pointer",
          padding: "10px",
        }}
      >
        Cam 2 is {isOn2 ? "On" : "Off"}
      </button>

      <button
        className="camera-button"
        onClick={() => handleButtonClick("MP", MP, setMPFired)}
        style={{
          border: "none",
          cursor: "pointer",
          padding: "10px",
        }}
      >
        Main Primary is {MP ? "Fired" : "Not Fired"}
      </button>

      <button
        className="camera-button"
        onClick={() => handleButtonClick("MS", MS, setMSFired)}
        style={{
          border: "none",
          cursor: "pointer",
          padding: "10px",
        }}
      >
        Main Secondary is {MS ? "Fired" : "Not Fired"}
      </button>

      <button
        className="camera-button"
        onClick={() => handleButtonClick("DP", DP, setDPFired)}
        style={{
          border: "none",
          cursor: "pointer",
          padding: "10px",
        }}
      >
        Drogue Primary is {DP ? "Fired" : "Not Fired"}
      </button>

      <button
        className="camera-button"
        onClick={() => handleButtonClick("DS", DS, setDSFired)}
        style={{
          border: "none",
          cursor: "pointer",
          padding: "10px",
        }}
      >
        Drogue Secondary is {DS ? "Fired" : "Not Fired"}
      </button>
    </div>
  );
}

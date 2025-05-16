import React, { useState } from 'react';

export default function CameraButton() {
  const [isOn, setIsOn] = useState(false);
  const [MP, setMPFired] = useState(false);
  const [MS, setMSFired] = useState(false);
  const [DP, setDPFired] = useState(false);
  const [DS, setDSFired] = useState(false);
  const onClick = async() => {
    console.log("Camera button pressed")
    let res;
    if(!isOn){
        res = await fetch('http://localhost:7000/command', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ state: "on" }),
        });
    }
    else{
        res = await fetch('http://localhost:7000/command', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ state: "off" }),
        });
    }
    if (!res.ok) {
        // Handle HTTP errors (e.g., 400, 500)

        throw new Error(`HTTP error! Status: ${res.status}`);
    }
    else{
        const data = await res.json();
        if(data.state === "on"){
          setIsOn(true);
        }
        else{
          setIsOn(false);
        }
       
    }

  };
const handleButtonClick = async (stateName, isActive, setActive) => {
  const res = await fetch('http://localhost:7000/command', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ state: `${stateName}` }), // directly send MP, MS, DP, or DS
  });
  console.log("firing button pressed")
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  } else {
    const data = await res.json();
    setActive(true); // always set to true after firing
  }
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <button
        className="camera-button"
        onClick={onClick}
        style={{
          backgroundColor: isOn ? "green" : "red",
          border: "none",
          cursor: "pointer",
          padding: "10px",
        }}
      >
        Camera is {isOn ? "On" : "Off"}
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

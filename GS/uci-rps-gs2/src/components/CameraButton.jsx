import React, { useState } from 'react';
export default function CameraButton( ) {
  const [isOn, setIsOn] = useState(false);
  const onClick = async() => {
    let res;
    if(!isOn){
        res = await fetch('http://localhost:5000/camera', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ state: "on" }),
        });
    }
    else{
        res = await fetch('http://localhost:5000/camera', {
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

  return (
    
    
    <button
      className="camera-button"
      onClick={onClick}
      style={{
        backgroundColor: (isOn)? "green" : "red",
        border: "none",
        cursor: "pointer",
        padding: "0",
      }}
    >
        Camera On/Off
    </button>
  );
}
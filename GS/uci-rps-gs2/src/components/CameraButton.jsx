export default function CameraButton({isOn }) {
  onClick = async() => {
    if(!isOn){
        const res = await fetch('http://localhost:5000/camera', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ state: "on" }),
        });
    }
    else{
        const res = await fetch('http://localhost:5000/camera', {
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

  };

  return (
    
    
    <button
      className="camera-button"
      onClick={onClick}
      style={{
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "0",
      }}
    >
        Camera On/Off
    </button>
  );
}
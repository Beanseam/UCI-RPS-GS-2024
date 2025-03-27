// import { WebSocketService } from "../services/websocket.ts";

// export const SendCommandButton = () => {
//     const wsService = new WebSocketService("ws://localhost:8765"); // Adjust URL if necessary

//     const sendCommand = () => {
//         wsService.sendMessage("ON"); 
//     };

//     return (
//         <button 
//             onClick={sendCommand} 
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
//             Send Command
//         </button>
//     );
// };

// // export default SendCommandButton;

import React, { useState } from "react";

// WebSocketHandler class for managing WebSocket communication
class WebSocketHandler {
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;

  constructor() {
    this.ws = new WebSocket("ws://localhost:8765/");

    this.ws.onopen = () => {
      console.log("WebSocket Connected");
      this.isConnected = true;
    };

    this.ws.onclose = () => {
      console.log("WebSocket Disconnected");
      this.isConnected = false;
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket Error", error);
      this.isConnected = false;
    };
  }

  // Method to send a message
  sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
      console.log("Message Sent:", message);
    } else {
      console.warn("WebSocket is not connected. Cannot send message.");
    }
  }
}

export const SendCommandButton = () => {
  // Track the button state, initially OFF
  const [state, setState] = useState("OFF");
  const websocketHandler = new WebSocketHandler();

  // Handle button press to toggle state
  const handleToggleState = () => {
    // Toggle between "ON" and "OFF"
    const newState = state === "OFF" ? "ON" : "OFF";
    setState(newState); // Update button label

    // Send the new state to WebSocket
    websocketHandler.sendMessage(newState);
  };

  return (
    <div>
      <button onClick={handleToggleState}>
        {state === "OFF" ? "Turn ON" : "Turn OFF"}
      </button>
    </div>
  );
};

// export default SendCommandButton;

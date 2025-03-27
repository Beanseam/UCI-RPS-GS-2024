import { useState, useEffect } from "react";
import { WebSocketService } from '../services/websocket.ts'; // Custom wesocket

const STATUS_MESSAGES: { [key: number]: string } = {
  0: "🚀 Armed",
  1: "🔥 Launch",
  2: "🪂 Drogue Deployed",
  3: "🪂 Main Deployed",
};

const Alert = () => {
  const [status, setStatus] = useState<number | null>(null);
  const [webSocketService, setWebSocketService] = useState<WebSocketService | null>(null);

  useEffect(() => {
    const wsService = new WebSocketService("ws://localhost:8765");
    setWebSocketService(wsService);
    wsService.connect();

    wsService.addListener((message) => {
      const values = message.split(",").map(Number);
      if (values.length > 0) {
        const lastValue = values[values.length - 1]; // Assuming last value in serial data is the status
        if (STATUS_MESSAGES.hasOwnProperty(lastValue)) {
          setStatus(lastValue);
        }
      }
    });

    return () => wsService.close();
  }, []);

  return (
    <div className="p-4 text-center text-white font-bold text-lg bg-gray-800 rounded-lg">
      <p>{status !== null ? STATUS_MESSAGES[status] : "Waiting for Data..."}</p>
    </div>
  );
};

export default Alert;

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { WebSocketService } from "../services/websocket.ts";


const MAX_DATA_POINTS = 100;


const WebSocketTest = () => {
  const [data, setData] = useState<{ time: number; accX: number; accY: number; accZ: number }[]>([]);
  const [webSocketService, setWebSocketService] = useState<WebSocketService | null>(null);

  useEffect(() => {
    const wsService = new WebSocketService("ws://localhost:8765");
    setWebSocketService(wsService);
    wsService.connect();

    wsService.addListener((message) => {
      const values = message.split(",").map(Number); // Convert CSV string to numbers
      if (values.length >= 6) { // Ensure there are enough values
        const newData = {
          time: Date.now(), // Timestamp for X-axis
          accX: values[3],  // 4th value (Index 3)
          accY: values[4],  // 5th value (Index 4)
          accZ: values[5],  // 6th value (Index 5)
        };

        setData((prevData) => [...prevData.slice(-MAX_DATA_POINTS), newData]); // Keep only last 50 points
      }
    });

    return () => wsService.close(); // Cleanup WebSocket on unmount
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Accelerometer Data</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
          <Line type="monotone" dataKey="accX" stroke="red" name="Acc X" />
          <Line type="monotone" dataKey="accY" stroke="blue" name="Acc Y" />
          <Line type="monotone" dataKey="accZ" stroke="green" name="Acc Z" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WebSocketTest;

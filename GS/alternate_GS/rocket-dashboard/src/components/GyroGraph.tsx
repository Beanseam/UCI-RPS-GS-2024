// Imports

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WebSocketService } from '../services/websocket.ts'; // Custom wesocket

const MAX_DATA_POINTS = 100; // Maximum data points to display
const DATA_POINTS = 20; // Number of data points being sent by the server
const GyroGraph = () => {
    const [data, setData] = useState<{ time: number; gyroX: number; gyroY: number; gyroZ: number }[]>([]);
    const [webSocketService, setWebSocketService] = useState<WebSocketService | null>(null);

    useEffect(() => {
    const wsService = new WebSocketService("ws://localhost:8765");
    setWebSocketService(wsService);
    wsService.connect();

    wsService.addListener((message) => {
        const values = message.split(",").map(Number); // Convert CSV string to numbers
        if (values.length == DATA_POINTS) { // Ensure there are enough values
        const newData = {
            time: Date.now(), 
            gyroX: values[9],  
            gyroY: values[10],  
            gyroZ: values[11],  
        };

        setData((prevData) => [...prevData.slice(-MAX_DATA_POINTS), newData]); 
        }
    });

    return () => wsService.close();
    }, []);


    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Gyroscope (rad/s)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
                    <YAxis/>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                    <Line type="monotone" dataKey="gyroX" stroke="red" name="Gyro X" />
                    <Line type="monotone" dataKey="gyroY" stroke="blue" name="Gyro Y" />
                    <Line type="monotone" dataKey="gyroZ" stroke="green" name="Gyro Z" />
                </LineChart>
            </ResponsiveContainer>
        </div>

    );
};

export default GyroGraph;
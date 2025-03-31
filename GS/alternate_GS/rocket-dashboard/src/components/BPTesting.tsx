import { WebSocketService } from "../services/websocket.ts";

export const BPTesting = () => {
    const wsService = new WebSocketService("ws://localhost:8765"); // Adjust URL if necessary

    const sendMainP = () => {
        wsService.sendMessage("Fire Main P"); 
    };
    const sendMainS = () => {
        wsService.sendMessage("Fire Main S"); 
    };
    const sendDrogueP = () => {
        wsService.sendMessage("Fire Drogue P"); 
    };
    const sendDrogueS = () => {
        wsService.sendMessage("Fire Drogue S"); 
    };

    return (
        <div>
            <button 
                onClick={sendMainP} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                Fire Main Primary
            </button>
            <button 
                onClick={sendMainS} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                Fire Main Secondary
            </button>
            <button 
                onClick={sendDrogueP} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                Fire Drogue Primary
            </button>
            <button 
                onClick={sendDrogueS} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                Fire Drogue Secondary
            </button>
        </div>
    );
};

// export default BPTesting;
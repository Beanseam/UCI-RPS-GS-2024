import asyncio
import websockets
import serial
import serial.tools.list_ports
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(levelname)s - %(message)s')

BAUD_RATE = 57600
HOST = '0.0.0.0'  
PORT = 8765

connected_clients = set()

def port_selection():
    """Function to prompt user to choose a port from a list of available options"""
    
    # Get list of available ports
    ports = serial.tools.list_ports.comports()
    logging.info("Available ports:")
    for i, port in enumerate(ports):
        logging.info(f"{i}: {port.device}")
    
    # Prompt user to choose a port
    selected_port = None
    while selected_port is None:
        try:
            port_index = int(input("\nSelect a port: "))
            if 0 <= port_index < len(ports):
                selected_port = ports[port_index].device
                logging.info(f"{selected_port} selected.")
                return selected_port
            else:
                logging.warning("Invalid port selection. Please try again.")
        except ValueError:
            logging.warning("Invalid port selection. Please try again.")
            
def open_serial(port: str):
    """Function to open a serial connection to the specified port"""
    
    try:
        ser = serial.Serial(port, BAUD_RATE, timeout=1)
        logging.info(f"Serial port {port} opened successfully.")
        return ser
    except serial.SerialException as e:
        logging.error(f"Error opening serial connection: {e}")
        return None
        
async def read_serial(ser: serial.Serial, broadcast_queue: asyncio.Queue):
    """Function to read data from the serial connection and put it in a queue"""
    
    while True:
        try:
            if ser.in_waiting > 0:
                data = ser.readline().decode().strip()
                if data:
                    logging.info(f"Serial Data: {data}")
                    await broadcast_queue.put(data)
                    
        except Exception as e:
            logging.error(f"Error reading serial data: {e}")
            break
        
        await asyncio.sleep(0.01)
                    
async def broadcast(broadcast_queue: asyncio.Queue, connected_clients: set):
    """Function to send data to all connected websockets"""
    
    while True:
        data = await broadcast_queue.get()
        if connected_clients:
            websocket_tasks = [
                client.send(data) for client in connected_clients
            ]
            await asyncio.gather(*websocket_tasks, return_exceptions=True)
        broadcast_queue.task_done()
        
async def handle_client(websocket):
    """Websocket handler function"""
    
    try:
        # Add more detailed logging
        logging.info(f"Client connected: {websocket.remote_address}")
        
        # Use a context manager to ensure proper handling
        async with websocket:
            connected_clients.add(websocket)
            
            # Keep the connection open and listen for any messages
            await websocket.wait_closed()
    
    except websockets.exceptions.ConnectionClosed:
        logging.info(f"Client disconnected: {websocket.remote_address}")
    
    finally:
        # Ensure the client is removed from connected clients
        if websocket in connected_clients:
            connected_clients.remove(websocket)
        
async def main():
    """Main function to run the event loop"""
    
    # Create a queue for broadcasting
    broadcast_queue = asyncio.Queue()
    
    # Select and open serial port
    port = port_selection()
    ser = open_serial(port)
    
    if ser is None:
        logging.error("Failed to open serial port. Exiting.")
        return
    
    try:
        # Start WebSocket server
        server = await websockets.serve(
            handle_client, 
            host=HOST, 
            port=PORT,
            # Add these parameters to improve WebSocket handling
            ping_interval=20,
            ping_timeout=20
        )
        logging.info(f"WebSocket server started on {HOST}:{PORT}")
        
        # Run serial reading and broadcasting concurrently
        await asyncio.gather(
            read_serial(ser, broadcast_queue),
            broadcast(broadcast_queue, connected_clients),
            server.wait_closed()
        )
    
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
    
    finally:
        # Ensure serial port is closed
        if ser:
            ser.close()
            logging.info("Serial port closed.")
    
if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Server stopped by user.")
from flask import Flask, jsonify, request
from flask_cors import CORS
import serial
import threading
import sys
from collections import deque, defaultdict
import datetime
import json
import csv_log
import serial.tools.list_ports
from flask_socketio import SocketIO
import random
import math
import time


SERIAL_PORT = 'COM6'
#/dev/tty.usbserial-B000J0YT for MAC
SERIAL_BAUDRATE = 57600 #57600
sensor_data_lock = threading.Lock()
test_lock = threading.Lock()
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "supports_credentials": True}})

sensor_data = {}
test_data = {}

def select_port():
    print("Press y for testing mode, any other key for serial mode: ")
    test_mode = input().strip().lower() == 'y'
    if test_mode:
        print("Running in test mode...")
        return None

    print("Searching for serial ports...")  
    ports = serial.tools.list_ports.comports()
    if not ports:
        print("No serial ports found. Exiting.")
        sys.exit(1)

    print("Available ports:")
    for i, port in enumerate(ports):
        print(f"{i}: {port}")
        print(f"   Device: {port.device}")
        print(f"   Description: {port.description}")
        print(f"   Hardware ID: {port.hwid}")
        print("-" * 40)


    while True:
        try:
            port_index = int(input("Select a port: "))
            if 0 <= port_index < len(ports):
                return ports[port_index].device
            print("Invalid port index.")
        except ValueError:
            print("Please enter a valid number.")

def read_test():
    global test_data
    altitude = 0.0
    velocity = 0.0
    acceleration_z = 0.0
    t = 0.0  # time in seconds
    dt = 0.1  # simulation timestep (100ms)

    while True:
        with test_lock:
            # Simulated flight phases
            if t < 5:
                # Pre-launch idle
                acceleration_z = 0.0
            elif t < 10:
                # Boost phase (acceleration up)
                acceleration_z = random.uniform(9.8, 15.0)
                velocity += acceleration_z * dt
                altitude += velocity * dt
            elif t < 15:
                # Coasting phase
                acceleration_z = -9.8  # Gravity
                velocity += acceleration_z * dt
                altitude += velocity * dt
            else:
                # Descent
                acceleration_z = -9.8 + random.uniform(-1, 1)
                velocity += acceleration_z * dt
                altitude = max(0.0, altitude + velocity * dt)

            # Noise for realism
            noisy_temp = 25.0 + random.uniform(-1, 1)
            noisy_pressure = 1013.25 - altitude * 0.12 + random.uniform(-1, 1)
            noisy_mag = lambda: random.uniform(-50, 50)

            # Simulate orientation change using sin/cos wave for quaternions
            if altitude!=0:

                next_alt=10
                if altitude>next_alt:
                    q1+=0.05
                    next_alt+=15
            if altitude==0:
                q1 = 0.0                     # x
                q2 = 0.0                     # y
                q3 = 0.0     # z
                q4 = 1     # w

            test_data['temperature'] = noisy_temp
            test_data['pressure'] = noisy_pressure
            test_data['altitude'] = max(0.0, altitude)
            test_data['acceleration'] = {
                'x2': random.uniform(-1, 1),
                'y2': random.uniform(-1, 1),
                'z2': acceleration_z + random.uniform(-0.5, 0.5),
                'x': random.uniform(-0.2, 0.2),
                'y': random.uniform(-0.2, 0.2),
                'z': acceleration_z
            }
            test_data['mag'] = {
                'x': noisy_mag(),
                'y': noisy_mag(),
                'z': noisy_mag()
            }
            test_data['quaternion'] = {
                '1': q1,
                '2': q2,
                '3': q3,
                '4': q4
            }
            #test_data['timestamp'] = datetime.datetime.now().isoformat()

        time.sleep(dt)
        t += dt

def read_serial(serial_port, baudrate):
    global sensor_data
    global data
    print('Reading serial data...')

    try: 
        ser = serial.Serial(serial_port, baudrate) # for Windows
    except serial.SerialException as e:
        print(f"read_serial Error: {e}")
        
        sys.exit(1)

    try:
        while True:

            line = ser.readline().decode("utf-8").strip()
            
            data_list = line.split(',')

            if len(data_list)<19:
                continue
            with sensor_data_lock:
                #print(data_list)
                sensor_data['temperature'] = data_list[0]
                sensor_data['press'] = data_list[1]
                sensor_data['altitude'] = data_list[2]
                sensor_data['acceleration'] = {
                        'x2': data_list[3],
                        'y2': data_list[4],
                        'z2': data_list[5],
                        'x': data_list[6],
                        'y': data_list[7],
                        'z': data_list[8]
                }
                sensor_data['gyro'] ={
                        'x': data_list[9],
                        'y': data_list[10],
                        'z': data_list[11]
                }
                sensor_data['mag'] = {
                        'x': data_list[12],
                        'y': data_list[13],
                        'z': data_list[14]
                }
                sensor_data['quaternion'] = {

                        '1': data_list[15],
                        '2': data_list[16],
                        '3': data_list[17],
                        '4': data_list[18]
                }

                sensor_data['timestamp'] = datetime.datetime.now().isoformat()
                #csv_log.write_to_csv(csv_log.flatten_data(sensor_data))
#                  if(len(data_list) > 16):
#                   sensor_data['camera'] = data_list[16]
            time.sleep(0.3)
           
             
          
    except serial.SerialException as e:
        print(f"Serial Error: {e}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        ser.close()
  

@socketio.on('connect')
def connect():
    print('Client connected')
    socketio.emit('Connected', {'data': 'Connected to server'})
    
@socketio.on('data')
def get_data():
    global sensor_data
    if not sensor_data:
        socketio.emit('Error', {"error": "No data available"})
    while True:
        time.sleep(0.1)
        with sensor_data_lock:
            socketio.emit('json_response', sensor_data)

@app.route('/data', methods=['GET'])
def get_data_api():
    global sensor_data
    if not sensor_data:
        return jsonify({"error": "No data available"})
    with sensor_data_lock:
        return jsonify(sensor_data)

@socketio.on('test')
def get_test_data():
    print('test socket')
    global test_data
    if not test_data:
        socketio.emit('Error', {"error": "No data available"})
    while True:
        time.sleep(0.1)
        with sensor_data_lock:
            socketio.emit('json_response', test_data)

@app.route('/test', methods=['GET'])
def get_test_data_api():
    global test_data
    if not test_data:
        return jsonify({"error": "No data available"})
    with test_lock:
        return jsonify(test_data)

def send_command(command):
    try:
        with serial.Serial(SERIAL_PORT, SERIAL_BAUDRATE) as ser:
            print(f"Sending command: {command}")
            ser.write(command.encode())
            # ser.flush()
    except Exception as e:
        print(f"Error: {e}")

@app.route('/camera', methods=['POST'])
def send_data():
   # print("Received POST request")
    try:
        state = request.json["state"]
        if state == "on":
            send_command("ON")
        elif state == "off":
            send_command("OFF")

        elif state == "MP":
            send_command("Fire Main P")

        elif state == "MS":
            send_command("Fire Main S")

        elif state == "DP":
            send_command("Fire Drogue P")

        elif state == "DS":
            send_command("Fire Drogue S")
        return jsonify({"status" : "OK", "state": state})
    except Exception as e:
        return jsonify({"status": "Error", "error": str(e)})


def start_serial_thread():
    serial_thread = threading.Thread(target=read_serial, daemon = True, args=(SERIAL_PORT, SERIAL_BAUDRATE))
    serial_thread.start()
    return serial_thread

def start_test_thread():
    test_thread = threading.Thread(target=read_test, daemon = True)
    test_thread.start()
    return test_thread

if __name__ == '__main__':
    SERIAL_PORT = select_port()
    if SERIAL_PORT is None:
        start_test_thread()
    else:
        start_serial_thread()

    socketio.run(app, host="0.0.0.0", port=5000, debug=True, allow_unsafe_werkzeug=True, use_reloader=False)

    
    
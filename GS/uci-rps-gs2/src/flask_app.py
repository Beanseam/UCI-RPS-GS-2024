from flask import Flask, jsonify, request
from flask_cors import CORS
import serial
import threading
from threading import Thread
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

app_api = Flask(__name__ + "_api")
CORS(app_api, resources={r"/*": {"origins": "http://localhost:3000"}})

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
            with test_lock:
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
                test_data['timestamp'] = datetime.datetime.now().isoformat()
            socketio.emit('json_response', test_data)
        time.sleep(dt)
        t += dt

def read_serial(ser):
    global sensor_data
    print('Reading serial data...')

    print("Serial data reading thread started.")
    try:
        while True:
            raw_line = ser.readline()
            if not raw_line:
                time.sleep(0.01)
                continue
            line = raw_line.decode("utf-8", errors='ignore').strip()
            data_list = line.split(',')

            if len(data_list) < 19:
                continue
            try:
                current_data = {
                    'temperature': float(data_list[0]),
                    'press': float(data_list[1]), 
                    'altitude': float(data_list[2]),
                    'acceleration': {
                        'x2': float(data_list[3]), 'y2': float(data_list[4]), 'z2': float(data_list[5]),
                        'x': float(data_list[6]), 'y': float(data_list[7]), 'z': float(data_list[8])
                    },
                    'gyro': {
                        'x': float(data_list[9]), 'y': float(data_list[10]), 'z': float(data_list[11])
                    },
                    'mag': {
                        'x': float(data_list[12]), 'y': float(data_list[13]), 'z': float(data_list[14])
                    },
                    'quaternion': {
                        '1': float(data_list[15]), '2': float(data_list[16]),
                        '3': float(data_list[17]), '4': float(data_list[18])
                    },
                    'timestamp': datetime.datetime.now().isoformat()
                }
            except ValueError as e:
                print(f"ValueError: {e} - Line: {line} - len: {len(data_list)}")
                continue

            with sensor_data_lock:
                sensor_data = current_data
            socketio.emit('json_response', current_data)

    except serial.SerialException as e:
        print(f"Serial Error: {e}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if ser.is_open:
            print("Closing serial port.")
            ser.close()

  

@socketio.on('connect')
def connect():
    print(f'Client connected {request.sid}')
    socketio.emit('Connected', {'data': 'Connected to server'})
    
@socketio.on('disconnect')
def disconnect():
    print(f'Client disconnected {request.sid}')
    socketio.emit('Disconnected', {'data': 'Disconnected from server'})

@app.route('/test', methods=['GET'])
def get_data_api():
    global test_data

    data_copy = None
    with test_lock:
        data_copy = test_data.copy()
    if not data_copy:
        return jsonify({"error": "No data available"})
    return jsonify(data_copy)

@app.route('/data', methods=['GET'])
def get_test_data_api():
    global sensor_data
   
    data_copy = None
    with sensor_data_lock:
        data_copy = sensor_data.copy()

    if not data_copy: return jsonify({"error": "No data available"})
    return jsonify(data_copy)

def send_command(command):
    global serial_instance
    try:
        if serial_instance and serial_instance.is_open:
            print(f"Sending command: {command}")
            serial_instance.write(command.encode())
            return True
        else:
            print("Serial port is not open.")
            return False
    except Exception as e:
        print(f"Error while sending command: {e}")
        return False
    
def run_command_api():
    app_api.run(host="0.0.0.0", port=7000, debug=False)

@app_api.route('/command', methods=['POST'])
def send_data():
    print("Received POST request")
    try:
        state = request.json["state"]
        response = None
        if state == "on":
            print("Camera On")
            send_command("ON")
        elif state == "off":
            print("Camera Off")
            send_command("OFF")

        elif state == "MP":
            print("MP fired")
            send_command("Fire Main P")

        elif state == "MS":
            print("MS fired")
            send_command("Fire Main S")

        elif state == "DP":
            print("DP fired")
            send_command("Fire Drogue P")

        elif state == "DS":
            print("DS Fired")
            send_command("Fire Drogue S")
        return jsonify({"status" : "OK", "state": state})
    except Exception as e:
        return jsonify({"status": "Error", "error": str(e)})


def start_serial_thread():
    global serial_instance
    try:
        serial_instance = serial.Serial(SERIAL_PORT, SERIAL_BAUDRATE, timeout=1)
        serial_thread = threading.Thread(target=read_serial, daemon=True, args=(serial_instance,))
        serial_thread.start()
        return serial_thread
    except Exception as e:
        print(f"Failed to start serial thread: {e}")
        return None

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
    Thread(target=run_command_api).start()
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, allow_unsafe_werkzeug=True, use_reloader=False)
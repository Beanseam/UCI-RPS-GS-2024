from flask import Flask, jsonify
from flask_cors import CORS
import serial
import threading
import sys
from collections import deque, defaultdict
import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "supports_credentials": True}})

sensor_data = {}
sensor_data_lock = threading.Lock()
def read_serial( port='COM5', baudrate=57600):
    global sensor_data
    global data
    print('Reading serial data...')
    try: 
        ser = serial.Serial(port, baudrate) # for Windows
        # ser = serial.Serial('/dev/tty.usbserial-B000J0YT', 57600) # for Mac
    except serial.SerialException as e:
        print(f"Error: {e}")
        sys.exit(1)

    try:
        while True:
    
            line = ser.readline().decode("utf-8").strip()
            # print(line)
            # print(type(line))
            data_list = line.split(',')
            # print(data_list)
            if len(data_list) == 3:
                with sensor_data_lock:
                    sensor_data['acceleration'] = (data_list[0], data_list[1], data_list[2]) 
                    sensor_data['timestamp'] = datetime.datetime.now()#.isoformat()

            print(sensor_data['acceleration'])
            print(sensor_data['timestamp'])
    except ValueError:
        print("Invalid sensor data format: ValueError")
    except serial.SerialException as e:
        print(f"Serial Error: {e}")
    except:
        print("Error: Unknown")
    finally:
        ser.close()

        
def start_serial_thread():
    serial_thread = threading.Thread(target=read_serial, daemon = True )

    serial_thread.start()
    return serial_thread

@app.route('/data')
def get_data():
    """
    Return the most recently read sensor data in JSON form.
    If data is not yet available, return an error message with status 503.
    """
    # print("REQUEST RECEIVED")
    # print(jsonify(sensor_data))
    # print("----------------")
    with sensor_data_lock:
        if not sensor_data:
            return jsonify({"error": "No data available"}), 503

        return jsonify({
            "acceleration": { 
                x: sensor_data['acceleration'][0],
                y: sensor_data['acceleration'][1],
                z: sensor_data['acceleration'][2]
            },
        })

    # return sensor_data

if __name__ == '__main__':
    start_serial_thread()
    app.run(debug=True)
    

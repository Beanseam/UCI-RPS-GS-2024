from flask import Flask, jsonify
from flask_cors import CORS
import serial
import threading


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "supports_credentials": True}})

sensor_data = ''

def read_serial():
    global sensor_data
    ser = serial.Serial('COM4', 57600) # for Windows
    # ser = serial.Serial('/dev/tty.usbserial-B000J0YT', 57600) # for Mac
    while True:
        line = ser.readline().strip().decode()
        # print(line)
        # print(type(line))
        data_list = line.split(',')
        # print(data_list)
        if len(data_list) == 15:
            try:
                sensor_data = line
            except ValueError:
                print("Invalid sensor data format")

serial_thread = threading.Thread(target=read_serial)
serial_thread.daemon = True
serial_thread.start()

@app.route('/data')
def get_data():
    # print("REQUEST RECEIVED")
    print(sensor_data)
    # print(jsonify(sensor_data))
    # print("----------------")
    return jsonify(sensor_data)
    # return sensor_data

if __name__ == '__main__':
    app.run(debug=True)

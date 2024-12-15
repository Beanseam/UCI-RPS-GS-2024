from flask import Flask, jsonify
from flask_cors import CORS
import serial
import serial.tools.list_ports


app = Flask(__name__)
CORS(app, origins="http://localhost:3000", support_credentials=True)

sensor_data = ''


def read_serial():
    global sensor_data
    ser = serial.Serial('COM4', 57600) # for Windows
    # ser = serial.Serial('/dev/tty.usbserial-B000J0YT', 57600) # for Mac
    if not ser.isOpen():
        ser.open()
    print('com4 is open', ser.isOpen())
    ports = serial.tools.list_ports.comports()
    for port in ports:
        print(f"Found port: {port.device}")
    line = ser.readline()
    ser.close()

import threading
serial_thread = threading.Thread(target=read_serial)
#serial_thread.daemon = True
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

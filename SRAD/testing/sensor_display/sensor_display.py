import sys
import serial
import pyqtgraph as pg
from pyqtgraph.Qt import QtWidgets, QtCore
import serial.tools.list_ports
from collections import deque
import csv
from datetime import datetime

# List available serial ports
ports = serial.tools.list_ports.comports()
print("Available Serial Ports:")
for i, port in enumerate(ports, start=1):
    print(f"{i}: {port.device}")

# Prompt user to select a port
while True:
    try:
        choice = int(input("Select the serial port RFD900x is connected to: "))
        if 1 <= choice <= len(ports):
            serial_port = ports[choice - 1].device
            print(f"You selected: {serial_port}")
            break
        else:
            print("Invalid Selection. Please select a valid number.")
    except ValueError:
        print("Invalid Input. Please enter a number.")

# Serial port configuration
baud_rate = 57600
update_interval = 0  # Set a reasonable update interval to improve responsiveness


# Sensor labels
LABELS = [
    "Temp", "Press", "Alt", "Accel_x2", "Accel_y2", "Accel_z2",
    "Accel_x", "Accel_y", "Accel_z", "Gyro_x", "Gyro_y", "Gyro_z",
    "Mag_x", "Mag_y", "Mag_z", "Quaternion_1", "Quaternion_2", "Quaternion_3", "Quaternion_4",
    "stage", "launch_flag", "drogue_flag", "main_flag"
]


# Open the serial 
try:
    ser = serial.Serial(serial_port, baud_rate, timeout=1)
except serial.SerialException as e:
    print(f"Error: {e}")
    sys.exit(1)

# Initialize PyQtGraph
app = QtWidgets.QApplication([])
win = pg.GraphicsLayoutWidget(show=True, title="Sensor Data")
win.resize(1200, 800)  # Return to original size
win.setWindowTitle('Sensor Data Plot')

# Create plots
plots = []
curves = []
text_items = []
for i, label in enumerate(LABELS):
    if i % 4 == 0 and i != 0:
        win.nextRow()
    plot = win.addPlot(title=label)
    curve = plot.plot(pen=pg.mkPen(color=(i*15 % 255, i*30 % 255, i*45 % 255)))
    
    # Set y-range based on the type of data
    if label == "Press":
        plot.setYRange(0, 2000)  # Higher range for pressure (hPa/Pascal values)
    else:
        plot.setYRange(-100, 100)  # Default range for other sensors
    
    text_item = pg.TextItem(anchor=(0.5, 1.0), color=(255, 255, 255))
    plot.addItem(text_item)
    plots.append(plot)
    curves.append(curve)
    text_items.append(text_item)

# Add a status box
win.nextRow()
status_plot = win.addPlot(title="Status")
status_plot.hideAxis('left')
status_plot.hideAxis('bottom')
status_text = pg.TextItem(text="ARMED", anchor=(0.5, 0.5), color=(255, 255, 255))
status_text.setHtml('<div style="text-align: center"><span style="font-size: 48pt; font-weight: bold;">ARMED</span></div>')
status_plot.addItem(status_text)
status_view = status_plot.getViewBox()
status_view.setBackgroundColor('r')
win.addItem(status_plot, row=5, col=0, colspan=4)

# Data storage
data_storage = {label: deque(maxlen=50) for label in LABELS}  # Reduce maxlen for better data handling
time_data = deque(maxlen=50)

# Update function
def update():
    global data_storage, time_data
    if ser.in_waiting > 0:
        data = ser.readline().decode().strip().split(',')
        if len(data) == len(LABELS):
            labeled_data = dict(zip(LABELS, data))
            current_time = datetime.now().timestamp()
            time_data.append(current_time)
            for label in LABELS:
                data_storage[label].append(float(labeled_data[label]))
            
            for i, label in enumerate(LABELS):
                curves[i].setData(list(time_data), list(data_storage[label]))
                text_items[i].setText(f"{data_storage[label][-1]:.2f}")
                text_items[i].setPos(time_data[-1], data_storage[label][-1])
            
            # Update status text
            launch_flag = int(labeled_data["launch_flag"])
            drogue_flag = int(labeled_data["drogue_flag"])
            main_flag = int(labeled_data["main_flag"])
            
            if main_flag == 1:
                status_text.setHtml('<div style="text-align: center"><span style="font-size: 48pt; font-weight: bold;">MAIN DEPLOYED</span></div>')
                status_view.setBackgroundColor('g')
            elif drogue_flag == 1:
                status_text.setHtml('<div style="text-align: center"><span style="font-size: 48pt; font-weight: bold;">DROGUE DEPLOYED</span></div>')
                status_view.setBackgroundColor('y')
            elif launch_flag == 1:
                status_text.setHtml('<div style="text-align: center"><span style="font-size: 48pt; font-weight: bold;">LAUNCHED</span></div>')
                status_view.setBackgroundColor('b')
            else:
                status_text.setHtml('<div style="text-align: center"><span style="font-size: 48pt; font-weight: bold;">ARMED</span></div>')
                status_view.setBackgroundColor('r')

# Timer for updating the plot
timer = QtCore.QTimer()
timer.timeout.connect(update)
timer.start(update_interval)

# Start the Qt event loop
if __name__ == '__main__':
    QtWidgets.QApplication.instance().exec_()
    
while True:
    data = ser.readline().decode().strip().split(',')
    if len(data) == len(LABELS):
        labeled_data = dict(zip(LABELS, data))
        for label, value in labeled_data.items():
            print(f"{label}: {value}")
    else:
        print("Received data length does not match expected number of labels.")





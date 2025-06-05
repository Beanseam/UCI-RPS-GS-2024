import sys
import pyqtgraph as pg
from pyqtgraph.Qt import QtWidgets, QtCore
from socketio import Client
 
update_interval = 10  # Update interval in milliseconds (100 Hz)
 
# PyQtGraph App
app = QtWidgets.QApplication([])
win = pg.GraphicsLayoutWidget(show=True, title="Real-Time Data Plot")
win.resize(800, 600)
win.setWindowTitle("Live Data Plot")
 
# Add a plot
plot_x = win.addPlot(row=0, col=0, title="X-Axis Acceleration")
curve_x = plot_x.plot(pen='r')  # Red Line
plot_x.setYRange(-30, 30)
plot_x.setLabel('left', 'Acceleration', units='m/s²')
plot_x.setMouseEnabled(x=False, y=False)
 
plot_y = win.addPlot(row=1, col=0, title="Y-Axis Acceleration")
curve_y = plot_y.plot(pen='g')  # Green Line
plot_y.setYRange(-30, 30)
plot_y.setLabel('left', 'Acceleration', units='m/s²')
plot_y.setMouseEnabled(x=False, y=False)
 
plot_z = win.addPlot(row=2, col=0, title="Z-Axis Acceleration")
curve_z = plot_z.plot(pen='c')  # Cyan Line
plot_z.setYRange(-30, 30)
plot_z.setLabel('left', 'Acceleration', units='m/s²')
plot_z.setMouseEnabled(x=False, y=False)
 
# Add zero line to graph
line_x = pg.InfiniteLine(pos=0, angle=0, pen=pg.mkPen('w', width=1))
line_y = pg.InfiniteLine(pos=0, angle=0, pen=pg.mkPen('w', width=1))
line_z = pg.InfiniteLine(pos=0, angle=0, pen=pg.mkPen('w', width=1))
 
# Lower the zValue of the lines so they appear behind the data
line_x.setZValue(-1)
line_y.setZValue(-1)
line_z.setZValue(-1)
 
plot_x.addItem(line_x)
plot_y.addItem(line_y)
plot_z.addItem(line_z)
 
# Data buffer
data_x, data_y, data_z = [], [], []

# Setup SocketIO client
sio = Client()

@sio.on('json_response')
def on_json_response(data):
    global data_x, data_y, data_z
    try:
        accel = data.get('acceleration', {})
        data_x.append(accel.get('x', 0))
        data_y.append(accel.get('y', 0))
        data_z.append(accel.get('z', 0))

        # Limit the buffer size to 500 points
        if len(data_x) > 500:
            data_x.pop(0)
        if len(data_y) > 500:
            data_y.pop(0) 
        if len(data_z) > 500:
            data_z.pop(0)

    except Exception as e:
        print(f"Error processing data: {e}")
 
def update():
    global data_x, curve_x, data_y, curve_y, data_z, curve_z
    # Update the plot
    curve_x.setData(data_x)
    curve_y.setData(data_y)
    curve_z.setData(data_z)
 
# Timer for updating the plot
timer = QtCore.QTimer()
timer.timeout.connect(update)
timer.start(update_interval)

# Connect to Flask server
try:
    sio.connect('http://localhost:5000')
    print("Connected to Flask server")
except Exception as e:
    print(f"Failed to connect to server: {e}")
 
# Start the app
if __name__ == "__main__":
    try:
        sys.exit(app.exec())
    except KeyboardInterrupt:
        print("Exiting...")
    finally:
        sio.disconnect()
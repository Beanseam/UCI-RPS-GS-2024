import numpy as np
import pyqtgraph as pg
import pyqtgraph.opengl as gl
import serial
import sys
from pyqtgraph.Qt import QtCore, QtGui, QtWidgets
import trimesh

# Serial port configuration
SERIAL_PORT = "COM4"  # Change this to your serial port
BAUD_RATE = 57600

class OrientationVisualizer:
    def __init__(self, stl_file):
        # Initialize the Qt application and OpenGL view
        self.app = QtWidgets.QApplication([])
        self.window = gl.GLViewWidget()
        self.window.setWindowTitle("3D Orientation Visualizer")
        self.window.setCameraPosition(distance=5, azimuth=45)
        self.window.show()

        # Create a 3D axis
        self.axis = gl.GLAxisItem(size=QtGui.QVector3D(2, 2, 2))
        self.window.addItem(self.axis)

        # Load and add the 3D rocket model
        self.object = self.load_stl(stl_file)
        if self.object:
            self.window.addItem(self.object)
        else:
            print("Failed to load STL file. Using a default cube.")
            self.object = gl.GLMeshItem(
                meshdata=self.create_cube(),
                color=(0.5, 0.5, 1, 0.6),
                smooth=False,
                shader="shaded"
            )
            self.window.addItem(self.object)

        # Set up serial communication
        try:
            self.serial = serial.Serial(SERIAL_PORT, BAUD_RATE)
        except serial.SerialException as e:
            print(f"Error opening serial port: {e}")
            sys.exit(1)

        # Set up a timer for periodic updates
        self.timer = QtCore.QTimer()
        self.timer.timeout.connect(self.update_orientation)
        self.timer.start(50)  # Update at ~20Hz

    def load_stl(self, stl_file):
        """Load an STL file and return a GLMeshItem."""
        try:
            mesh = trimesh.load_mesh(stl_file)

            # Center the model at the origin
            centroid = mesh.centroid
            mesh.vertices -= centroid  # Translate vertices to center the model
                    
            # Apply a rotation to point the rocket upwards
            rotation_matrix = trimesh.transformations.rotation_matrix(
                np.radians(90),  # Rotate 90 degrees
                [1, 0, 0]        # Around the X-axis
            )
            mesh.apply_transform(rotation_matrix)    

            # Scale the model
            mesh.vertices *= 0.01

            verts = np.array(mesh.vertices)
            faces = np.array(mesh.faces)
            meshdata = gl.MeshData(vertexes=verts, faces=faces)
            return gl.GLMeshItem(meshdata=meshdata, color=(0.5, 0.5, 1, 1), smooth=True, shader="shaded")
        except Exception as e:
            print(f"Error loading STL file: {e}")
            return None

    def create_cube(self):
        """Create a simple cube mesh."""
        verts = np.array([
            [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5],
            [-0.5, +0.5, -0.5], [+0.5, +0.5, -0.5],
            [-0.5, -0.5, +0.5], [+0.5, -0.5, +0.5],
            [-0.5, +0.5, +0.5], [+0.5, +0.5, +0.5],
        ])
        faces = np.array([
            [0, 1, 3], [0, 3, 2],  # Bottom
            [4, 5, 7], [4, 7, 6],  # Top
            [0, 1, 5], [0, 5, 4],  # Front
            [2, 3, 7], [2, 7, 6],  # Back
            [0, 2, 6], [0, 6, 4],  # Left
            [1, 3, 7], [1, 7, 5],  # Right
        ])
        return gl.MeshData(vertexes=verts, faces=faces)

    def quaternion_to_matrix(self, qw, qx, qy, qz):
        """Convert a quaternion to a 4x4 rotation matrix."""
        q = np.array([qw, qx, qy, qz], dtype=np.float32)
        n = np.dot(q, q)
        if n < np.finfo(float).eps:
            return np.identity(4)

        q *= np.sqrt(2.0 / n)
        q = np.outer(q, q)
        return np.array([
            [1.0 - q[2, 2] - q[3, 3], q[1, 2] - q[3, 0], q[1, 3] + q[2, 0], 0.0],
            [q[1, 2] + q[3, 0], 1.0 - q[1, 1] - q[3, 3], q[2, 3] - q[1, 0], 0.0],
            [q[1, 3] - q[2, 0], q[2, 3] + q[1, 0], 1.0 - q[1, 1] - q[2, 2], 0.0],
            [0.0, 0.0, 0.0, 1.0],
        ])

    def update_orientation(self):
        """Update the orientation of the object based on serial data."""
        if self.serial.in_waiting > 0:
            try:
                line = self.serial.readline().decode("utf-8").strip()
                qw, qx, qy, qz = map(float, line.split(","))
                rotation_matrix = self.quaternion_to_matrix(qw, qx, qy, qz)
                self.object.setTransform(QtGui.QMatrix4x4(*rotation_matrix.flatten()))
            except (ValueError, IndexError) as e:
                print(f"Error parsing line: {line}, {e}")

    def run(self):
        """Start the Qt application."""
        QtWidgets.QApplication.instance().exec()

if __name__ == "__main__":
    visualizer = OrientationVisualizer("RocketModel.stl")
    visualizer.run()

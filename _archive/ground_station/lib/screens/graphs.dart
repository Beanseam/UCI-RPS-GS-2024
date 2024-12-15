// ignore_for_file: unused_catch_stack, must_be_immutable

import 'dart:async';
// import 'dart:convert';
// import 'dart:io';
// import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:ground_station/constants/Port_details.dart';
// import 'package:ground_station/constants/Port_details.dart';
import 'package:real_time_chart/real_time_chart.dart';
// import 'dart:math';
import 'package:flutter_libserialport/flutter_libserialport.dart';
// import 'package:libserialport/libserialport.dart';
// import 'package:syncfusion_flutter_charts/charts.dart';

class GraphsPage extends StatefulWidget {
  const GraphsPage({Key? key}) : super(key: key);

  @override
  State<GraphsPage> createState() => _GraphsPageState();
}

class _GraphsPageState extends State<GraphsPage> {
  late SerialPort port = SerialPort(portNumber);
  StringBuffer buffer = StringBuffer();
  double currentMax = 0;

  // ignore: non_constant_identifier_names
  bool main_fire_1 = false;

  void showSnackbar(String message) {
    final snackBar = SnackBar(
      content: Text(message),
      duration: const Duration(seconds: 2),
    );

    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  StreamController<double> altitudeStreamController =
      StreamController<double>.broadcast();
  // ignore: non_constant_identifier_names
  StreamController<double> acceleration_x_StreamController =
      StreamController<double>.broadcast();
  StreamController<double> tempretureStreamController =
      StreamController<double>.broadcast();
  StreamController<double> pressureStreamController =
      StreamController<double>.broadcast();
  // ignore: non_constant_identifier_names
  StreamController<double> acceleration_y_StreamController =
      StreamController<double>.broadcast();
  // ignore: non_constant_identifier_names
  StreamController<double> acceleration_z_StreamController =
      StreamController<double>.broadcast();
  // ignore: non_constant_identifier_names
  StreamController<double> gyro_x_StreamController =
      StreamController<double>.broadcast();
  // ignore: non_constant_identifier_names
  StreamController<double> gyro_y_StreamController =
      StreamController<double>.broadcast();
  // ignore: non_constant_identifier_names
  StreamController<double> gyro_z_StreamController =
      StreamController<double>.broadcast();
  // ignore: non_constant_identifier_names
  StreamController<double> mag_x_StreamController =
      StreamController<double>.broadcast();
  // ignore: non_constant_identifier_names
  StreamController<double> mag_y_StreamController =
      StreamController<double>.broadcast();
  // ignore: non_constant_identifier_names
  StreamController<double> mag_z_StreamController =
      StreamController<double>.broadcast();

  late double altitude;
  late double temp;
  late double pressure;
  late double acc_x;
  late double acc_y;
  late double acc_z;
  late double gyro_x;
  late double gyro_y;
  late double gyro_z;
  late double mag_x;
  late double mag_y;
  late double mag_z;

  int fallCounter = 0;

  void formatSensorData(String data) {
    List<String> values = data.split(',');
    if (values.length == 12) {
      double altitude = double.parse(values[0]);
      double temp = double.parse(values[1]);
      double pressure = double.parse(values[2]);
      double acc_x = double.parse(values[3]);
      double acc_y = double.parse(values[4]);
      double acc_z = double.parse(values[5]);
      double gyro_x = double.parse(values[6]);
      double gyro_y = double.parse(values[7]);
      double gyro_z = double.parse(values[8]);
      double mag_x = double.parse(values[9]);
      double mag_y = double.parse(values[10]);
      double mag_z = double.parse(values[11]);

      if (acc_x.abs() > 30 || acc_y.abs() > 30 || acc_z.abs() > 30) {
        showSnackbar("ROCKET LAUNCH++++++++++++++++++++");
      }
      if (altitude >= 1750 && main_fire_1 == false) {
        showSnackbar("MAIN 1 FIRE++++++++++++++++++++");
        setState(() {
          main_fire_1 = true;
        });
      }
      if (acc_y < 0) {
        showSnackbar("Falling...");
      } else {
        showSnackbar("NO LAUNCH--------------------");
      }

      altitudeStreamController.add(altitude);
      acceleration_x_StreamController.add(acc_x);
      acceleration_y_StreamController.add(acc_y);
      acceleration_z_StreamController.add(acc_z);
      tempretureStreamController.add(temp);
      pressureStreamController.add(pressure);
      gyro_x_StreamController.add(gyro_x);
      gyro_y_StreamController.add(gyro_y);
      gyro_z_StreamController.add(gyro_z);
      mag_x_StreamController.add(mag_x);
      mag_y_StreamController.add(mag_y);
      mag_z_StreamController.add(mag_z);

      print("Altitude: $altitude");
      print("Temperature: $temp");
      print("Pressure: $pressure");
      print("Acceleration X: $acc_x");
      print("Acceleration Y: $acc_y");
      print("Acceleration Z: $acc_z");
      print("Gyroscope X: $gyro_x");
      print("Gyroscope Y: $gyro_y");
      print("Gyroscope Z: $gyro_z");
      print("Magnetometer X: $mag_x");
      print("Magnetometer Y: $mag_y");
      print("Magnetometer Z: $mag_z");
    } else {
      print("Invalid input string");
    }
  }

  @override
  void initState() {
    super.initState();
    initPorts();
    // formatSensorData(data);
  }

  void initPorts() async {
    final config = SerialPortConfig();
    config.baudRate = 57600;
    config.bits = 8;
    config.stopBits = 1;
    config.parity = 0;
    port.config = config;
    final reader = SerialPortReader(port);

// List<int> list = 'someData'.codeUnits;
// Uint8List bytes = Uint8List.fromList(list);
// String string = String.fromCharCodes(bytes);
    try {
      print("attempting to connect");
      port.openReadWrite();
      await reader.stream.listen((data) {
        print("connected");
        print(data);
        String recievedString = String.fromCharCodes(data);
        // print(recievedString);
        buffer.write(recievedString);
        if (buffer.toString().contains('\n')) {
          // Process the complete string
          String completeString = buffer.toString().trim();
          // print(completeString);
          formatSensorData(completeString);
          // Clear the buffer for the next string
          buffer.clear();
        }
      });
    } on SerialPortError catch (_, err) {
      print("error");
      if (port.isOpen) {
        port.close();
        print('serial port error');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    double rowHeight = MediaQuery.of(context).size.height * 0.3;

    return Scaffold(
      appBar: AppBar(
        title: Text('Graphs Page'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // First Row
            Expanded(
              child: Container(
                height: rowHeight,
                child: Row(
                  children: [
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.all(8.0),
                        color: const Color(0xFF36393e),
                        child: AltitudeGraph(
                          streamController: altitudeStreamController,
                        ),
                      ),
                    ),
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.all(8.0),
                        color: const Color(0xFF36393e),
                        child: AccelerationXGraph(
                            streamController: acceleration_x_StreamController),
                      ),
                    ),
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.all(8.0),
                        color: const Color(0xFF36393e),
                        child: AccelerationYGraph(
                            streamController: mag_x_StreamController),
                      ),
                    ),
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.all(8.0),
                        color: const Color(0xFF36393e),
                        child: AccelerationZGraph(
                            streamController: mag_x_StreamController),
                      ),
                    )
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16.0), // Adjust spacing between rows
            // Second Row
            Expanded(
              child: Container(
                height: rowHeight,
                child: Row(
                  children: [
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.all(8.0),
                        color: const Color(0xFF36393e),
                        child: MagnetometerXGraph(
                            streamController: mag_x_StreamController),
                      ),
                    ),
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.all(8.0),
                        color: const Color(0xFF36393e),
                        child: MagnetometerYGraph(
                            streamController: mag_y_StreamController),
                      ),
                    ),
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.all(8.0),
                        color: const Color(0xFF36393e),
                        child: MagnetometerZGraph(
                            streamController: mag_z_StreamController),
                      ),
                    ),
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.all(8.0),
                        color: const Color(0xFF36393e),
                        child: TemperatureGraph(
                            streamController: tempretureStreamController),
                      ),
                    )
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16.0),
            Expanded(
              child: Container(
                height: rowHeight,
                child: Row(
                  children: [
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.all(8.0),
                        color: const Color(0xFF36393e),
                        child: OrientationXGraph(
                            streamController: gyro_x_StreamController),
                      ),
                    ),
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.all(8.0),
                        color: const Color(0xFF36393e),
                        child: OrientationYGraph(
                            streamController: gyro_y_StreamController),
                      ),
                    ),
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.all(8.0),
                        color: const Color(0xFF36393e),
                        child: OrientationZGraph(
                            streamController: gyro_z_StreamController),
                      ),
                    ),
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.all(8.0),
                        color: const Color(0xFF36393e),
                        child: PressureGraph(
                            streamController: pressureStreamController),
                      ),
                    )
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}

class AltitudeGraph extends StatefulWidget {
  late StreamController<double> streamController;
  AltitudeGraph({required this.streamController});

  @override
  State<AltitudeGraph> createState() => _AltitudeGraphState();
}

class _AltitudeGraphState extends State<AltitudeGraph> {
  @override
  Widget build(BuildContext context) {
    return SensorDataGraph(
      title: "Altitude in m",
      dataStream: widget.streamController.stream,
    );
  }
}

class AccelerationXGraph extends StatefulWidget {
  late StreamController<double> streamController;
  AccelerationXGraph({required this.streamController});

  @override
  State<AccelerationXGraph> createState() => _AccelerationXGraphState();
}

class _AccelerationXGraphState extends State<AccelerationXGraph> {
  @override
  Widget build(BuildContext context) {
    return SensorDataGraph(
      title: "Acceleration X",
      dataStream: widget.streamController.stream,
    );
  }
}

class AccelerationYGraph extends StatefulWidget {
  late StreamController<double> streamController;
  AccelerationYGraph({required this.streamController});

  @override
  State<AccelerationYGraph> createState() => _AccelerationYGraphState();
}

class _AccelerationYGraphState extends State<AccelerationYGraph> {
  @override
  Widget build(BuildContext context) {
    return SensorDataGraph(
      title: "Acceleration Y",
      dataStream: widget.streamController.stream,
    );
  }
}

class AccelerationZGraph extends StatefulWidget {
  late StreamController<double> streamController;
  AccelerationZGraph({required this.streamController});

  @override
  State<AccelerationZGraph> createState() => _AccelerationZGraphState();
}

class _AccelerationZGraphState extends State<AccelerationZGraph> {
  @override
  Widget build(BuildContext context) {
    return SensorDataGraph(
      title: "Acceleration Z",
      dataStream: widget.streamController.stream,
    );
  }
}

class MagnetometerXGraph extends StatefulWidget {
  late StreamController<double> streamController;
  MagnetometerXGraph({required this.streamController});

  @override
  State<MagnetometerXGraph> createState() => _MagnetometerXGraphState();
}

class _MagnetometerXGraphState extends State<MagnetometerXGraph> {
  @override
  Widget build(BuildContext context) {
    return SensorDataGraph(
      title: "Magnetic Field  X",
      dataStream: widget.streamController.stream,
    );
  }
}

class MagnetometerYGraph extends StatefulWidget {
  late StreamController<double> streamController;
  MagnetometerYGraph({required this.streamController});

  @override
  State<MagnetometerYGraph> createState() => _MagnetometerYGraphState();
}

class _MagnetometerYGraphState extends State<MagnetometerYGraph> {
  @override
  Widget build(BuildContext context) {
    return SensorDataGraph(
      title: "Magnetic Field  Y",
      dataStream: widget.streamController.stream,
    );
  }
}

class MagnetometerZGraph extends StatefulWidget {
  late StreamController<double> streamController;
  MagnetometerZGraph({required this.streamController});

  @override
  State<MagnetometerZGraph> createState() => _MagnetometerZGraphState();
}

class _MagnetometerZGraphState extends State<MagnetometerZGraph> {
  @override
  Widget build(BuildContext context) {
    return SensorDataGraph(
      title: "Magnetic Field  Z",
      dataStream: widget.streamController.stream,
    );
  }
}

class OrientationXGraph extends StatefulWidget {
  late StreamController<double> streamController;
  OrientationXGraph({required this.streamController});

  @override
  State<OrientationXGraph> createState() => _OrientationXGraphState();
}

class _OrientationXGraphState extends State<OrientationXGraph> {
  @override
  Widget build(BuildContext context) {
    return SensorDataGraph(
      title: "Orientation X",
      dataStream: widget.streamController.stream,
    );
  }
}

class OrientationYGraph extends StatefulWidget {
  late StreamController<double> streamController;
  OrientationYGraph({required this.streamController});

  @override
  State<OrientationYGraph> createState() => _OrientationYGraphState();
}

class _OrientationYGraphState extends State<OrientationYGraph> {
  @override
  Widget build(BuildContext context) {
    return SensorDataGraph(
      title: "Orientation Y",
      dataStream: widget.streamController.stream,
    );
  }
}

class OrientationZGraph extends StatefulWidget {
  late StreamController<double> streamController;
  OrientationZGraph({required this.streamController});

  @override
  State<OrientationZGraph> createState() => _OrientationZGraphState();
}

class _OrientationZGraphState extends State<OrientationZGraph> {
  @override
  Widget build(BuildContext context) {
    return SensorDataGraph(
      title: "Orientation Z",
      dataStream: widget.streamController.stream,
    );
  }
}

class PressureGraph extends StatefulWidget {
  late StreamController<double> streamController;
  PressureGraph({required this.streamController});

  @override
  State<PressureGraph> createState() => _PressureGraphState();
}

class _PressureGraphState extends State<PressureGraph> {
  @override
  Widget build(BuildContext context) {
    return SensorDataGraph(
      title: "Pressure",
      dataStream: widget.streamController.stream,
    );
  }
}

class TemperatureGraph extends StatefulWidget {
  late StreamController<double> streamController;
  TemperatureGraph({required this.streamController});

  @override
  State<TemperatureGraph> createState() => _TemperatureGraphState();
}

class _TemperatureGraphState extends State<TemperatureGraph> {
  @override
  Widget build(BuildContext context) {
    return SensorDataGraph(
      title: "Temperature",
      dataStream: widget.streamController.stream,
    );
  }
}

class SensorDataGraph extends StatelessWidget {
  final String title;
  final Stream<double> dataStream;

  SensorDataGraph({required this.title, required this.dataStream});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          '$title vs Time',
          style: const TextStyle(color: Colors.white),
        ),
        Expanded(
          child: RealTimeGraph(
            stream: dataStream,
            supportNegativeValuesDisplay: true,
            xAxisColor: Colors.black12,
          ),
        ),
      ],
    );
  }
}

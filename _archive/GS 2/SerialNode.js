//Imports dependencies
const SerialPort  = require("serialport");
const ReadLine  = require("@serialport/parser-readline");

//Define the serial port
const port = new SerialPort("/dev/cu.usbserial-140", {
  //Change port to port that is connected to Arduino
  //Requires an Arduino to communcaite with
  //To read Arduino needs to write something 
  baudRate: 57600,
});

//Serial port parser
const parser = new ReadLine();
port.pipe(parser);

//Read the data from serial port
parser.on("data", (line) => console.log(line));

//Write data to serial port
port.write("Writing to port");
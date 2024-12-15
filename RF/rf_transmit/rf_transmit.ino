#include <SoftwareSerial.h>

SoftwareSerial mySerial(0,1); // RX, TX

void setup() {
  Serial.begin(57600);  // Serial monitor for debugging
  mySerial.begin(57600);  // Set the baud rate of your RFD900x modules
}

void loop() {
  // char incomingByte = Serial.read();

  String dataString = "2154.62,17.59782.73,-0.47,5.08,8.72,0.06,-0.08,-0.05,-87.72,39.77,0.22";

  String incomingByte = dataString;
  Serial.println(incomingByte);  // Your message to be sent
  mySerial.println(incomingByte);  // Your message to be sent
  delay(1000);
}
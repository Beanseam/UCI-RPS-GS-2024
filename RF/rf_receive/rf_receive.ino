#include <SoftwareSerial.h>

SoftwareSerial mySerial(0, 1); // RX, TX

void setup() {
  Serial.begin(57600);  // Serial monitor for debugging
  mySerial.begin(57600);  // Set the baud rate of your RFD900x modules
}

void loop() {
  if (mySerial.available() > 0) {
    String receivedMessage = mySerial.readStringUntil('\n');
    Serial.println("Received: " + receivedMessage);
  }
}

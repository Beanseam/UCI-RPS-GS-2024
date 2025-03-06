#ifndef BPM390_MODULE_H
#define BPM390_MODULE_H

#include <Arduino.h>
#include <Adafruit_BMP3XX.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <SPI.h>

#define SEALEVELPRESSURE_HPA (1013.25)

struct BPM_SensorData {
  float temperature;
  float pressure;
  float altitude;
};

class BPM390_Module {
public:
    BPM390_Module(Adafruit_BMP3XX &sensor);
    bool begin();
    BPM_SensorData readData();
private:
  Adafruit_BMP3XX &bpm;
};

#endif
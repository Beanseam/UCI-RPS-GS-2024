#ifndef LIS3DH_MODULE_H
#define LIS3DH_MODULE_H

#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_LIS3DH.h>
#include <Adafruit_Sensor.h>

struct LIS3DH_SensorData {
  float accel_x;
  float accel_y;
  float accel_z;
};

class LIS3DH_Module{
public:
  LIS3DH_Module(Adafruit_LIS3DH &sensor);
  bool begin();
  LIS3DH_SensorData readData();
private:
  Adafruit_LIS3DH lis;
};

#endif
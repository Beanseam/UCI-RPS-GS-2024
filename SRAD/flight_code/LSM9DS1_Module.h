#ifndef LSM9DS1_MODULE_H
#define LSM9DS1_MODULE_H

#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_LSM9DS1.h>
#include <Adafruit_Sensor.h> 

struct LSM9DS1_SensorData {
    float accel_x;
    float accel_y;
    float accel_z;
    float mag_x;
    float mag_y;
    float mag_z;
    float gyro_x;
    float gyro_y;
    float gyro_z;
};

class LSM9DS1_Module {
public:
  LSM9DS1_Module(Adafruit_LSM9DS1 &sensor);
  bool begin();
  struct LSM9DS1_SensorData readData();
private:
  Adafruit_LSM9DS1 &lsm;
};

#endif
#include "LSM9DS1_Module.h"

LSM9DS1_Module::LSM9DS1_Module(Adafruit_LSM9DS1 &sensor) : lsm(sensor) {}

bool LSM9DS1_Module::begin(){
  if (!lsm.begin()){
    return false;
  }
  lsm.setupAccel(lsm.LSM9DS1_ACCELRANGE_16G, lsm.LSM9DS1_ACCELDATARATE_952HZ);
  lsm.setupMag(lsm.LSM9DS1_MAGGAIN_16GAUSS);
  lsm.setupGyro(lsm.LSM9DS1_GYROSCALE_2000DPS);
  return true;
}

LSM9DS1_SensorData LSM9DS1_Module::readData(){
  LSM9DS1_SensorData data;

  lsm.read();
  sensors_event_t a, m, g, temp;
  lsm.getEvent(&a, &m, &g, &temp);

    if (isnan(a.acceleration.x) || isnan(a.acceleration.y) || isnan(a.acceleration.z)) {
        data.accel_x = -999;
        data.accel_y = -999;
        data.accel_z = -999;
    } else {
        data.accel_x = a.acceleration.x;
        data.accel_y = a.acceleration.y;
        data.accel_z = a.acceleration.z;
    }

    // Check magnetometer data
    if (isnan(m.magnetic.x) || isnan(m.magnetic.y) || isnan(m.magnetic.z)) {
        data.mag_x = -999;
        data.mag_y = -999;
        data.mag_z = -999;
    } else {
        data.mag_x = m.magnetic.x;
        data.mag_y = m.magnetic.y;
        data.mag_z = m.magnetic.z;
    }

    // Check gyroscope data
    if (isnan(g.gyro.x) || isnan(g.gyro.y) || isnan(g.gyro.z)) {
        data.gyro_x = -999;
        data.gyro_y = -999;
        data.gyro_z = -999;
    } else {
        data.gyro_x = g.gyro.x;
        data.gyro_y = g.gyro.y;
        data.gyro_z = g.gyro.z;
    }

  return data;
}
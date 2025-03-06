#include "LIS3DH_Module.h"

LIS3DH_Module::LIS3DH_Module(Adafruit_LIS3DH &sensor) : lis(sensor) {}

bool LIS3DH_Module::begin(){
  if (!lis.begin()){
    return false;
  }

  lis.setRange(LIS3DH_RANGE_16_G);
  lis.setPerformanceMode(LIS3DH_MODE_HIGH_RESOLUTION);
  lis.setDataRate(LIS3DH_DATARATE_200_HZ);
    
  return true;
}

LIS3DH_SensorData LIS3DH_Module::readData(){
  LIS3DH_SensorData data;
  sensors_event_t event;
  lis.getEvent(&event);

  if (isnan(event.acceleration.x) || isnan(event.acceleration.y) || isnan(event.acceleration.z)) {
    data.accel_x = -999;
    data.accel_y = -999;
    data.accel_z = -999;
  } else {
    data.accel_x = event.acceleration.x;
    data.accel_y = event.acceleration.y;
    data.accel_z = event.acceleration.z;
  }

  return data;
}
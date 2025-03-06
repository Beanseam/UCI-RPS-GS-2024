#include "BPM390_Module.h"

BPM390_Module::BPM390_Module(Adafruit_BMP3XX &sensor) : bpm(sensor) {}

bool BPM390_Module::begin() {
    if (!bpm.begin_I2C()) {  // Initialize sensor over I2C
        return false;
    }
    bpm.setTemperatureOversampling(BMP3_OVERSAMPLING_8X);
    bpm.setPressureOversampling(BMP3_OVERSAMPLING_4X);
    bpm.setIIRFilterCoeff(BMP3_IIR_FILTER_COEFF_3);
    bpm.setOutputDataRate(BMP3_ODR_200_HZ);
    return true;
}

BPM_SensorData BPM390_Module::readData() {
  BPM_SensorData data;

  if(!bpm.performReading()){
    data.temperature = -999;
    data.pressure = -999;
    data.altitude = -999;
    return data;
  }
  data.temperature = bpm.temperature;
  data.pressure = bpm.pressure / 100.0;  // Convert to hPa
  data.altitude = bpm.readAltitude(SEALEVELPRESSURE_HPA);
    
  return data;
}
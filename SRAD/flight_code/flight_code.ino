// Include custom libraries
#include "BPM390_Module.h"
#include "LIS3DH_Module.h"
#include "LSM9DS1_Module.h"

Adafruit_BMP3XX bmp;
BPM390_Module bmpModule(bmp);
Adafruit_LIS3DH lis = Adafruit_LIS3DH();
LIS3DH_Module LIS3DHModule(lis);
Adafruit_LSM9DS1 lsm = Adafruit_LSM9DS1();
LSM9DS1_Module LSM9DS1Module(lsm);

// Declare global variables
float Temp = 0;
float Press = 0;
float Alt = 0;
float Accel_x2 = 0;
float Accel_y2 = 0;
float Accel_z2 = 0;
float Accel_x = 0;
float Accel_y = 0;
float Accel_z = 0;
float Mag_x = 0;
float Mag_y = 0;
float Mag_z = 0;
float Gyro_x = 0;
float Gyro_y = 0;
float Gyro_z = 0;
float Quaternion_1 = 0;
float Quaternion_2 = 0;
float Quaternion_3 = 0;
float Quaternion_4 = 0;

void setup() {
  Serial.begin(11520);
  while (!Serial);

// BPM390 Setup
  Serial.println("BMP390 Setup");
  if (!bmpModule.begin()){
    Serial.println("Could not find a valid BMP sensor");
    while (1);
  }

// LIS3DH Setup
  Serial.println("LIS3DH Setup");
  if (!LIS3DHModule.begin()){
    Serial.println("Could not find a valid LIS3DH sensor");
  }


// LSM9DS1 Setup
  Serial.println("LSM9DS1 Setup");
  if (!LSM9DS1Module.begin()){
    Serial.println("Could not find a valid LSM9DS1 sensor");
  }
}

void loop(){
// BPM390 Data
  BPM_SensorData BPM_data = bmpModule.readData();
  if (BPM_data.temperature != -999) {
    Temp = BPM_data.temperature;
    Press = BPM_data.pressure;
    Alt = BPM_data.altitude;
  }
  else {
    Serial.println("Failed to get BPM390 data");
  }

// LIS3DH Data
  LIS3DH_SensorData LIS3DH_data = LIS3DHModule.readData();
  if (LIS3DH_data.accel_x != -999 && LIS3DH_data.accel_y != -999 && LIS3DH_data.accel_z != -999){
    Accel_x2 = LIS3DH_data.accel_x;
    Accel_y2 = LIS3DH_data.accel_y;
    Accel_z2 = LIS3DH_data.accel_z;
  }
  else {
    Serial.println("Failed to get LIS3DH data");
  }

// LSM9DS1 Data
  LSM9DS1_SensorData LSM9DS1_data = LSM9DS1Module.readData();

  if (LSM9DS1_data.accel_x != -999 && LSM9DS1_data.accel_y != -999 && LSM9DS1_data.accel_z != -999 &&
      LSM9DS1_data.gyro_x != -999 && LSM9DS1_data.gyro_y != -999 && LSM9DS1_data.gyro_z != -999 &&
      LSM9DS1_data.mag_x != -999 && LSM9DS1_data.mag_y != -999 && LSM9DS1_data.mag_z != -999){
        Accel_x = LSM9DS1_data.accel_x;
        Accel_y = LSM9DS1_data.accel_y;
        Accel_z = LSM9DS1_data.accel_z;

        Gyro_x = LSM9DS1_data.gyro_x;
        Gyro_y = LSM9DS1_data.gyro_y;
        Gyro_z = LSM9DS1_data.gyro_z;

        Mag_x = LSM9DS1_data.mag_x;
        Mag_y = LSM9DS1_data.mag_y;
        Mag_z = LSM9DS1_data.mag_z;
      }
  else {
    Serial.println("Failed to get LSM9DS1 data");
  }


// Print combined data
  Serial.println(String(Temp) + "," + String(Press) + "," + String(Alt) + "," +
                String(Accel_x2) + "," + String(Accel_y2) + "," + String(Accel_z2) + "," +
                String(Accel_x) + "," + String(Accel_y) + "," + String(Accel_z) + "," +
                String(Mag_x) + "," + String(Mag_y) + "," + String(Mag_z) + "," +
                String(Quaternion_1) + "," + String(Quaternion_2) + "," + 
                String(Quaternion_3) + "," + String(Quaternion_4));  
                
  delay(1000);
  
  }
// Include custom libraries
#include "BPM390_Module.h"
#include "LIS3DH_Module.h"

Adafruit_BMP3XX bmp;
BPM390_Module bmpModule(bmp);
Adafruit_LIS3DH lis = Adafruit_LIS3DH();
LIS3DH_Module LIS3DHModule(lis);
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


// Print combined data
  Serial.println(String(Temp) + "," + String(Press) + "," + String(Alt) + "," +
                String(Accel_x2) + "," + String(Accel_y2) + "," + String(Accel_z2) + "," +
                String(Accel_x) + "," + String(Accel_y) + "," + String(Accel_z) + "," +
                String(Mag_x) + "," + String(Mag_y) + "," + String(Mag_z) + "," +
                String(Quaternion_1) + "," + String(Quaternion_2) + "," + 
                String(Quaternion_3) + "," + String(Quaternion_4));  
                
  delay(1000);
  
  }
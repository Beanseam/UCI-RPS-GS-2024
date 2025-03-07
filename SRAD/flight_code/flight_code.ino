// Include custom libraries

#include <Arduino.h>

#include "BPM390_Module.h"
#include "LIS3DH_Module.h"
#include "LSM9DS1_Module.h"
#include <MadgwickAHRS.h>

#define main_1 11     // main primary
#define main_2 10    // main secondary     
#define drogue_1 12   // drogue primary
#define drogue_2 9  // drogue secondary
#define buzzer 39    // buzzer

#define HWSERIAL Serial7 // Hardware Serial Needed for RF




Adafruit_BMP3XX bmp;
BPM390_Module bmpModule(bmp);
Adafruit_LIS3DH lis = Adafruit_LIS3DH();
LIS3DH_Module LIS3DHModule(lis);
Adafruit_LSM9DS1 lsm = Adafruit_LSM9DS1();
LSM9DS1_Module LSM9DS1Module(lsm);

Madgwick filter;

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

// Declare rocket stage detection variables
const int delay_time = 10;
const int charge_delay = 500;
const int backup_delay = 2500;
bool launch_flag = 0;
bool drogue_flag = 0;
bool main_flag = 0;
int fall_counter = 0;
int rise_counter = 0;
float pre_alt = 0;
int stage;



void setup() {
  Serial.begin(11520);
  while (!Serial);

  HWSERIAL.begin(57600);

  pinMode(main_1, OUTPUT);
  pinMode(main_2, OUTPUT);
  pinMode(drogue_1, OUTPUT);
  pinMode(drogue_2, OUTPUT);
  pinMode(buzzer, OUTPUT);

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

  filter.begin(200); // Initialize Madwick at 200Hz

}

void loop(){
// BPM390 Data

  // digitalWrite(main_1, HIGH);
  

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
        filter.update(Gyro_x, Gyro_y, Gyro_z, Accel_x, Accel_y, Accel_z, Mag_x, Mag_y, Mag_z);

        
        Accel_x = LSM9DS1_data.accel_x;
        Accel_y = LSM9DS1_data.accel_y;
        Accel_z = LSM9DS1_data.accel_z;

        Gyro_x = LSM9DS1_data.gyro_x;
        Gyro_y = LSM9DS1_data.gyro_y;
        Gyro_z = LSM9DS1_data.gyro_z;

        Mag_x = LSM9DS1_data.mag_x;
        Mag_y = LSM9DS1_data.mag_y;
        Mag_z = LSM9DS1_data.mag_z;

      // float qw, qx, qy, qz;
      // filter.getQuaternion(&qw, &qx, &qy, &qz);
      //   Quaternion_1 = qw;
      //   Quaternion_2 = qx;
      //   Quaternion_3 = qy;
      //   Quaternion_4 = qz;

        Quaternion_1 = filter.getRoll();

      }
  else {
    Serial.println("Failed to get LSM9DS1 data");
  }


  // launch_flag = true;
  // drogue_flag = false;
  // main_flag = false;



  if (launch_flag == false) {
    if (rise_counter > 10 && pre_alt - Alt < 0) {
      launch_flag = true;
      stage = 1;

      // HWSERIAL.println("Launch Detected\n\n\n\n\n\n\n\n\n\n\n");

    } else if (pre_alt - Alt < 0) {
      rise_counter = rise_counter + 1;
    } else {
      rise_counter = 0;
    }
  } else if (launch_flag == true && drogue_flag == false) {
    if (fall_counter > 3 && round(pre_alt) - round(Alt) > 0) {
        drogue_flag = true;
        stage = 2;

        digitalWrite(drogue_1, HIGH);
        delay(charge_delay);
        digitalWrite(drogue_1, LOW);
        delay(backup_delay);

        digitalWrite(drogue_2, HIGH);
        delay(charge_delay);
        digitalWrite(drogue_2, LOW);

        // HWSERIAL.println("Drogue Deployed \n\n\n\n\n\n\n\n\n\n\n\n");
    } else if (round(pre_alt) - round(Alt) > 0) {
        fall_counter = fall_counter + 1;
    } else {
        fall_counter = 0;
    }
  } else if (launch_flag == true && main_flag == false && drogue_flag == true) {
    if (Alt < 1000) {
      main_flag = true;
      stage = 3;

      digitalWrite(main_1, HIGH);
      delay(charge_delay);
      digitalWrite(main_1, LOW);
      
      delay(backup_delay);
      digitalWrite(main_2, HIGH);
      delay(charge_delay);
      digitalWrite(main_2, LOW);
      
      // HWSERIAL.println("Main Deployed \n\n\n\n\n\n\n");
    }
  }

  pre_alt = Alt;

// Print combined data
  Serial.println(String(Temp) + "," + String(Press) + "," + String(Alt) + "," +
                String(Accel_x2) + "," + String(Accel_y2) + "," + String(Accel_z2) + "," +
                String(Accel_x) + "," + String(Accel_y) + "," + String(Accel_z) + "," +
                String(Gyro_x) + "," + String(Gyro_y) + "," + String(Gyro_z) + "," +
                String(Mag_x) + "," + String(Mag_y) + "," + String(Mag_z) + "," +
                String(Quaternion_1) + "," + String(Quaternion_2) + "," + 
                String(Quaternion_3) + "," + String(Quaternion_4) + "," +
                String(stage) + "," + String(launch_flag) + "," + String(drogue_flag) + "," +
                String(main_flag)
              ); 
              

  HWSERIAL.println(String(Temp) + "," + String(Press) + "," + String(Alt) + "," +
              String(Accel_x2) + "," + String(Accel_y2) + "," + String(Accel_z2) + "," +
              String(Accel_x) + "," + String(Accel_y) + "," + String(Accel_z) + "," +
              String(Gyro_x) + "," + String(Gyro_y) + "," + String(Gyro_z) + "," +
              String(Mag_x) + "," + String(Mag_y) + "," + String(Mag_z) + "," +
              String(Quaternion_1) + "," + String(Quaternion_2) + "," + 
              String(Quaternion_3) + "," + String(Quaternion_4) + "," +
              String(stage) + "," + String(launch_flag) + "," + String(drogue_flag) + "," +
              String(main_flag)
            );  
  
  }
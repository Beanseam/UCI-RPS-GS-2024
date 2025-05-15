// Include custom libraries

#include <Arduino.h>
#include <SD.h>

#include "BPM390_Module.h"
#include "LIS3DH_Module.h"
#include "LSM9DS1_Module.h"
// #include <MadgwickAHRS.h>
#include <Adafruit_Sensor_Calibration.h>
#include <Adafruit_AHRS.h>

#define main_1 11     // main primary
#define main_2 10    // main secondary     
#define drogue_1 12   // drogue primary
#define drogue_2 9  // drogue secondary
#define buzzer 25    // buzzer
#define camera1 20 // camera1
#define camera2 15 // camera2
#define camera1_adc 21 //camera 1 adc
#define camera2_adc 14 //camera 2 adc

#define HWSERIAL Serial7 // Hardware Serial Needed for RF
#define CAM_SERIAL Serial1 // Serial for Camera



Adafruit_BMP3XX bmp;
BPM390_Module bmpModule(bmp);
Adafruit_LIS3DH lis = Adafruit_LIS3DH();
LIS3DH_Module LIS3DHModule(lis);
Adafruit_LSM9DS1 lsm = Adafruit_LSM9DS1();
LSM9DS1_Module LSM9DS1Module(lsm);

// Madgwick filter;
Adafruit_Mahony algo;

// Declare global variables
float Temp = 0;
float Press = 0;
float Alt = 0;
float startAlt = 0;
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
const int charge_delay = 500; //500
const int backup_delay = 500; //2500
bool launch_flag = 0;
bool drogue_flag = 0;
bool main_flag = 0;
bool sdAvailable = false;
int fall_counter = 0;
int rise_counter = 0;
float pre_alt = 0;
int stage;

void writeSD(String data) {
  if (sdAvailable) {
    File dataFile = SD.open("rocket.csv", FILE_WRITE);  
    if (dataFile) {
      dataFile.println(data);
      dataFile.close();
    } else {
      Serial.println("Error Opening Data File.");
    }
  } else {
    Serial.println("[LOG] " + data);  // Fallback log
  }
}

void setup() {
  Serial.begin(115200);
  // while (!Serial);
  Serial.println("Running the Flight Computer\n");
  
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  
  if (!SD.begin(BUILTIN_SDCARD)) {
  Serial.println("SD card failed or not present.");
  //tone(buzzer, 3000, 500);
  sdAvailable = false;
} else {
  sdAvailable = true;
}

  HWSERIAL.begin(57600);
  CAM_SERIAL.begin(57600);

  pinMode(main_1, OUTPUT);
  pinMode(main_2, OUTPUT);
  pinMode(drogue_1, OUTPUT);
  pinMode(drogue_2, OUTPUT);
  //pinMode(buzzer, OUTPUT);
  pinMode(camera1, OUTPUT);
  pinMode(camera2, OUTPUT);


  

// BPM390 Setup
  Serial.println("BMP390 Setup");
  if (!bmpModule.begin()){
    Serial.println("Could not find a valid BMP sensor");
    //while (1);
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

  // filter.begin(200); // Initialize Madwick at 200Hz
  algo.begin(200);

  String dataString = "Temp,Press,Alt,Accel_x2,Accel_y2,Accel_z2,Accel_x,Accel_y,Accel_z,Gyro_x,Gyro_y,Gyro_z,Mag_x,Mag_y,Mag_z,Quaternion_1,Quaternion_2,Quaternion_3,Quaternion_4,Stage";
  writeSD(dataString);

  for (int i = 0; i <= 10; i++){
     BPM_SensorData BPM_data = bmpModule.readData();
    if (BPM_data.temperature != -999) {
    startAlt = BPM_data.altitude;
  }
    else {
    Serial.println("Failed to get BPM390 data");
  }}
 

  // Serial.println(startAlt);
  delay(1000);
  //tone(buzzer, 3100);
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
    Accel_y2 = -LIS3DH_data.accel_z;
    Accel_z2 = -LIS3DH_data.accel_y;
  }
  else {
    Serial.println("Failed to get LIS3DH data");
  }

// LSM9DS1 Data
  LSM9DS1_SensorData LSM9DS1_data = LSM9DS1Module.readData();

  if (LSM9DS1_data.accel_x != -999 && LSM9DS1_data.accel_y != -999 && LSM9DS1_data.accel_z != -999 &&
      LSM9DS1_data.gyro_x != -999 && LSM9DS1_data.gyro_y != -999 && LSM9DS1_data.gyro_z != -999 &&
      LSM9DS1_data.mag_x != -999 && LSM9DS1_data.mag_y != -999 && LSM9DS1_data.mag_z != -999){
        
        Accel_x = -LSM9DS1_data.accel_x;
        Accel_y = -LSM9DS1_data.accel_z;
        Accel_z = -LSM9DS1_data.accel_y;

        Gyro_x = -LSM9DS1_data.gyro_x + .0448;
        Gyro_y = -LSM9DS1_data.gyro_z -.0283;
        Gyro_z = -LSM9DS1_data.gyro_y + .0956;

        Mag_x = -LSM9DS1_data.mag_x;
        Mag_y = -LSM9DS1_data.mag_z;
        Mag_z = -LSM9DS1_data.mag_y;

        // filter.update(Gyro_x, Gyro_y, Gyro_z, Accel_x, Accel_y, Accel_z, Mag_x, Mag_y, Mag_z);
        algo.update(Gyro_x, Gyro_y, Gyro_z, Accel_x, Accel_y, Accel_z, Mag_x, Mag_y, Mag_z);

        float qw, qx, qy, qz;
        algo.getQuaternion(&qw, &qx, &qy, &qz);

        // Store quaternion values
        Quaternion_1 = qw;
        Quaternion_2 = qx;
        Quaternion_3 = qy;
        Quaternion_4 = qz;

      }
  else {
    Serial.println("Failed to get LSM9DS1 data");
  }


  // launch_flag = true;
  // drogue_flag = false;
  // main_flag = false;



  // if (launch_flag == false) {
  //   if (rise_counter > 10 && pre_alt - Alt < 0) {
  //     launch_flag = true;
  //     stage = 1;

  //     // HWSERIAL.println("Launch Detected\n\n\n\n\n\n\n\n\n\n\n");
  //     writeSD("Launch Detected!");

  //   } else if (pre_alt - Alt < 0) {
  //     rise_counter = rise_counter + 1;
  //   } else {
  //     rise_counter = 0;
  //   }
  // } else if (launch_flag == true && drogue_flag == false) {
  //   if (fall_counter > 3 && round(pre_alt) - round(Alt) > 0) {
  //       drogue_flag = true;
  //       stage = 2;

  //       digitalWrite(drogue_1, HIGH);
  //       delay(charge_delay);
  //       digitalWrite(drogue_1, LOW);
  //       writeSD("Primary Drogue Deployed");

  //       delay(backup_delay);

  //       digitalWrite(drogue_2, HIGH);
  //       delay(charge_delay);
  //       digitalWrite(drogue_2, LOW);
  //       writeSD("Secondary Drogue Deployed");

  //       // HWSERIAL.println("Drogue Deployed \n\n\n\n\n\n\n\n\n\n\n\n");
  //   } else if (round(pre_alt) - round(Alt) > 0) {
  //       fall_counter = fall_counter + 1;
  //   } else {
  //       fall_counter = 0;
  //   }
  // } else if (launch_flag == true && main_flag == false && drogue_flag == true) {
  //   if (Alt < (startAlt+304.8)) {
  //     main_flag = true;
  //     stage = 3;

  //     digitalWrite(main_1, HIGH);
  //     delay(charge_delay);
  //     digitalWrite(main_1, LOW);
  //     writeSD("Primary Main Deployed");
  //     delay(backup_delay);

  //     digitalWrite(main_2, HIGH);
  //     delay(charge_delay);
  //     digitalWrite(main_2, LOW);
  //     writeSD("Secondary Main Deployed");
      
  //     // HWSERIAL.println("Main Deployed \n\n\n\n\n\n\n");
  //   }
  // }

    if (!launch_flag) {
      if (rise_counter > 10 && (pre_alt - Alt < 0 )) {
        launch_flag = true;
        writeSD("LAUNCHED");        
      } else if (pre_alt - Alt < 0 ) {
        rise_counter++;
      } else {
        rise_counter = 0;
      }
    }
    if (!drogue_flag) {
      if ((pre_alt - Alt > 0.1 && fall_counter >= 1) && (Alt - startAlt > 500)) {
        drogue_flag = true;
        digitalWrite(drogue_1, HIGH);
        delay(charge_delay);
        digitalWrite(drogue_1, LOW);
        writeSD("Primary Drogue Deployed");

        delay(backup_delay);

        digitalWrite(drogue_2, HIGH);
        delay(charge_delay);
        digitalWrite(drogue_2, LOW);
        writeSD("Secondary Drogue Deployed");
      }
      else if ((pre_alt - Alt > 0.1)){
        fall_counter = fall_counter + 1;
      }
      else{
        fall_counter = 0;
      }
    }
    
    if (!main_flag) {
      if ((Alt >= 200 + startAlt) && (Alt <= 308 + startAlt) && (pre_alt - Alt > 1)) { // 1 should be changed to terminal velocity
        main_flag = true;
        digitalWrite(main_1, HIGH);
        delay(charge_delay);
        digitalWrite(main_1, LOW);
        writeSD("Primary Main Deployed");

        delay(backup_delay);

        digitalWrite(main_2, HIGH);
        delay(charge_delay);
        digitalWrite(main_2, LOW);
        writeSD("Secondary Main Deployed");
      }
    }
        

  pre_alt = Alt;

// Print combined data

  String dataString = String(Temp, 7) + "," + String(Press, 7) + "," + String(Alt, 7) + "," +
                String(Accel_x2, 7) + "," + String(Accel_y2, 7) + "," + String(Accel_z2, 7) + "," +
                String(Accel_x, 7) + "," + String(Accel_y, 7) + "," + String(Accel_z, 7) + "," +
                String(Gyro_x, 7) + "," + String(Gyro_y, 7) + "," + String(Gyro_z, 7) + "," +
                String(Mag_x, 7) + "," + String(Mag_y, 7) + "," + String(Mag_z, 7) + "," +
                String(Quaternion_1, 7) + "," + String(Quaternion_2, 7) + "," + 
                String(Quaternion_3, 7) + "," + String(Quaternion_4, 7) + "," +
                String(stage) + "," + String(millis());

  //Serial.println(dataString); 
              

  HWSERIAL.println(dataString);
  
  //writeSD(dataString);


  if(HWSERIAL.available() > 0) {
    String receivedData = HWSERIAL.readStringUntil('\n');
    receivedData.trim();
    if(receivedData == "ON"){
      HWSERIAL.println("TEENSY Camera on");
      digitalWrite(camera1,HIGH);
      digitalWrite(camera2,HIGH);
    }else if (receivedData == "OFF"){
      HWSERIAL.println("TEENSY Camera off");
      digitalWrite(camera1, LOW);
      digitalWrite(camera2, LOW);
    }else if (receivedData == "Fire Main P"){
      Serial.println("Main Primary"); 
      HWSERIAL.println("TEENSY Fired Main Primary");
      digitalWrite(main_1, HIGH);
      delay(charge_delay);
      digitalWrite(main_1, LOW);

    } else if (receivedData == "Fire Main S"){
      Serial.println("Main Secondary"); 
      HWSERIAL.println("TEENSY Fired Main Secondary");
      digitalWrite(main_2, HIGH);
      delay(charge_delay);
      digitalWrite(main_2, LOW);
    } else if (receivedData == "Fire Drogue P"){
      Serial.println("Drogue Primary"); 
      HWSERIAL.println("TEENSY Fired Drogue Primary");
      digitalWrite(drogue_1, HIGH);
      delay(charge_delay);
      digitalWrite(drogue_1, LOW);
    } else if (receivedData == "Fire Drogue S"){
      Serial.println("Drogue Secondary"); 
      HWSERIAL.println("TEENSY Fired Drogue Secondary");
      digitalWrite(drogue_2, HIGH);
      delay(charge_delay);
      digitalWrite(drogue_2, LOW); 

    }
  
  } }
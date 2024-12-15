// UCI RP - SOLIDS - AVIONICS
#include <SD.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_LIS3MDL.h>
#include "Adafruit_BMP3XX.h"
#include <Adafruit_LSM6DS3TRC.h>
#include <Adafruit_LIS3DH.h>
#include <SoftwareSerial.h>
// ----------------------------
#define main_1 4     // main primary
#define main_2 2     // main secondary     
#define drogue_1 7   // drogue primary
#define drogue_2 9  // drogue secondary
#define buzzer 6    // buzzer
#define SEALEVELPRESSURE_HPA (1013.25)
// ----------------------------
Adafruit_BMP3XX bmp;
Adafruit_LIS3MDL mdl;
Adafruit_LSM6DS3TRC lsm;
Adafruit_LIS3DH lis = Adafruit_LIS3DH();
SoftwareSerial mySerial(0,1); // RX, TX
// ----------------------------
const int delay_time = 10;
const int charge_delay = 500;
const int backup_delay = 2500;
bool launch_flag;
bool drogue_flag;
bool main_flag;
bool lis3mdl;
bool lis3dh;
int stage;
int fall_counter;
float pre_alt;

// #######################################################################
// #######################################################################

void writeSD(String data) {
  File dataFile = SD.open("data_log.csv", FILE_WRITE);  
  if (dataFile) {
    dataFile.println(data);
    dataFile.close();
  }
  else {
    Serial.println("Error Opening Data File.\n");
  }
}

void setup() {

  tone(buzzer, 3000, 5000);

  // Serial.print("FLIGHT COMPUTER ON\n");

  Serial.begin(115200);
  mySerial.begin(57600);

  // Serial.print("Initializing SD card...");
  if (!SD.begin(BUILTIN_SDCARD)) {
    // Serial.print("card failed, or not present.\n");
    tone(buzzer, 3000, 5000);
    exit(0);
  }
  // Serial.print("SD-CARD initialized.\n");

  // Serial.print("Connecting to BMP3XX...");
  if (!bmp.begin_I2C(0x77)) {
    // Serial.print("sensor not found, check wiring!\n");
    tone(buzzer, 2000, 10000);
    writeSD("BMP3XX not found");
    exit(0);
  }
  bmp.setTemperatureOversampling(BMP3_OVERSAMPLING_8X);
  bmp.setPressureOversampling(BMP3_OVERSAMPLING_4X);
  bmp.setIIRFilterCoeff(BMP3_IIR_FILTER_COEFF_3);
  bmp.setOutputDataRate(BMP3_ODR_200_HZ);
  // Serial.print("BMP3XX found.\n");

  // Serial.print("Connecting to LSM6DS3TR-C...");
  if (!lsm.begin_I2C(0x6A)) {
    // Serial.print("sensor not found, check wiring!\n");
    writeSD("LSM6DS3TR-C not found");
    tone(buzzer, 2000, 10000);
    exit(0);
  }
  lsm.setAccelRange(LSM6DS_ACCEL_RANGE_16_G);
  lsm.setAccelDataRate(LSM6DS_RATE_6_66K_HZ);
  lsm.setGyroRange(LSM6DS_GYRO_RANGE_250_DPS);
  lsm.setGyroDataRate(LSM6DS_RATE_12_5_HZ)
  // Serial.print("LSM6DS3TR-C found.\n");

  lis3mdl = true;
  // Serial.print("Connecting to LIS3MDL...");
  if (!mdl.begin_I2C(0x1C)) {
    // Serial.print("sensor not found, check wiring!\n");
    lis3mdl = false;
    writeSD("LIS3MDL not found");
    // exit(0);
  }
  mdl.setPerformanceMode(LIS3MDL_ULTRAHIGHMODE)
  mdl.setOperationMode(LIS3MDL_CONTINUOUSMODE);
  mdl.setDataRate(LIS3MDL_DATARATE_155_HZ);  // CHECK !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // Serial.print("LIS3MDL found.\n");

  lis3dh = true;
  // Serial.print("Connecting to LIS3DH...");
  if (!lis.begin(0x18)) {
    // Serial.print("sensor not found, check wiring!\n");
    lis3dh = false;
    writeSD("LIS3DH not found");
    // exit(0);
  }
  lis.setDataRate(LIS3DH_DATARATE_50_HZ)
  // Serial.print("LIS3DH found.\n");  
  
  Serial.print("Altitude, Temperature, Pressure, Acceleration [X, Y, Z] (m/s^2), Orientation [X, Y, Z] (rad/s), Magnetic Field [X, Y, Z] (uTesla):\n");

  launch_flag = false;
  drogue_flag = false;
  main_flag = false;
  fall_counter = 0;
  pre_alt = 0;
  stage = -1;

  writeSD("Successful Initialization");

  String dataString = "Time(ms)," +
                      "Altitude(m)," +
                      "Temperature(C)," +
                      "Pressure(hPa)," +
                      "X-Acceleration(m/s^2)," +
                      "Y-Acceleration(m/s^2)," +
                      "Z-Acceleration(m/s^2)," +
                      "X-Angular Velocity(rad/s)," +
                      "Y-Angular Velocity(rad/s)," +
                      "Z-Angular Velocity(rad/s)," +
                      "X-Magnetic Field(uT)," +
                      "Y-Magnetic Field(uT)," +
                      "Z-Magnetic Field(uT)," +
                      "X-Acceleration(m/s^2)," +
                      "Y-Acceleration(m/s^2)," +
                      "Z-Acceleration(m/s^2)," +
                      "Flight Stage";
  writeSD(dataString);
}

// #######################################################################
// #######################################################################

float time;
float alt, temp, pres;
float acc_x, acc_y, acc_z;
float gyro_x, gyro_y, gyro_z;
float mag_x, mag_y, mag_z;
float acc_x_2, acc_y_2, acc_z_2;

void loop() {
  // tone(buzzer, 2000, 500); // comment out for actual flight
  
  time = millis()

  if (! bmp.performReading()) {
    // Serial.println("BMP failed to perform reading.\n");
    writeSD("BMP3XX Sensor Failure");
    tone(buzzer, 2000, 500);
    exit(0);
  }
  
  alt = bmp.readAltitude(SEALEVELPRESSURE_HPA);
  temp = bmp.temperature;
  pres = bmp.pressure / 100.0;

  sensors_event_t acc, gyro, tmp; 
  lsm.getEvent(&acc, &gyro, &tmp);

  acc_x = acc.acceleration.x;
  acc_y = acc.acceleration.y;
  acc_z = acc.acceleration.z;

  gyro_x = gyro.gyro.x;
  gyro_y = gyro.gyro.y;
  gyro_z = gyro.gyro.z;

  if (lis3mdl) {
    sensors_event_t mag;
    mdl.getEvent(&mag);
    mag_x = mag.magnetic.x;
    mag_y = mag.magnetic.y;
    mag_z = mag.magnetic.z;
  }
  else {
    mag_x = 0.0;
    mag_y = 0.0;
    mag_z = 0.0;
  }

  if (lis3dh) {
    sensors_event_t acel;
    lis.getEvent(&acel);
    acc_x_2 = acel.acceleration.x;
    acc_y_2 = acel.acceleration.y;
    acc_z_2 = acel.acceleration.z;
  }
  else {
    acc_x_2 = 0.0;
    acc_y_2 = 0.0;
    acc_z_2 = 0.0;
  }
  
  // {tasks} ------------------------------------
  if (launch_flag == false) {

    if (abs(acc_x) > 30) {      // launch condition for rocket - acceleration spikes
      launch_flag = true;
      stage = 0;
    }
    else if (abs(acc_y) > 30) { // launch condition for rocket - acceleration spikes
      launch_flag = true;
      stage = 0;
    }
    else if (abs(acc_z) > 30) { // launch condition for rocket - acceleration spikes
      launch_flag = true;
      stage = 0;
    }

  }
  else if (launch_flag == true && drogue_flag == false) {
    
    if (fall_counter > 3 && pre_alt - alt > 0) {
      drogue_flag = true;
      stage = 1;

      digitalWrite(drogue_1, HIGH);
      delay(charge_delay);
      digitalWrite(drogue_1, LOW);
      delay(backup_delay);

      digitalWrite(drogue_2, HIGH);
      delay(charge_delay);
      digitalWrite(drogue_2, LOW);

      writeSD("DROGUE EJECTED");
    }
    else if (pre_alt - alt > 0) {
      fall_counter = fall_counter + 1;
    }
    else {
      fall_counter = 0;
    }

  }
  else if (launch_flag == true && main_flag == false) {
    
    if (alt < 1000) { // eject condition for main - 1,000 ft alt
      main_flag = true;
      stage = 2;
      digitalWrite(main_1, HIGH);
      delay(charge_delay);
      digitalWrite(main_1, LOW);
      
      delay(backup_delay);
      digitalWrite(main_2, HIGH);
      delay(charge_delay);
      digitalWrite(main_2, LOW);
      
      writeSD("MAIN EJECTED");
    }

  }

  pre_alt = alt;

  // {datalogging} ------------------------------------
  String dataString = String(time) + "," +
                      String(alt) + "," + 
                      String(temp) + "," + 
                      String(pres) + "," +
                      String(acc_x) + "," +
                      String(acc_y) + "," +
                      String(acc_z) + "," +
                      String(gyro_x) + "," +
                      String(gyro_y) + "," +
                      String(gyro_z) + "," +
                      String(mag_x) + "," +
                      String(mag_y) + "," +
                      String(mag_z) + "," +
                      String(acc_x_2) + "," +
                      String(acc_y_2) + "," +
                      String(acc_z_2) + "," +
                      String(stage);
                      
  Serial.println(dataString);
  mySerial.println(dataString);
  
  writeSD(dataString);
  // --------------------------------------------------
  delay(delay_time);
}

// #######################################################################

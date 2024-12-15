// UCI RP - SOLIDS - AVIONICS

#include <SD.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_LSM6DS3TRC.h>
#include <Adafruit_LIS3MDL.h>
#include "Adafruit_BMP3XX.h"

#define SEALEVELPRESSURE_HPA (1013.25)
// ----------------------------
#define main_1 7
// #define main_2 8
// #define drogue_1 9 
#define drogue_2 10
#define buzzer 40
// ----------------------------
Adafruit_BMP3XX bmp;
Adafruit_LSM6DS3TRC lsm;
Adafruit_LIS3MDL mdl;
// ----------------------------
const int delay_time = 1000;
const int charge_delay = 500;
const int backup_delay = 2500;
bool launch_flag;
bool drogue_flag;
bool main_flag;
int fall_counter;
float pre_alt;

// #######################################################################
// #######################################################################

void setup() {

  Serial.begin(9600);

  delay(30000);
  // analogWrite(buzzer, HIGH);
  // Serial.print("BUZZZZZZZZZZZ\n");
  // delay(1000);
  // analogWrite(buzzer, LOW);

  // Serial.print("Initializing SD card...");
  // if (!SD.begin(BUILTIN_SDCARD)) {
  //   Serial.print("card failed, or not present.\n");
  //   Serial.print("### -- Flight Computer Crashed. -- ###\n");
  //   exit(0);
  // }
  // Serial.print("card initialized.\n");

  // Serial.print("Connecting to BMP390...");
  // if (!bmp.begin_I2C()) {
  //   Serial.print("sensor not found, check wiring!\n");
  //   Serial.print("### -- Flight Computer Crashed. -- ###\n");
  //   exit(0);
  // }
  // Serial.print("sensor found.\n");

  // Serial.print("Connecting to LSM6DS3TR-C...");
  // if (!lsm.begin_I2C()) {
  //   Serial.print("sensor not found, check wiring!\n");
  //   Serial.print("### -- Flight Computer Crashed. -- ###\n");
  //   exit(0);
  // }
  // Serial.print("sensor found.\n");

  // Serial.print("Connecting to LIS3MDL...");
  // if (!mdl.begin_I2C()) {
  //   Serial.print("sensor not found, check wiring!\n");
  //   Serial.print("### -- Flight Computer Crashed. -- ###\n");
  //   exit(0);
  // }
  // Serial.print("sensor found.\n");

  // Serial.print("Altitude, Temperature, Pressure, Acceleration [X, Y, Z], Orientation [X, Y, Z], Magnetic Field [X, Y, Z]:\n");

  // launch_flag = true;
  // drogue_flag = false;
  // main_flag = false;
  // fall_counter = 0; 
  // pre_alt = 0;



  // delay(10000);
  // digitalWrite(drogue_1, HIGH);
  // delay(500);
  // digitalWrite(drogue_1, LOW);
  // Serial.println("DROGUE 1 FIRE++++++++++++++++++++");

  delay(10000);
  digitalWrite(drogue_2, HIGH);
  delay(500);
  digitalWrite(drogue_2, LOW);
  Serial.println("DROGUE 2 FIRE++++++++++++++++++++");

  delay(10000);
  digitalWrite(main_1, HIGH);
  delay(500);
  digitalWrite(main_1, LOW);
  Serial.println("MAIN 1 FIRE++++++++++++++++++++");

  // delay(10000);
  // digitalWrite(main_2, HIGH);
  // delay(500);
  // digitalWrite(main_2, LOW);
  // Serial.println("MAIN 2 FIRE++++++++++++++++++++");

}

// #######################################################################
// #######################################################################

float alt, temp, pres;
float acc_x, acc_y, acc_z;
float gyro_x, gyro_y, gyro_z;
float mag_x, mag_y, mag_z;

void loop() {
  
  // --------------------------------------------------
  delay(delay_time);
}

// #######################################################################

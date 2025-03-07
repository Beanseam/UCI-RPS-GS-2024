#include <Wire.h>
#include <Adafruit_Sensor.h>
#include "Adafruit_BMP3XX.h"

const int delay_time = 500;
#define buzzer 6    // buzzer
#define SEALEVELPRESSURE_HPA (1013.25)

// #define Wire Wire2
// Wire.setSCL(24);
// Wire.setSDA(25);
// Wire1.begin();

Adafruit_BMP3XX bmp;

void setup() {
  Wire2.setSCL(24);
  Wire2.setSDA(25);
  Serial.begin(57600);
  // tone(buzzer, 2000, 1000);

  // delay(2000);


  while (!Serial);
  Serial.println("Adafruit BMP390");

  if (!bmp.begin_I2C(0x77, &Wire2)) {  // hardware I2C mode
    Serial.println("Could not find a valid BMP3xx sensor, check wiring!");
    
    exit(0);
    while (1);
  }

  
  

  // // Set up oversampling and filter initialization
  // bmp.setTemperatureOversampling(BMP3_OVERSAMPLING_2X);
  // // BMP3_OVERSAMPLING_2X
  // // BMP3_No_OVERSAMPLING
  // bmp.setPressureOversampling(BMP3_OVERSAMPLING_32X);
  // bmp.setIIRFilterCoeff(BMP3_IIR_FILTER_COEFF_3);
  // //DISABLE);
  // //COEFF_3);
  // bmp.setOutputDataRate(BMP3_ODR_25_HZ);

  Serial.println("Sekunden,Temp,Press,Alt");
}


void loop() {

  tone(buzzer, 2000, 1000);
  
  float Temp, Press, Alt;

  if (! bmp.performReading()) {
    Serial.println("Failed to perform reading.\n");
    exit(0);
  }

  Temp = bmp.temperature;
  Serial.print(Temp); Serial.print(",");
  
  Press = bmp.pressure / 100.0;
  Serial.print(Press); Serial.print(",");
  
  Alt = bmp.readAltitude(SEALEVELPRESSURE_HPA);
  Serial.println(Alt);

  delay(delay_time);
}

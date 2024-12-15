#define main_1 4     // main primary
#define main_2 2     // main secondary     
#define drogue_1 7   // drogue primary
#define drogue_2 9  // drogue secondary
#define buzzer 6    // buzzer

const int delay_time = 1000;
const int charge_delay = 500;
const int backup_delay = 2500;

void setup() {
  // put your setup code here, to run once:

  tone(buzzer, 1000);
  delay(30000);
  noTone(buzzer);

  Serial.print("FLIGHT COMPUTER ON\n");

  Serial.begin(115200);

  delay(1000);

  // digitalWrite(drogue_1, LOW);
  // digitalWrite(drogue_2, LOW);
  // digitalWrite(main_1, LOW);
  // digitalWrite(main_2, LOW);






}

void loop() {
  // put your main code here, to run repeatedly:
  

  digitalWrite(drogue_1, HIGH);
  delay(charge_delay);
  digitalWrite(drogue_1, LOW);
  Serial.println("DROGUE 1 FIRE++++++++++++++++++++");
  // delay(backup_delay);
  digitalWrite(drogue_2, HIGH);
  delay(charge_delay);
  digitalWrite(drogue_2, LOW);
  Serial.println("DROGUE 2 FIRE++++++++++++++++++++");

  // tone(buzzer, 3000, 1000);

  digitalWrite(main_1, HIGH);
  delay(charge_delay);
  digitalWrite(main_1, LOW);
  Serial.println("MAIN 1 FIRE++++++++++++++++++++");
  // delay(backup_delay);
  digitalWrite(main_2, HIGH);
  delay(charge_delay);
  digitalWrite(main_2, LOW);
  Serial.println("MAIN 2 FIRE++++++++++++++++++++");

  // tone(buzzer, 2000, 1000);
}

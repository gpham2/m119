#include <Arduino_LSM6DS3.h>

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  while (!Serial);

  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");

    while (1);
  }
}

void loop() {
  // put your main code here, to run repeatedly:
  float ax, ay, az, gx, gy, gz;
  if (IMU.accelerationAvailable() && IMU.gyroscopeAvailable()) {
    IMU.readAcceleration(ax, ay, az);
    IMU.readGyroscope(gx, gy, gz);

    Serial.print("ax: ");
    Serial.print(ax);
    Serial.print("\tay: ");
    Serial.print(ay);
    Serial.print("\taz: ");
    Serial.print(az);
    Serial.print("\tgx: ");
    Serial.print(gx);
    Serial.print("\tgy: ");
    Serial.print(gy);
    Serial.print("\tgz: ");
    Serial.print(gz);
    Serial.println();
  }
  else {
    Serial.println("UH OH");
  }
  delay(500);
}

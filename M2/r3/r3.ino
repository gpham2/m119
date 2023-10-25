#include <ArduinoBLE.h>
#include <Arduino_LSM6DS3.h>

#define BLE_UUID_IMU_SERVICE "1101"
#define BLE_UUID_ACCELEROMETER_X "2101"
#define BLE_UUID_ACCELEROMETER_Y "2102"
#define BLE_UUID_ACCELEROMETER_Z "2103"
#define BLE_UUID_GYROSCOPE_X "2201"
#define BLE_UUID_GYROSCOPE_Y "2202"
#define BLE_UUID_GYROSCOPE_Z "2203"


#define BLE_DEVICE_NAME "GIANG"
#define BLE_LOCAL_NAME "GIANG"

BLEService accelerometerService(BLE_UUID_IMU_SERVICE);

BLEStringCharacteristic accelerometerCharacteristicX(BLE_UUID_ACCELEROMETER_X, BLERead | BLENotify, 20);
BLEStringCharacteristic accelerometerCharacteristicY(BLE_UUID_ACCELEROMETER_Y, BLERead | BLENotify, 20);
BLEStringCharacteristic accelerometerCharacteristicZ(BLE_UUID_ACCELEROMETER_Z, BLERead | BLENotify, 20);
BLEStringCharacteristic gyroCharacteristicX(BLE_UUID_GYROSCOPE_X, BLERead | BLENotify, 20);
BLEStringCharacteristic gyroCharacteristicY(BLE_UUID_GYROSCOPE_Y, BLERead | BLENotify, 20);
BLEStringCharacteristic gyroCharacteristicZ(BLE_UUID_GYROSCOPE_Z, BLERead | BLENotify, 20);


BLEDescriptor descriptorX("2901", "AccelerometerX");
BLEDescriptor descriptorY("2901", "AccelerometerY");
BLEDescriptor descriptorZ("2901", "AccelerometerZ");
BLEDescriptor descriptorX0("2901", "GyroscopeX");
BLEDescriptor descriptorY0("2901", "GyroscopeY");
BLEDescriptor descriptorZ0("2901", "GyroscopeZ");





float x, y, z, a, b, c;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);

  // initialize IMU
  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1)
      ;
  }

  Serial.print("Accelerometer sample rate = ");
  Serial.print(IMU.accelerationSampleRate());
  Serial.println("Hz");

  // initialize BLE
  if (!BLE.begin()) {
    Serial.println("Starting Bluetooth® Low Energy module failed!");
    while (1)
      ;
  }

  // set advertised local name and service UUID
  BLE.setDeviceName(BLE_DEVICE_NAME);
  BLE.setLocalName(BLE_LOCAL_NAME);


  BLE.setAdvertisedService(accelerometerService);

  accelerometerCharacteristicX.addDescriptor(descriptorX);
  accelerometerCharacteristicY.addDescriptor(descriptorY);
  accelerometerCharacteristicZ.addDescriptor(descriptorZ);
  gyroCharacteristicX.addDescriptor(descriptorX0);
  gyroCharacteristicY.addDescriptor(descriptorY0);
  gyroCharacteristicZ.addDescriptor(descriptorZ0);


  accelerometerService.addCharacteristic(accelerometerCharacteristicX);
  accelerometerService.addCharacteristic(accelerometerCharacteristicY);
  accelerometerService.addCharacteristic(accelerometerCharacteristicZ);
  accelerometerService.addCharacteristic(gyroCharacteristicX);
  accelerometerService.addCharacteristic(gyroCharacteristicY);
  accelerometerService.addCharacteristic(gyroCharacteristicZ);

  

  BLE.addService(accelerometerService);

  accelerometerCharacteristicX.writeValue("");
  accelerometerCharacteristicY.writeValue("");
  accelerometerCharacteristicZ.writeValue("");
  gyroCharacteristicX.writeValue("");
  gyroCharacteristicY.writeValue("");
  gyroCharacteristicZ.writeValue("");


  // start advertising
  BLE.advertise();

  Serial.println("BLE Accelerometer Peripheral");
}

void loop() {
  BLEDevice central = BLE.central();
  Serial.println("HUHH");
  delay(1000);
  if (IMU.accelerationAvailable() && IMU.gyroscopeAvailable()) {
    digitalWrite(LED_BUILTIN, HIGH);
    IMU.readAcceleration(x, y, z);
    IMU.readGyroscope(a, b, c);


    // Convert the accelerometer data to UTF-8 encoded strings
    String xStr = String(x, 6); // You can adjust the number of decimal places as needed
    String yStr = String(y, 6);
    String zStr = String(z, 6);
    String aStr = String(a, 6); // You can adjust the number of decimal places as needed
    String bStr = String(b, 6);
    String cStr = String(c, 6);
   

    accelerometerCharacteristicX.writeValue(xStr);
    accelerometerCharacteristicY.writeValue(yStr);
    accelerometerCharacteristicZ.writeValue(zStr);
    gyroCharacteristicX.writeValue(aStr);
    gyroCharacteristicY.writeValue(bStr);
    gyroCharacteristicZ.writeValue(cStr);


  } else {
    digitalWrite(LED_BUILTIN, LOW);
  }
}
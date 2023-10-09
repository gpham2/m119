#include <Arduino_LSM6DS3.h>

void setup() {
  // put your setup code here, to run once:
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

// Constants
const int DOT_DUR = 200;   // Duration of a dot
const int DASH_DUR = 500;  // Duration of a dash
const int ELE_SPACING = 200;  // Spacing between dots and dashes
const int CHAR_SPACING = 800;  // Spacing between characters
const int WORD_SPACING = 1000;  // Spacing between words

int length = 10;
String morseCode[] = {"/", "....", ".", ".-..", ".-..", "---", "/", "..", "--","..-"};



void loop() {  
  for (int i = 0; i < length; i++) {
    String currChar = morseCode[i];
    for (int j = 0; j < sizeof(currChar); j++) {
      
      char dotdashSpace = currChar.charAt(j);

      if (dotdashSpace == '.') {
        digitalWrite(LED_BUILTIN, HIGH);
        delay(DOT_DUR);

      } else if (dotdashSpace == '-') {
        digitalWrite(LED_BUILTIN, HIGH);
        delay(DASH_DUR);

      } else if (dotdashSpace == '/') {
        delay(WORD_SPACING);
      }
      
      digitalWrite(LED_BUILTIN, LOW);
      delay(ELE_SPACING);
    }

    delay(CHAR_SPACING);
  }
}

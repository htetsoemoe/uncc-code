#include <stdio.h>

// Returns the length of a string pointer
int length(char s[]) {
  char c = s[0];
  int length = 0;

  while (c != '\0') {
    length++;
    c = s[length];
  }

  return length;
}

int main() {
    // Defining a new variable 'a', and a new pointer 'my_pointer'.
    // 'my_pointer' saves the address of a.
    int a = 20;
    int * my_pointer = &a;
    printf("my_pointer address is %p.\n", &my_pointer);
    printf("my_pointer value is %i\n", *my_pointer);

    char myStr[6];

    myStr[0] = 'T';
    myStr[1] = 'e';
    myStr[2] = 's';
    myStr[3] = 't';
    myStr[4] = '\0'; // need this ending character

    // Like String data type in other programming language
    char *myOtherStr = "This is my string";

    printf("The length of my string is: %d\n", length(myStr));
    printf("My string address is: %p\n", myStr);
    printf("My string address is: %p\n", &myStr[0]);

    return 0;
}

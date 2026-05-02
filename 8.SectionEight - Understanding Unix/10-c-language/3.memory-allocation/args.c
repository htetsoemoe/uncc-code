#include <stdio.h>

// argc is argument count, argv is argument vector === array

int main(int argc, char* argv[]) {

  for (int i = 0; i < argc; i++) {
    printf("Argument %d is: %s\n", i, argv[i]);
  }

  return 0;
}
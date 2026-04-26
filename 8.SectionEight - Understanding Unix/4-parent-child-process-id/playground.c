#include <stdio.h>
#include <unistd.h> 

int main(int argc, char *argv[]) {

  for (int i = 0; i < argc; i++) {
      printf("argv number %d is: %s\n", i, argv[i]);
  }

  printf("Process ID: %d\n", getpid());
  printf("Parent Process ID: %d\n", getppid());


  return 0;
}
#include<stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {

    int a = 20;
    int b = 30;
    int c = add(a, b);

    char my_character = 'g';

    float foo = 234234.23423;

    size_t t = 15934; // 8 bytes in memory

    fprintf(stdout, "Size of a long int value is: %zu bytes.\n", sizeof(long int));
    printf("address is %p.\n", &t); // & is memory address or pointer and print like => address is 0x7ffd0e122e50.

    for (int i = 0; i < sizeof(size_t); ++i) {
        printf("Byte %d address: %p. Value is %c \n", i, (void *)((char *)&t + i), *(((char *)&t + i)));
    }

    /*
        Byte 0 address: 0x7ffd0e122e50. Value is > 
        Byte 1 address: 0x7ffd0e122e51. Value is > 
        Byte 2 address: 0x7ffd0e122e52. Value is  
        Byte 3 address: 0x7ffd0e122e53. Value is  
        Byte 4 address: 0x7ffd0e122e54. Value is  
        Byte 5 address: 0x7ffd0e122e55. Value is  
        Byte 6 address: 0x7ffd0e122e56. Value is  
        Byte 7 address: 0x7ffd0e122e57. Value is
    */

    return 0;
}
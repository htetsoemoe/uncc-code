#include <stdio.h>
#include <pthread.h>

#define COUNT 100 // times to increment the value in each thread
#define THREADS 4 // number of threads

long number = 0;

// This function will run in another thread
void* calc(void* arg) {
  for (long i = 0; i < COUNT; i++) {
    ++number;
  }

  return NULL;
}

int main() {
  pthread_t threads[THREADS];

  // Spawn the threads
  for (int i = 0; i < THREADS; i++) {
    pthread_create(&threads[i], NULL, calc, NULL);
  }

  // Wait for all the threads to complete
  for (int i = 0; i < THREADS; i++) {
    pthread_join(threads[i], NULL);
  }

  printf("Final number: %ld\n", number);
  printf("Expected value: %ld\n", (long)COUNT * THREADS);

  return 0;
}

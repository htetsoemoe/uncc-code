#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

#define COUNT 100000000 // times to increment the value in each thread
#define THREADS 8 // number of threads

long number = 0;
sem_t semaphore;

// This function will run in another thread
void* calc(void* arg) {
  for (long i = 0; i < COUNT; i++) {
    // Decrements the semaphore value by 1. If old value is greater than 0, it proceeds.
    sem_wait(&semaphore);

    ++number;

    // Increments the semaphore value by 1
    sem_post(&semaphore);
  }

  return NULL;
}

int main() {
  pthread_t threads[THREADS];

  // Initialize the semaphore to 1
  sem_init(&semaphore, 0, 1);

  // Spawn the threads
  for (int i = 0; i < THREADS; i++) {
    pthread_create(&threads[i], NULL, calc, NULL);
  }

  // Wait for all the threads to complete
  for (int i = 0; i < THREADS; i++) {
    pthread_join(threads[i], NULL);
  }

  sem_destroy(&semaphore);

  printf("Final number: %ld\n", number);
  printf("Expected value: %ld\n", (long)COUNT * THREADS);

  return 0;
}

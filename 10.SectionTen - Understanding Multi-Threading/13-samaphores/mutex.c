#include <stdio.h>
#include <pthread.h>

#define COUNT 100000000 // times to increment the value in each thread
#define THREADS 20 // number of threads

long number = 0;
pthread_mutex_t mutex;

// This function will run in another thread
void* calc(void* arg) {
  for (long i = 0; i < COUNT; i++) {
    pthread_mutex_lock(&mutex);  // lock
    ++number;
    pthread_mutex_unlock(&mutex);  // unlock
  }

  return NULL;
}

int main() {
  pthread_t threads[THREADS];

  // Initialize the mutex
  pthread_mutex_init(&mutex, NULL);

  // Spawn the threads
  for (int i = 0; i < THREADS; i++) {
    pthread_create(&threads[i], NULL, calc, NULL);
  }

  // Wait for all the threads to complete
  for (int i = 0; i < THREADS; i++) {
    pthread_join(threads[i], NULL);
  }

  pthread_mutex_destroy(&mutex);

  printf("Final number: %ld\n", number);
  printf("Expected value: %ld\n", (long)COUNT * THREADS);

  return 0;
}

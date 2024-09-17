<template>
  <div
    class="min-vh-100 bg-gradient d-flex flex-column justify-content-center align-items-center py-4 px-3 px-sm-6 px-lg-8"
  >
    <div class="text-center max-w-md w-100">
      <div class="position-relative">
        <h1 class="display-1 font-weight-bold text-secondary">404</h1>
        <p
          class="fs-2 fw-semibold text-dark position-absolute top-50 start-50 translate-middle"
        >
          Oops! Page not found
        </p>
      </div>
      <div class="mt-4 mt-sm-5">
        <p class="text-muted fs-5">
          We couldn't find the page you're looking for. It might have been
          removed, renamed, or doesn't exist.
        </p>
        <div class="d-flex justify-content-center">
          <router-link to="/" class="btn btn-lg btn-primary">
            Return Home
          </router-link>
        </div>
      </div>
      <div class="mt-5 d-flex justify-content-center gap-3">
        <div
          v-for="i in 3"
          :key="i"
          class="w-3 h-3 bg-secondary rounded-circle"
          :style="{ animationDelay: `${i * 0.1}s`, animationName: 'bounce' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No special logic needed for this static page
</script>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-1rem);
  }
}
</style>

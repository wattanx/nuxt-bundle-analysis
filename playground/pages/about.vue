<script setup lang="ts">
const count = ref(0);
</script>

<template>
  <NuxtLogo />
  <Tutorial />

  <div>
    <h1>About Page</h1>
    <p>This is the about page of our Nuxt application.</p>
    <p>Count: {{ count }}</p>
    <button @click="count++">Increment Count</button>
  </div>
</template>

<script setup lang="ts">
import Header from './components/layouts/Header.vue';
</script>

<template>
  <div class="app-shell">
    <!-- <Sidebar class="app-shell__sidebar" /> -->

    <div class="app-shell__content">
      <Header />

      <main class="page">
        <router-view />
      </main>
    </div>
  </div>
</template>
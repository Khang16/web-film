<template>
  <!-- <TextCursor text="✨" /> -->

  <SplashCursor
    :density-dissipation="3.5"
    :velocity-dissipation="2"
    :pressure="0.1"
    :curl="3"
    :splat-radius="0.2"
    :splat-force="6000"
    :color-update-speed="10"
    :shading="true"
    :rainbow-mode="false"
    color="#A855F7"
  />

  <router-view />
</template>

<script setup lang="ts">
import SplashCursor from './components/splashCursor.vue';

// import TextCursor from './components/TextCursor.vue';
</script>

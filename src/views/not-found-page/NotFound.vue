<script setup lang="ts">
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();

const goHome = () => {
  router.push("/product");
};
</script>

<template>
  <div class="error-shell">
    <div class="error-card">
      <div class="badge badge--brand">404</div>

      <h1 class="error-card__title">
        {{ t("notFound.title") }}
      </h1>

      <p class="error-card__lead">
        {{ t("notFound.lead") }}
      </p>

      <div class="error-card__actions">
        <button class="btn btn--primary" @click="goHome">
          {{ t("notFound.backToCatalog") }}
        </button>

        <router-link to="/login" class="btn btn--ghost">
          {{ t("notFound.goToLogin") }}
        </router-link>
      </div>
    </div>
  </div>
</template>
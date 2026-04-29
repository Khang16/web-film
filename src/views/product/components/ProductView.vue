<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useFetchProducts } from "../services/product.query";

const { t } = useI18n();

const { data, isLoading, isError, error } = useFetchProducts();

const productList = computed(() => data.value ?? []);

const formatPrice = (value: number | string) => {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};
</script>

<template>
  <div>
    <section class="product-hero">
      <div class="product-hero__copy">
        <div class="badge badge--brand">{{ t("product.hero.badge") }}</div>

        <h1 class="product-hero__title">
          {{ t("product.hero.title") }}
        </h1>

        <p class="product-hero__lead">
          {{ t("product.hero.lead") }}
        </p>

        <div class="product-hero__actions">
          <router-link to="/login" class="btn btn--secondary">
            {{ t("product.hero.login") }}
          </router-link>

          <router-link to="/product" class="btn btn--primary">
            {{ t("product.hero.refresh") }}
          </router-link>
        </div>

        <div class="product-hero__stats">
          <div class="metric-card">
            <p class="metric-card__value">{{ productList.length }}</p>
            <p class="metric-card__label">{{ t("product.hero.stats.productsShown") }}</p>
          </div>

          <div class="metric-card">
            <p class="metric-card__value">{{ t("product.hero.stats.accentValue") }}</p>
            <p class="metric-card__label">{{ t("product.hero.stats.accentLabel") }}</p>
          </div>

          <div class="metric-card">
            <p class="metric-card__value">{{ t("product.hero.stats.scaleValue") }}</p>
            <p class="metric-card__label">{{ t("product.hero.stats.scaleLabel") }}</p>
          </div>
        </div>
      </div>

      <div class="product-hero__panel">
        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">{{ t("product.hero.panel.canvas") }}</p>
            <p class="product-hero__panel-value">{{ t("product.hero.panel.canvasValue") }}</p>
          </div>
          <span class="product-hero__panel-chip">{{ t("product.hero.panel.stable") }}</span>
        </div>

        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">{{ t("product.hero.panel.primary") }}</p>
            <p class="product-hero__panel-value">{{ t("product.hero.panel.primaryValue") }}</p>
          </div>
          <span class="badge badge--brand">{{ t("product.hero.panel.primaryBadge") }}</span>
        </div>

        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">{{ t("product.hero.panel.layout") }}</p>
            <p class="product-hero__panel-value">{{ t("product.hero.panel.layoutValue") }}</p>
          </div>
          <span class="badge badge--muted">{{ t("product.hero.panel.layoutBadge") }}</span>
        </div>
      </div>
    </section>

    <section class="product-section page__section">
      <div class="product-section__head">
        <div>
          <h2 class="product-section__title">{{ t("product.section.title") }}</h2>
          <p class="product-section__subtitle">
            {{ t("product.section.subtitle") }}
          </p>
        </div>
      </div>

      <div v-if="isLoading" class="loading-grid">
        <div v-for="index in 8" :key="index" class="loading-card" />
      </div>

      <div v-else-if="isError" class="state-card state-card--error">
        {{ error?.message }}
      </div>

      <div v-else class="product-grid">
        <article
          v-for="product in productList"
          :key="product.id"
          class="product-card"
        >
          <div class="product-card__media">
            <img :src="product.thumbnail" :alt="product.title" />
          </div>

          <div class="product-card__body">
            <h3 class="product-card__title">
              {{ product.title }}
            </h3>

            <div class="product-card__meta">
              <span>{{ t("product.card.liveItem") }}</span>
              <span class="badge badge--muted">{{ t("product.card.updated") }}</span>
            </div>

            <p class="product-card__price">
              {{ formatPrice(product.price) }}
            </p>

            <button class="btn btn--primary product-card__button">
              {{ t("product.card.viewDetail") }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style src="./product-view.css"></style>

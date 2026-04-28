<script setup lang="ts">
import { computed } from "vue";
import { useFetchProducts } from "../services/product.query";

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
        <div class="badge badge--brand">Market overview</div>

        <h1 class="product-hero__title">
          Một giao diện tối, gọn và nhiều tín hiệu hơn.
        </h1>

        <p class="product-hero__lead">
          Danh mục sản phẩm được trình bày theo phong cách trading: nền tối,
          một accent vàng duy nhất, các mảng nội dung phẳng và nhịp đo bằng rem.
        </p>

        <div class="product-hero__actions">
          <router-link to="/login" class="btn btn--secondary">
            Đăng nhập
          </router-link>

          <router-link to="/product" class="btn btn--primary">
            Làm mới danh mục
          </router-link>
        </div>

        <div class="product-hero__stats">
          <div class="metric-card">
            <p class="metric-card__value">{{ productList.length }}</p>
            <p class="metric-card__label">Sản phẩm đang hiển thị</p>
          </div>

          <div class="metric-card">
            <p class="metric-card__value">Yellow</p>
            <p class="metric-card__label">Accent duy nhất cho CTA</p>
          </div>

          <div class="metric-card">
            <p class="metric-card__value">rem</p>
            <p class="metric-card__label">Tất cả kích thước dùng rem</p>
          </div>
        </div>
      </div>

      <div class="product-hero__panel">
        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">Canvas</p>
            <p class="product-hero__panel-value">Deep near-black</p>
          </div>
          <span class="product-hero__panel-chip">Stable</span>
        </div>

        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">Primary</p>
            <p class="product-hero__panel-value">#FCD535</p>
          </div>
          <span class="badge badge--brand">Yellow</span>
        </div>

        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">Layout</p>
            <p class="product-hero__panel-value">Flat cards + hairlines</p>
          </div>
          <span class="badge badge--muted">Binance-like</span>
        </div>
      </div>
    </section>

    <section class="product-section page__section">
      <div class="product-section__head">
        <div>
          <h2 class="product-section__title">Product List</h2>
          <p class="product-section__subtitle">
            Sản phẩm được đặt vào card tối với giá và CTA vàng.
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
              <span>Live item</span>
              <span class="badge badge--muted">Updated</span>
            </div>

            <p class="product-card__price">
              {{ formatPrice(product.price) }}
            </p>

            <button class="btn btn--primary product-card__button">
              View Detail
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style src="./product-view.css"></style>

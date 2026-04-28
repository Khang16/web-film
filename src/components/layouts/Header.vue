<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/overview");
};
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <div class="header__brand" @click="goHome">
        HIHI
      </div>

      <nav class="top-nav" aria-label="Primary">
        <router-link to="/overview" class="top-nav__link">
          Phim
        </router-link>

        <router-link to="/product" class="top-nav__link">
          Danh mục
        </router-link>

        <router-link to="/login" class="top-nav__link">
          Đăng nhập
        </router-link>
      </nav>

      <div class="header__actions">
        <label class="search-field" aria-label="Search products">
          <span class="search-field__icon">⌕</span>
          <input
            class="search-field__input"
            type="search"
            placeholder="Tìm sản phẩm..."
          />
        </label>

        <!-- <router-link to="/product" class="btn btn--primary btn--small">
          Khám phá
        </router-link> -->
      </div>
    </div>
  </header>
</template>
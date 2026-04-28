<script setup lang="ts">
import { useRouter } from "vue-router";

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
        Trang này không tồn tại.
      </h1>

      <p class="error-card__lead">
        Đường dẫn đã bị xoá, đổi tên hoặc chưa được gắn vào layout hiện tại.
      </p>

      <div class="error-card__actions">
        <button class="btn btn--primary" @click="goHome">
          Về danh mục
        </button>

        <router-link to="/login" class="btn btn--ghost">
          Đi tới đăng nhập
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../../../composables/use-auth";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();
const { login } = useAuth();

const form = reactive({
  username: "",
  password: "",
});

const handleLogin = async () => {
  try {
    await login(form);
    router.push("/product");
  } catch (error) {
    alert("Sai tài khoản hoặc mật khẩu");
  }
};
</script>

<template>
  <div class="auth-shell">
    <div class="auth-card">
      <div class="badge badge--brand">Secure access</div>

      <h2 class="auth-card__title">
        {{ t("auth.login") }}
      </h2>

      <p class="auth-card__lead">
        Đăng nhập để tiếp tục trong giao diện tối, một accent vàng và hệ thống
        màu được gom vào style.css.
      </p>

      <form class="auth-form" @submit.prevent="handleLogin">
        <input
          v-model="form.username"
          class="field"
          placeholder="Username"
          autocomplete="username"
        />

        <input
          v-model="form.password"
          class="field"
          type="password"
          placeholder="Password"
          autocomplete="current-password"
        />

        <div class="auth-card__actions">
          <button type="submit" class="btn btn--primary">
            {{ t("auth.login") }}
          </button>

          <router-link to="/product" class="btn btn--ghost">
            Về danh mục
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

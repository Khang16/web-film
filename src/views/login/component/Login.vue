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
    alert(t("auth.loginError"));
  }
};
</script>

<template>
  <div class="auth-shell">
    <div class="auth-card">
      <div class="badge badge--brand">{{ t("auth.secureAccess") }}</div>

      <h2 class="auth-card__title">
        {{ t("auth.login") }}
      </h2>

      <p class="auth-card__lead">
        {{ t("auth.loginLead") }}
      </p>

      <form class="auth-form" @submit.prevent="handleLogin">
        <input
          v-model="form.username"
          class="field"
          :placeholder="t('auth.usernamePlaceholder')"
          autocomplete="username"
        />

        <input
          v-model="form.password"
          class="field"
          type="password"
          :placeholder="t('auth.passwordPlaceholder')"
          autocomplete="current-password"
        />

        <div class="auth-card__actions">
          <button type="submit" class="btn btn--primary">
            {{ t("auth.login") }}
          </button>

          <router-link to="/product" class="btn btn--ghost">
            {{ t("auth.backToCatalog") }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

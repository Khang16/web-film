<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <aside class="sidebar-shell">
    <div class="sidebar-brand">
      <div class="sidebar-brand__mark">{{ t("sidebar.brandTitle") }}</div>
      <div class="sidebar-brand__sub">{{ t("sidebar.brandSubtitle") }}</div>
    </div>

    <div class="sidebar-stack">
      <div class="sidebar-pill">{{ t("sidebar.liveShell") }}</div>

      <div class="sidebar-card sidebar-card--active">
        <div class="sidebar-card__top">
          <div class="sidebar-card__title">{{ t("sidebar.productFeed") }}</div>
          <div class="badge badge--brand">{{ t("sidebar.active") }}</div>
        </div>
        <p class="sidebar-card__meta">
          {{ t("sidebar.productFeedMeta") }}
        </p>
      </div>

      <div class="sidebar-card">
        <div class="sidebar-card__top">
          <div class="sidebar-card__title">{{ t("sidebar.signals") }}</div>
          <div class="badge badge--muted">{{ t("sidebar.watch") }}</div>
        </div>
        <p class="sidebar-card__meta">
          {{ t("sidebar.signalsMeta") }}
        </p>
      </div>

      <div class="sidebar-card">
        <div class="sidebar-card__top">
          <div class="sidebar-card__title">{{ t("sidebar.settings") }}</div>
          <div class="badge badge--muted">{{ t("sidebar.sync") }}</div>
        </div>
        <p class="sidebar-card__meta">
          {{ t("sidebar.settingsMeta") }}
        </p>
      </div>

      <div class="sidebar-note">
        <span v-html="t('sidebar.note')" />
      </div>
    </div>
  </aside>
</template>

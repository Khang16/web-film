<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGetInforFilm } from "../services/over-view.query";
import type { Episode } from "../../../common/types/api-response.interface";

const route = useRoute();
const router = useRouter();

const slug = computed(() => String(route.params.slug ?? ""));
const { data, isLoading, isError, error } = useGetInforFilm(slug);

const movie = computed(() => data.value?.movie ?? null);
const episodes = computed(() => data.value?.episodes ?? []);

const activeServerIndex = ref(0);
const activeEpisodeIndex = ref(0);

const activeServer = computed(() => episodes.value[activeServerIndex.value] ?? null);
const activeEpisode = computed<Episode | null>(() => {
  return activeServer.value?.server_data[activeEpisodeIndex.value] ?? null;
});

const activeEmbedUrl = computed(() => activeEpisode.value?.link_embed || activeEpisode.value?.link_m3u8 || "");

const selectEpisode = (serverIndex: number, episodeIndex: number) => {
  activeServerIndex.value = serverIndex;
  activeEpisodeIndex.value = episodeIndex;
};

watch(
  episodes,
  (serverList) => {
    if (!serverList.length) {
      activeServerIndex.value = 0;
      activeEpisodeIndex.value = 0;
      return;
    }

    activeServerIndex.value = 0;
    activeEpisodeIndex.value = 0;
  },
  { immediate: true },
);

const getRatingColor = (rating: number) => {
  if (rating >= 8) return "rgb(14 203 129)";
  if (rating >= 7) return "#fcd535";
  if (rating >= 6) return "#3b82f6";
  return "#707a8a";
};

const formatList = (items?: string[]) => (items?.length ? items.join(", ") : "Đang cập nhật");

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="infor-film-page">
    <section class="product-hero" v-if="movie">
      <div class="product-hero__copy">
        <div class="badge badge--brand">{{ movie.type === "series" ? "Series" : "Movie" }}</div>

        <h1 class="product-hero__title">
          {{ movie.name }}
        </h1>

        <p class="product-hero__lead">
          {{ movie.origin_name }} · {{ movie.year }} · {{ movie.episode_current }}
        </p>

        <div class="product-hero__actions">
          <button class="btn btn--secondary" @click="goBack">
            ← Quay lại
          </button>
          <a
            v-if="movie.trailer_url"
            class="btn btn--ghost"
            :href="movie.trailer_url"
            target="_blank"
            rel="noreferrer"
          >
            Xem trailer
          </a>
        </div>
      </div>

      <div class="product-hero__panel">
        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">Đánh giá</p>
            <p class="product-hero__panel-value" :style="{ color: getRatingColor(movie.tmdb.vote_average) }">
              {{ movie.tmdb.vote_average.toFixed(1) }}
            </p>
          </div>
          <span class="badge badge--brand">TMDB</span>
        </div>

        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">Tập hiện tại</p>
            <p class="product-hero__panel-value">{{ movie.episode_current }}</p>
          </div>
          <span class="product-hero__panel-chip">{{ movie.episode_total }} tập</span>
        </div>

        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">Ngôn ngữ</p>
            <p class="product-hero__panel-value">{{ movie.lang }}</p>
          </div>
          <span class="badge badge--muted">{{ movie.quality }}</span>
        </div>
      </div>
    </section>

    <section v-if="isLoading" class="state-card">
      Đang tải thông tin phim...
    </section>

    <section v-else-if="isError" class="state-card state-card--error">
      {{ error?.message || "Lỗi khi tải thông tin phim" }}
    </section>

    <template v-else-if="movie">
      <section class="product-section page__section">
        <div class="product-section__head">
          <div>
            <h2 class="product-section__title">Thông tin phim</h2>
            <p class="product-section__subtitle">
              {{ movie.content }}
            </p>
          </div>
        </div>

        <div class="infor-film-grid">
          <article class="infor-film-card infor-film-card--poster">
            <img
              class="infor-film-card__image"
              :src="movie.poster_url || movie.thumb_url"
              :alt="movie.name"
            />
            <div class="infor-film-card__meta">
              <p><strong>Năm:</strong> {{ movie.year }}</p>
              <p><strong>Thời lượng:</strong> {{ movie.time }}</p>
              <p><strong>Trạng thái:</strong> {{ movie.status }}</p>
            </div>
          </article>

          <article class="infor-film-card">
            <h3 class="infor-film-card__title">Mô tả</h3>
            <p class="infor-film-card__text">{{ movie.content }}</p>

            <div class="infor-film-card__info-list">
              <p><strong>Diễn viên:</strong> {{ formatList(movie.actor) }}</p>
              <p><strong>Đạo diễn:</strong> {{ formatList(movie.director) }}</p>
              <p><strong>Thể loại:</strong> {{ movie.category.map((item) => item.name).join(", ") }}</p>
              <p><strong>Quốc gia:</strong> {{ movie.country.map((item) => item.name).join(", ") }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="product-section page__section" v-if="episodes.length">
        <div class="product-section__head">
          <div>
            <h2 class="product-section__title">Xem phim</h2>
            <p class="product-section__subtitle">
              Chọn server và tập để phát ngay trong trang.
            </p>
          </div>
        </div>

        <div class="">
          <div class="player-layout__viewer">
            <iframe
              v-if="activeEmbedUrl"
              :src="activeEmbedUrl"
              class="player-layout__iframe"
              allow="fullscreen; encrypted-media"
              allowfullscreen
            />
            <div v-else class="state-card">
              Chọn một tập để bắt đầu xem.
            </div>
          </div>

          <aside class="player-layout__sidebar">
            <div
              v-for="(server, serverIndex) in episodes"
              :key="server.server_name"
              class="episode-group"
            >
              <h3 class="episode-group__title">{{ server.server_name }}</h3>
              <div class="episode-group__list">
                <button
                  v-for="(episode, episodeIndex) in server.server_data"
                  :key="episode.slug + episode.name"
                  class="episode-group__button"
                  :class="{ 'episode-group__button--active': activeServerIndex === serverIndex && activeEpisodeIndex === episodeIndex }"
                  @click="selectEpisode(serverIndex, episodeIndex)"
                >
                  {{ episode.name }}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.infor-film-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.infor-film-grid {
  display: grid;
  grid-template-columns: minmax(0, 18rem) minmax(0, 1fr);
  gap: 1.25rem;
}

.infor-film-card {
  background: var(--color-surface-dark);
  border: 0.0625rem solid var(--color-hairline-dark);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.infor-film-card--poster {
  padding: 1rem;
}

.infor-film-card__image {
  width: 100%;
  border-radius: var(--radius-lg);
  aspect-ratio: 2 / 3;
  object-fit: cover;
}

.infor-film-card__title {
  margin: 0;
  color: var(--color-text-dark);
  font-size: 1.25rem;
  font-weight: 700;
}

.infor-film-card__text,
.infor-film-card__meta,
.infor-film-card__info-list {
  color: var(--color-text-secondary-dark);
  line-height: 1.6;
}

.infor-film-card__info-list {
  display: grid;
  gap: 0.625rem;
}

.player-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
}

.player-layout__viewer {
  background: var(--color-surface-dark);
  border: 0.0625rem solid var(--color-hairline-dark);
  border-radius: var(--radius-xl);
  overflow: hidden;
  min-height: 30rem;
}

.player-layout__iframe {
  display: block;
  width: 100%;
  height: 40rem;
  border: 0;
}

.player-layout__sidebar {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

.episode-group {
  background: var(--color-surface-dark);
  border: 0.0625rem solid var(--color-hairline-dark);
  border-radius: var(--radius-xl);
  padding: 1rem;
}

.episode-group__title {
  margin: 0 0 0.75rem;
  color: var(--color-text-dark);
  font-size: 1rem;
  font-weight: 700;
}

.episode-group__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.episode-group__button {
  border: 0.0625rem solid var(--color-hairline-dark);
  background: var(--color-surface-elevated-dark);
  color: var(--color-text-secondary-dark);
  border-radius: var(--radius-pill);
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.episode-group__button:hover,
.episode-group__button--active {
  border-color: rgb(252 213 53 / 0.45);
  color: var(--color-text-dark);
  background: rgb(252 213 53 / 0.08);
}

.state-card {
  background: var(--color-surface-dark);
  border: 0.0625rem solid var(--color-hairline-dark);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  color: var(--color-text-secondary-dark);
}

@media (max-width: 56rem) {
  .infor-film-grid,
  .player-layout {
    grid-template-columns: 1fr;
  }

  .player-layout__iframe,
  .player-layout__viewer {
    min-height: 22rem;
    height: 22rem;
  }
}
</style>

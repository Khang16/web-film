<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useFetchCountrySpotlight, useFetchListSpotlight, useFetchOverViewFilm } from "../services/over-view.query";

const { t } = useI18n();

const IMAGE_CDN_BASE = "https://phimimg.com/";

const resolveImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;

  return new URL(url.replace(/^\/+/, ""), IMAGE_CDN_BASE).toString();
};

const currentPage = ref(1);
const spotlightGridRef = ref<HTMLElement | null>(null);
const isSpotlightDragging = ref(false);
const spotlightDragStartX = ref(0);
const spotlightScrollStart = ref(0);
const spotlightDragThreshold = 6;
const isSpotlightPointerActive = ref(false);
const cinemaGridRef = ref<HTMLElement | null>(null);
const isCinemaDragging = ref(false);
const cinemaDragStartX = ref(0);
const cinemaScrollStart = ref(0);
const cinemaDragThreshold = 6;
const isCinemaPointerActive = ref(false);
const route = useRoute();
const router = useRouter();
const genreSlug = computed(() => String(route.query.genre ?? ""));
const genreName = computed(() => String(route.query.genreName ?? ""));
const yearSlug = computed(() => String(route.query.year ?? ""));
const yearName = computed(() => String(route.query.yearName ?? ""));
const countrySlug = computed(() => String(route.query.country ?? ""));
const countryName = computed(() => String(route.query.countryName ?? ""));
const keyword = computed(() => String(route.query.keyword ?? ""));
const listType = computed(() => String(route.query.listType ?? ""));
const listName = computed(() => String(route.query.listName ?? ""));
const resolvedListName = computed(() => {
  if (listName.value) return listName.value;
  if (listType.value === "phim-le") return t("header.movieSingle");
  if (listType.value === "phim-bo") return t("header.series");
  if (listType.value === "phim-chieu-rap") return t("header.cinema");
  return listType.value;
});

watch(
  () => [genreSlug.value, yearSlug.value, countrySlug.value, keyword.value, listType.value],
  () => {
    currentPage.value = 1;
  },
  { immediate: true },
);

const { data, isLoading, isError, error } = useFetchOverViewFilm(
  currentPage,
  genreSlug,
  yearSlug,
  countrySlug,
  keyword,
  listType,
);

const { data: koreaData, isLoading: isKoreaLoading, isError: isKoreaError } = useFetchCountrySpotlight("han-quoc");
const { data: cinemaData, isLoading: isCinemaLoading, isError: isCinemaError } = useFetchListSpotlight("phim-chieu-rap");

const filmList = computed(() => data.value?.items ?? []);
const koreaSpotlight = computed(() => koreaData.value?.items ?? []);
const cinemaSpotlight = computed(() => cinemaData.value?.items ?? []);
const totalPages = computed(() => data.value?.pagination.totalPages ?? 1);
const totalItems = computed(() => data.value?.pagination.totalItems ?? filmList.value.length);
const hasGenreFilter = computed(() => Boolean(genreSlug.value));
const hasYearFilter = computed(() => Boolean(yearSlug.value));
const hasCountryFilter = computed(() => Boolean(countrySlug.value));
const hasKeywordFilter = computed(() => Boolean(keyword.value));
const hasListType = computed(() => Boolean(listType.value));
const titleLabel = computed(() => {
  if (hasKeywordFilter.value) return t("overview.title.keyword", { keyword: keyword.value });
  if (hasListType.value) return resolvedListName.value || listType.value;
  if (hasYearFilter.value) return yearName.value || yearSlug.value;
  if (hasCountryFilter.value) return countryName.value || countrySlug.value;
  if (hasGenreFilter.value) return genreName.value || genreSlug.value;
  return t("overview.title.latest");
});
const leadText = computed(() => {
  if (hasKeywordFilter.value) {
    return t("overview.lead.keyword", { keyword: keyword.value });
  }

  if (hasListType.value) {
    return t("overview.lead.list", { listName: resolvedListName.value || listType.value });
  }

  if (hasYearFilter.value) {
    return hasGenreFilter.value
      ? t("overview.lead.yearGenre", {
          year: yearName.value || yearSlug.value,
          genre: genreName.value || genreSlug.value,
        })
      : t("overview.lead.year", { year: yearName.value || yearSlug.value });
  }

  if (hasCountryFilter.value) {
    return hasGenreFilter.value
      ? t("overview.lead.countryGenre", {
          country: countryName.value || countrySlug.value,
          genre: genreName.value || genreSlug.value,
        })
      : t("overview.lead.country", { country: countryName.value || countrySlug.value });
  }

  if (hasGenreFilter.value) {
    return t("overview.lead.genre", { genre: genreName.value || genreSlug.value });
  }

  return t("overview.lead.latest");
});
const activeFilterLabel = computed(() => {
  if (hasKeywordFilter.value) return t("overview.activeFilter.search");
  if (hasListType.value) return resolvedListName.value || listType.value;
  if (hasYearFilter.value) return yearName.value || yearSlug.value;
  if (hasCountryFilter.value) return countryName.value || countrySlug.value;
  if (hasGenreFilter.value) return genreName.value || genreSlug.value;
  return t("overview.activeFilter.live");
});
const clearYearFilter = () => {
  router.push({
    path: "/overview",
    query: {
      genre: genreSlug.value,
      genreName: genreName.value,
      country: countrySlug.value,
      countryName: countryName.value,
      listType: listType.value,
      listName: listName.value,
    },
  });
};

const clearCountryFilter = () => {
  router.push({
    path: "/overview",
    query: {
      genre: genreSlug.value,
      genreName: genreName.value,
      year: yearSlug.value,
      yearName: yearName.value,
      keyword: keyword.value,
      listType: listType.value,
      listName: listName.value,
    },
  });
};

const clearKeywordFilter = () => {
  router.push({
    path: "/overview",
    query: {
      genre: genreSlug.value,
      genreName: genreName.value,
      year: yearSlug.value,
      yearName: yearName.value,
      country: countrySlug.value,
      countryName: countryName.value,
      listType: listType.value,
      listName: listName.value,
    },
  });
};
watch(currentPage, () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
const getRatingColor = (rating: number) => {
  if (rating >= 8) return "rgb(14 203 129)"; // green - trading-up
  if (rating >= 7) return "#fcd535"; // yellow - primary
  if (rating >= 6) return "#3b82f6"; // blue - info
  return "#707a8a"; // muted
};

const nextPage = () => {
  currentPage.value += 1;
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

const openFilmInfo = (slug: string) => {
  router.push(`/overview/${slug}`);
};

const scrollSpotlightRight = () => {
  if (!spotlightGridRef.value) return;
  spotlightGridRef.value.scrollBy({
    left: spotlightGridRef.value.clientWidth * 0.85,
    behavior: "smooth",
  });
};

const scrollCinemaRight = () => {
  if (!cinemaGridRef.value) return;
  cinemaGridRef.value.scrollBy({
    left: cinemaGridRef.value.clientWidth * 0.85,
    behavior: "smooth",
  });
};

const onSpotlightPointerDown = (event: PointerEvent) => {
  if (!spotlightGridRef.value) return;
  isSpotlightPointerActive.value = true;
  isSpotlightDragging.value = false;
  spotlightGridRef.value.setPointerCapture(event.pointerId);
  spotlightDragStartX.value = event.clientX;
  spotlightScrollStart.value = spotlightGridRef.value.scrollLeft;
};

const onSpotlightPointerMove = (event: PointerEvent) => {
  if (!spotlightGridRef.value) return;
  if (!isSpotlightPointerActive.value) return;
  if (event.buttons === 0) {
    isSpotlightDragging.value = false;
    isSpotlightPointerActive.value = false;
    return;
  }
  const delta = event.clientX - spotlightDragStartX.value;
  if (!isSpotlightDragging.value && Math.abs(delta) < spotlightDragThreshold) return;
  isSpotlightDragging.value = true;
  spotlightGridRef.value.scrollLeft = spotlightScrollStart.value - delta;
};

const onSpotlightPointerUp = (event: PointerEvent) => {
  if (!spotlightGridRef.value) return;
  isSpotlightDragging.value = false;
  isSpotlightPointerActive.value = false;
  spotlightGridRef.value.releasePointerCapture(event.pointerId);
};

const onSpotlightPointerCancel = (event: PointerEvent) => {
  if (!spotlightGridRef.value) return;
  isSpotlightDragging.value = false;
  isSpotlightPointerActive.value = false;
  spotlightGridRef.value.releasePointerCapture(event.pointerId);
};

const onCinemaPointerDown = (event: PointerEvent) => {
  if (!cinemaGridRef.value) return;
  isCinemaPointerActive.value = true;
  isCinemaDragging.value = false;
  cinemaGridRef.value.setPointerCapture(event.pointerId);
  cinemaDragStartX.value = event.clientX;
  cinemaScrollStart.value = cinemaGridRef.value.scrollLeft;
};

const onCinemaPointerMove = (event: PointerEvent) => {
  if (!cinemaGridRef.value) return;
  if (!isCinemaPointerActive.value) return;
  if (event.buttons === 0) {
    isCinemaDragging.value = false;
    isCinemaPointerActive.value = false;
    return;
  }
  const delta = event.clientX - cinemaDragStartX.value;
  if (!isCinemaDragging.value && Math.abs(delta) < cinemaDragThreshold) return;
  isCinemaDragging.value = true;
  cinemaGridRef.value.scrollLeft = cinemaScrollStart.value - delta;
};

const onCinemaPointerUp = (event: PointerEvent) => {
  if (!cinemaGridRef.value) return;
  isCinemaDragging.value = false;
  isCinemaPointerActive.value = false;
  cinemaGridRef.value.releasePointerCapture(event.pointerId);
};

const onCinemaPointerCancel = (event: PointerEvent) => {
  if (!cinemaGridRef.value) return;
  isCinemaDragging.value = false;
  isCinemaPointerActive.value = false;
  cinemaGridRef.value.releasePointerCapture(event.pointerId);
};

const onSpotlightWindowPointerUp = () => {
  isSpotlightDragging.value = false;
  isSpotlightPointerActive.value = false;
  isCinemaDragging.value = false;
  isCinemaPointerActive.value = false;
};

window.addEventListener("pointerup", onSpotlightWindowPointerUp);

const clearGenreFilter = () => {
  router.push({
    path: "/overview",
    query: {
      year: yearSlug.value,
      yearName: yearName.value,
      country: countrySlug.value,
      countryName: countryName.value,
      keyword: keyword.value,
      listType: listType.value,
      listName: listName.value,
    },
  });
};
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="product-hero">
      <div class="product-hero__copy">
        <div class="badge badge--brand">{{ t("overview.heroBadge") }}</div>

        <h1 class="product-hero__title">
          {{ titleLabel }}
        </h1>

        <p class="product-hero__lead">
          {{ leadText }}
        </p>

        <div class="product-hero__actions">
          <button v-if="hasKeywordFilter" @click="clearKeywordFilter" class="btn btn--ghost">
            {{ t("overview.clearSearch") }}
          </button>

          <button v-if="hasYearFilter" @click="clearYearFilter" class="btn btn--ghost">
            {{ t("overview.clearYear") }}
          </button>

          <button v-if="hasCountryFilter" @click="clearCountryFilter" class="btn btn--ghost">
            {{ t("overview.clearCountry") }}
          </button>

          <button v-if="hasGenreFilter" @click="clearGenreFilter" class="btn btn--ghost">
            {{ t("overview.allFilms") }}
          </button>

          <button @click="prevPage" :disabled="currentPage === 1" class="btn btn--secondary">
            {{ t("overview.prevPage") }}
          </button>

          <span
            style="
              color: var(--color-text-muted);
              font-size: 0.875rem;
              padding: 0 1rem;
              display: flex;
              align-items: center;
            "
          >
            {{ t("overview.pageStatus", { page: currentPage, total: totalPages }) }}
          </span>

          <button @click="nextPage" class="btn btn--primary">{{ t("overview.nextPage") }}</button>
        </div>
      </div>

      <div class="product-hero__panel">
        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">{{ t("overview.panel.total") }}</p>
            <p class="product-hero__panel-value">{{ totalItems.toLocaleString("vi-VN") }}</p>
          </div>
          <span class="product-hero__panel-chip">{{ activeFilterLabel }}</span>
        </div>

        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">{{ t("overview.panel.latest") }}</p>
            <p class="product-hero__panel-value">{{ t("overview.panel.today") }}</p>
          </div>
          <span class="badge badge--brand">{{ t("overview.panel.updated") }}</span>
        </div>

        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">{{ t("overview.panel.format") }}</p>
            <p class="product-hero__panel-value">{{ t("overview.panel.formatValue") }}</p>
          </div>
          <span class="badge badge--muted">{{ t("overview.panel.allTypes") }}</span>
        </div>
      </div>
    </section>

    <!-- Film Grid Section -->
    <section class="product-section page__section">
      <div class="product-section__head">
        <div>
          <h2 class="product-section__title">{{ t("overview.section.title") }}</h2>
          <p class="product-section__subtitle">{{ t("overview.section.subtitle") }}</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-grid">
        <div v-for="index in 12" :key="index" class="loading-card" />
      </div>

      <!-- Error State -->
      <div v-else-if="isError" class="state-card state-card--error">
        {{ error?.message || t("overview.errorLoadFilms") }}
      </div>

      <!-- Film Grid -->
      <div v-else class="product-grid">
        <article v-for="film in filmList" :key="film._id" class="film-card">
          <!-- Poster Image -->
          <div class="film-card__poster">
            <img :src="resolveImageUrl(film.poster_url || film.thumb_url)" :alt="film.name" class="film-card__image" />

            <!-- Rating Badge Overlay -->
            <div v-if="film.tmdb.vote_average > 0" class="film-card__rating-badge">
              <span class="film-card__rating-value" :style="{ color: getRatingColor(film.tmdb.vote_average) }">
                {{ film.tmdb.vote_average.toFixed(1) }}
              </span>
              <span class="film-card__rating-label">TMDB</span>
            </div>

            <!-- Type Badge -->
            <div class="film-card__type-badge">
              {{ film.tmdb.type || t("overview.filmTypeDefault") }}
              <span v-if="film.tmdb.season" class="film-card__season"> S{{ film.tmdb.season }} </span>
            </div>

            <div class="film-card__overlay">
              <h3 class="film-card__title">
                {{ film.name }}
              </h3>

              <p class="film-card__origin-name">
                {{ film.origin_name }}
              </p>

              <div class="film-card__meta">
                <span class="film-card__year">{{ film.year }}</span>
                <span v-if="film.tmdb.vote_count > 0" class="film-card__votes">
                  {{ t("overview.votes", { count: film.tmdb.vote_count }) }}
                </span>
              </div>

              <!-- Action Button (Bấm vào đây sẽ ra trang thông tin film (InforFilm.vue)) -->
              <button class="btn btn--primary film-card__button" @click="openFilmInfo(film.slug)">
                {{ t("overview.filmInfo") }}
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Pagination Controls -->
      <div v-if="!isLoading && !isError" class="pagination-controls">
          <button @click="prevPage" :disabled="currentPage === 1" class="btn btn--secondary">
            {{ t("overview.pagination.prev") }}
          </button>

        <span class="pagination-info">
            {{ t("overview.pagination.page", { page: currentPage }) }}
        </span>

          <button @click="nextPage" :disabled="currentPage >= totalPages" class="btn btn--primary">
            {{ t("overview.pagination.next") }}
          </button>
      </div>
    </section>

    <section v-if="!isKoreaLoading && !isKoreaError && koreaSpotlight.length" class="spotlight-section page__section">
      <div class="spotlight-head">
        <div>
          <h2 class="spotlight-title">{{ t("overview.spotlight.koreaTitle") }}</h2>
          <p class="spotlight-subtitle">{{ t("overview.spotlight.koreaSubtitle") }}</p>
        </div>

        <button
          type="button"
          class="spotlight-scroll"
          @click="scrollSpotlightRight"
          :aria-label="t('overview.spotlight.scrollRight')"
        >
          →
        </button>
      </div>

      <div
        ref="spotlightGridRef"
        class="spotlight-grid"
        :class="{ 'spotlight-grid--dragging': isSpotlightDragging }"
        role="list"
        @pointerdown.prevent="onSpotlightPointerDown"
        @pointermove="onSpotlightPointerMove"
        @pointerup="onSpotlightPointerUp"
        @pointerleave="onSpotlightPointerUp"
        @pointercancel="onSpotlightPointerCancel"
        @lostpointercapture="onSpotlightPointerCancel"
      >
        <article v-for="(film, index) in koreaSpotlight" :key="film._id" class="spotlight-card" role="listitem">
          <div class="spotlight-poster" @click="openFilmInfo(film.slug)">
            <div class="spotlight-poster__inner">
              <img :src="resolveImageUrl(film.poster_url || film.thumb_url)" :alt="film.name" class="spotlight-image" />
              <span class="spotlight-rank">{{ index + 1 }}</span>

              <div class="spotlight-tags">
                <span class="spotlight-tag">
                  {{ t("overview.spotlight.episodePrefix") }} {{ film.episode_current || t("overview.spotlight.full") }}
                </span>
                <span v-if="film.tmdb.vote_average" class="spotlight-tag spotlight-tag--accent">
                  {{ t("overview.spotlight.ratingPrefix") }} {{ Math.round(film.tmdb.vote_average) }}
                </span>
              </div>
            </div>
          </div>

          <div class="spotlight-body" @pointerdown.stop @click="openFilmInfo(film.slug)">
            <h3 class="spotlight-name">{{ film.name }}</h3>
            <p class="spotlight-origin">{{ film.origin_name }}</p>
            <div class="spotlight-meta">
              <span>{{ film.lang || t("overview.spotlight.vietsub") }}</span>
              <span>•</span>
              <span>{{ film.episode_current || t("overview.spotlight.full") }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section v-if="!isCinemaLoading && !isCinemaError && cinemaSpotlight.length" class="spotlight-section page__section">
      <div class="spotlight-head">
        <div>
          <h2 class="spotlight-title">{{ t("overview.spotlight.cinemaTitle") }}</h2>
          <p class="spotlight-subtitle">{{ t("overview.spotlight.cinemaSubtitle") }}</p>
        </div>

        <button
          type="button"
          class="spotlight-scroll"
          @click="scrollCinemaRight"
          :aria-label="t('overview.spotlight.scrollRight')"
        >
          →
        </button>
      </div>

      <div
        ref="cinemaGridRef"
        class="spotlight-grid"
        :class="{ 'spotlight-grid--dragging': isCinemaDragging }"
        role="list"
        @pointerdown.prevent="onCinemaPointerDown"
        @pointermove="onCinemaPointerMove"
        @pointerup="onCinemaPointerUp"
        @pointerleave="onCinemaPointerUp"
        @pointercancel="onCinemaPointerCancel"
        @lostpointercapture="onCinemaPointerCancel"
      >
        <article v-for="(film, index) in cinemaSpotlight" :key="film._id" class="spotlight-card" role="listitem">
          <div class="spotlight-poster" @click="openFilmInfo(film.slug)">
            <div class="spotlight-poster__inner">
              <img :src="resolveImageUrl(film.poster_url || film.thumb_url)" :alt="film.name" class="spotlight-image" />
              <span class="spotlight-rank">{{ index + 1 }}</span>

              <div class="spotlight-tags">
                <span class="spotlight-tag">
                  {{ t("overview.spotlight.episodePrefix") }} {{ film.episode_current || t("overview.spotlight.full") }}
                </span>
                <span v-if="film.tmdb.vote_average" class="spotlight-tag spotlight-tag--accent">
                  {{ t("overview.spotlight.ratingPrefix") }} {{ Math.round(film.tmdb.vote_average) }}
                </span>
              </div>
            </div>
          </div>

          <div class="spotlight-body" @pointerdown.stop @click="openFilmInfo(film.slug)">
            <h3 class="spotlight-name">{{ film.name }}</h3>
            <p class="spotlight-origin">{{ film.origin_name }}</p>
            <div class="spotlight-meta">
              <span>{{ film.lang || t("overview.spotlight.vietsub") }}</span>
              <span>•</span>
              <span>{{ film.episode_current || t("overview.spotlight.full") }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.film-card {
  background: var(--color-surface-dark);
  border: 0.0625rem solid var(--color-hairline-dark);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}
@media screen and (max-width: 639.98px) {
  .film-card{
    width: 21.5rem;
  }
}
.product-grid {
  grid-template-columns: repeat(auto-fill, minmax(12.5rem, 16.5rem));
  justify-content: start;
  gap: 0.75rem;
}

.film-card:hover {
  transform: translateY(-0.1875rem);
  border-color: rgb(252 213 53 / 0.4);
  box-shadow: 0 1.25rem 2.5rem rgb(0 0 0 / 0.3);
}

.film-card__poster {
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  background: var(--color-surface-elevated-dark);
  border-bottom: 0.0625rem solid var(--color-hairline-dark);
}

.film-card__overlay {
  position: absolute;
  inset: 0;
  padding: 0.75rem 0.75rem 0.85rem;
  background: linear-gradient(
    180deg,
    rgba(11, 14, 17, 0.15) 0%,
    rgba(11, 14, 17, 0.6) 50%,
    rgba(11, 14, 17, 0.92) 100%
  );
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: flex-end;
}

.film-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.film-card:hover .film-card__image {
  transform: scale(1.05);
}

.film-card__rating-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  padding: 0.5rem 0.625rem;
  background: rgba(11, 14, 17, 0.9);
  border-radius: var(--radius-pill);
  border: 0.0625rem solid var(--color-hairline-dark);
  backdrop-filter: blur(0.5rem);
}

.film-card__rating-value {
  font-family: var(--font-number);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
}

.film-card__rating-label {
  font-size: 0.625rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.film-card__type-badge {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  background: rgba(11, 14, 17, 0.9);
  border-radius: var(--radius-pill);
  border: 0.0625rem solid var(--color-hairline-dark);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  backdrop-filter: blur(0.5rem);
}

.film-card__season {
  margin-left: 0.25rem;
  color: #3b82f6;
}

.film-card__title {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.4;
  font-weight: 600;
  color: var(--color-on-dark);
  min-height: 2.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.film-card__origin-name {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.film-card__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.6875rem;
  color: var(--color-text-muted);
}

.film-card__year {
  background: rgb(252 213 53 / 0.1);
  color: var(--color-primary);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.film-card__votes {
  font-size: 0.7rem;
}

.film-card__button {
  width: 100%;
  margin-top: 0.35rem;
  padding: 0.55rem 0.75rem;
  font-size: 0.8rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  border-top: 0.0625rem solid var(--color-hairline-dark);
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.pagination-number {
  color: var(--color-primary);
  font-weight: 600;
  font-family: var(--font-number);
}

.spotlight-section {
  margin-top: 2rem;
}

.spotlight-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.spotlight-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.spotlight-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.spotlight-grid {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(18rem, 18rem);
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scroll-snap-type: x mandatory;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y;
}

.spotlight-grid--dragging {
  scroll-snap-type: none;
  cursor: grabbing;
}

.spotlight-image {
  -webkit-user-drag: none;
}

.spotlight-grid::-webkit-scrollbar {
  height: 0.3rem;
}

.spotlight-grid::-webkit-scrollbar-thumb {
  background: rgb(252 213 53 / 0.2);
  border-radius: 999px;
}

.spotlight-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  scroll-snap-align: start;
}

.spotlight-poster {
  position: relative;
  border-radius: 1.25rem;
  aspect-ratio: 2 / 3;
  cursor: pointer;
  padding: 0.125rem;
  background: rgb(252 213 53 / 0.85);
  clip-path: polygon(0% 10%, 100% 0%, 100% 100%, 0% 100%);
}

.spotlight-poster__inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 1.15rem;
  overflow: hidden;
  background: var(--color-surface-elevated-dark);
  clip-path: polygon(0% 10%, 100% 0%, 100% 100%, 0% 100%);
}

.spotlight-card:nth-child(even) .spotlight-poster {
  clip-path: polygon(0% 0%, 100% 10%, 100% 100%, 0% 100%);
}

.spotlight-card:nth-child(even) .spotlight-poster__inner {
  clip-path: polygon(0% 0%, 100% 10%, 100% 100%, 0% 100%);
}

.spotlight-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.spotlight-poster__inner:hover .spotlight-image {
  transform: scale(1.06);
}

.spotlight-rank {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  font-family: var(--font-number);
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--color-primary);
  text-shadow: 0 0.5rem 1rem rgb(0 0 0 / 0.6);
}

.spotlight-tags {
  position: absolute;
  bottom: 0.65rem;
  right: 0.5rem;
  display: inline-flex;
  gap: 0.35rem;
}

.spotlight-tag {
  padding: 0.2rem 0.45rem;
  border-radius: 0.45rem;
  background: rgb(11 14 17 / 0.85);
  border: 0.0625rem solid var(--color-hairline-dark);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--color-text-muted-strong);
}

.spotlight-tag--accent {
  color: var(--color-on-primary);
  background: var(--color-primary);
  border-color: transparent;
}

.spotlight-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: default;
}

.spotlight-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-on-dark);
  cursor: default;
}

.spotlight-origin {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  cursor: default;
}

.spotlight-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  color: var(--color-text-muted-strong);
  cursor: default;
}
</style>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useFetchOverViewFilm } from "../services/over-view.query";

const IMAGE_CDN_BASE = "https://phimimg.com/";

const resolveImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;

  return new URL(url.replace(/^\/+/, ""), IMAGE_CDN_BASE).toString();
};

const currentPage = ref(1);
const route = useRoute();
const router = useRouter();
const genreSlug = computed(() => String(route.query.genre ?? ""));
const genreName = computed(() => String(route.query.genreName ?? ""));
const yearSlug = computed(() => String(route.query.year ?? ""));
const yearName = computed(() => String(route.query.yearName ?? ""));
const countrySlug = computed(() => String(route.query.country ?? ""));
const countryName = computed(() => String(route.query.countryName ?? ""));
const keyword = computed(() => String(route.query.keyword ?? ""));

watch(
  () => [genreSlug.value, yearSlug.value, countrySlug.value, keyword.value],
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
);

const filmList = computed(() => data.value?.items ?? []);
const totalPages = computed(() => data.value?.pagination.totalPages ?? 1);
const totalItems = computed(() => data.value?.pagination.totalItems ?? filmList.value.length);
const hasGenreFilter = computed(() => Boolean(genreSlug.value));
const hasYearFilter = computed(() => Boolean(yearSlug.value));
const hasCountryFilter = computed(() => Boolean(countrySlug.value));
const hasKeywordFilter = computed(() => Boolean(keyword.value));
const titleLabel = computed(() => {
  if (hasKeywordFilter.value) return `Từ khóa: ${keyword.value}`;
  if (hasYearFilter.value) return yearName.value || yearSlug.value;
  if (hasCountryFilter.value) return countryName.value || countrySlug.value;
  if (hasGenreFilter.value) return genreName.value || genreSlug.value;
  return "Phim Mới Cập Nhật";
});
const leadText = computed(() => {
  if (hasKeywordFilter.value) {
    return `Kết quả tìm kiếm cho từ khóa \"${keyword.value}\".`;
  }

  if (hasYearFilter.value) {
    return hasGenreFilter.value
      ? `Danh sách phim năm ${yearName.value}, thể loại ${genreName.value}.`
      : `Danh sách phim năm ${yearName.value}.`;
  }

  if (hasCountryFilter.value) {
    return hasGenreFilter.value
      ? `Danh sách phim quốc gia ${countryName.value}, thể loại ${genreName.value}.`
      : `Danh sách phim quốc gia ${countryName.value}.`;
  }

  if (hasGenreFilter.value) {
    return `Danh sách phim thể loại ${genreName.value}.`;
  }

  return "Danh sách phim mới được cập nhật liên tục với các đánh giá từ TMDB, IMDb, và tính năng xem phim trực tuyến.";
});
const activeFilterLabel = computed(() => {
  if (hasKeywordFilter.value) return "Search";
  if (hasYearFilter.value) return yearName.value || yearSlug.value;
  if (hasCountryFilter.value) return countryName.value || countrySlug.value;
  if (hasGenreFilter.value) return genreName.value || genreSlug.value;
  return "Live";
});
const clearYearFilter = () => {
  router.push({
    path: "/overview",
    query: {
      genre: genreSlug.value,
      genreName: genreName.value,
      country: countrySlug.value,
      countryName: countryName.value,
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

const clearGenreFilter = () => {
  router.push({
    path: "/overview",
    query: {
      year: yearSlug.value,
      yearName: yearName.value,
      country: countrySlug.value,
      countryName: countryName.value,
      keyword: keyword.value,
    },
  });
};
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="product-hero">
      <div class="product-hero__copy">
        <div class="badge badge--brand">Film Discovery</div>

        <h1 class="product-hero__title">
          {{ titleLabel }}
        </h1>

        <p class="product-hero__lead">
          {{ leadText }}
        </p>

        <div class="product-hero__actions">
          <button v-if="hasKeywordFilter" @click="clearKeywordFilter" class="btn btn--ghost">
            Bỏ tìm kiếm
          </button>

          <button v-if="hasYearFilter" @click="clearYearFilter" class="btn btn--ghost">
            Bỏ lọc năm
          </button>

          <button v-if="hasCountryFilter" @click="clearCountryFilter" class="btn btn--ghost">
            Bỏ lọc quốc gia
          </button>

          <button v-if="hasGenreFilter" @click="clearGenreFilter" class="btn btn--ghost">
            Tất cả phim
          </button>

          <button @click="prevPage" :disabled="currentPage === 1" class="btn btn--secondary">
            ← Trang trước
          </button>

          <span style="color: var(--color-text-muted); font-size: 0.875rem; padding: 0 1rem; display: flex; align-items: center;">
            Trang {{ currentPage }} / {{ totalPages }}
          </span>

          <button @click="nextPage" class="btn btn--primary">
            Trang sau →
          </button>
        </div>
      </div>

      <div class="product-hero__panel">
        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">Tổng phim</p>
            <p class="product-hero__panel-value">{{ totalItems.toLocaleString("vi-VN") }}</p>
          </div>
          <span class="product-hero__panel-chip">{{ activeFilterLabel }}</span>
        </div>

        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">Mới nhất</p>
            <p class="product-hero__panel-value">Hôm nay</p>
          </div>
          <span class="badge badge--brand">Updated</span>
        </div>

        <div class="product-hero__panel-row">
          <div>
            <p class="product-hero__panel-label">Định dạng</p>
            <p class="product-hero__panel-value">TV & Film</p>
          </div>
          <span class="badge badge--muted">All types</span>
        </div>
      </div>
    </section>

    <!-- Film Grid Section -->
    <section class="product-section page__section">
      <div class="product-section__head">
        <div>
          <h2 class="product-section__title">Film Collection</h2>
          <p class="product-section__subtitle">
            Danh sách phim mới cập nhật với poster, đánh giá, và năm phát hành.
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-grid">
        <div v-for="index in 12" :key="index" class="loading-card" />
      </div>

      <!-- Error State -->
      <div v-else-if="isError" class="state-card state-card--error">
        {{ error?.message || "Lỗi khi tải dữ liệu phim" }}
      </div>

      <!-- Film Grid -->
      <div v-else class="product-grid">
        <article
          v-for="film in filmList"
          :key="film._id"
          class="film-card"
        >
          <!-- Poster Image -->
          <div class="film-card__poster">
            <img 
              :src="resolveImageUrl(film.poster_url || film.thumb_url)" 
              :alt="film.name"
              class="film-card__image"
            />

            <!-- Rating Badge Overlay -->
            <div v-if="film.tmdb.vote_average > 0" class="film-card__rating-badge">
              <span class="film-card__rating-value" :style="{ color: getRatingColor(film.tmdb.vote_average) }">
                {{ film.tmdb.vote_average.toFixed(1) }}
              </span>
              <span class="film-card__rating-label">TMDB</span>
            </div>

            <!-- Type Badge -->
            <div class="film-card__type-badge">
              {{ film.tmdb.type || "Film" }}
              <span v-if="film.tmdb.season" class="film-card__season">
                S{{ film.tmdb.season }}
              </span>
            </div>
          </div>

          <!-- Film Info -->
          <div class="film-card__body">
            <h3 class="film-card__title">
              {{ film.name }}
            </h3>

            <p class="film-card__origin-name">
              {{ film.origin_name }}
            </p>

            <div class="film-card__meta">
              <span class="film-card__year">{{ film.year }}</span>
              <span v-if="film.tmdb.vote_count > 0" class="film-card__votes">
                {{ film.tmdb.vote_count }} votes
              </span>
            </div>

            <!-- Action Button (Bấm vào đây sẽ ra trang thông tin film (InforFilm.vue)) -->
            <button class="btn btn--primary film-card__button" @click="openFilmInfo(film.slug)">
              Thông tin phim
            </button>
          </div>
        </article>
      </div>

      <!-- Pagination Controls -->
      <div v-if="!isLoading && !isError" class="pagination-controls">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="btn btn--secondary"
        >
          ← Previous
        </button>

        <span class="pagination-info">
          Page <span class="pagination-number">{{ currentPage }}</span>
        </span>

          <button 
          @click="nextPage"
            :disabled="currentPage >= totalPages"
          class="btn btn--primary"
        >
          Next →
        </button>
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
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
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

.film-card__body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.film-card__title {
  margin: 0;
  font-size: 1rem;
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
  font-size: 0.8125rem;
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
  font-size: 0.75rem;
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
  margin-top: auto;
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
</style>
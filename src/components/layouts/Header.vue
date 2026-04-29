<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFetchCountries, useFetchGenres } from "../../views/over-view/services/over-view.query";

const router = useRouter();
const route = useRoute();
const genreMenuOpen = ref(false);
const yearMenuOpen = ref(false);
const countryMenuOpen = ref(false);
const mobileMenuOpen = ref(false);
const searchKeyword = ref("");
const genreMenuRef = ref<HTMLElement | null>(null);
const yearMenuRef = ref<HTMLElement | null>(null);
const countryMenuRef = ref<HTMLElement | null>(null);

const { data: genres } = useFetchGenres();
const { data: countries } = useFetchCountries();

const genreList = computed(() => genres.value ?? []);
const countryList = computed(() => countries.value ?? []);
const currentGenreLabel = computed(() => String(route.query.genreName ?? "Thể loại"));
const currentYearLabel = computed(() => String(route.query.yearName ?? "Năm"));
const currentCountryLabel = computed(() => String(route.query.countryName ?? "Quốc gia"));
const currentListType = computed(() => String(route.query.listType ?? ""));
const yearList = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - 1970 + 1 }, (_, index) => currentYear - index);
});

const goHome = () => {
  genreMenuOpen.value = false;
  yearMenuOpen.value = false;
  countryMenuOpen.value = false;
  mobileMenuOpen.value = false;
  router.push("/overview");
};

const sanitizeQuery = (value: string) => value.trim();

const cleanQueryObject = (query: Record<string, string>) => {
  return Object.fromEntries(Object.entries(query).filter(([, value]) => Boolean(value)));
};

const buildOverviewQuery = (overrides: Partial<Record<string, string>> = {}) => {
  const base = {
    genre: String(route.query.genre ?? ""),
    genreName: String(route.query.genreName ?? ""),
    year: String(route.query.year ?? ""),
    yearName: String(route.query.yearName ?? ""),
    country: String(route.query.country ?? ""),
    countryName: String(route.query.countryName ?? ""),
    keyword: String(route.query.keyword ?? ""),
    listType: String(route.query.listType ?? ""),
    listName: String(route.query.listName ?? ""),
  };

  return cleanQueryObject({ ...base, ...overrides });
};

const toggleGenreMenu = () => {
  yearMenuOpen.value = false;
  countryMenuOpen.value = false;
  genreMenuOpen.value = !genreMenuOpen.value;
};

const toggleYearMenu = () => {
  genreMenuOpen.value = false;
  countryMenuOpen.value = false;
  yearMenuOpen.value = !yearMenuOpen.value;
};

const toggleCountryMenu = () => {
  genreMenuOpen.value = false;
  yearMenuOpen.value = false;
  countryMenuOpen.value = !countryMenuOpen.value;
};

const selectGenre = (slug: string, name: string) => {
  genreMenuOpen.value = false;
  mobileMenuOpen.value = false;
  router.push({
    path: "/overview",
    query: buildOverviewQuery({
      genre: slug,
      genreName: name,
    }),
  });
};

const selectYear = (year: number) => {
  yearMenuOpen.value = false;
  mobileMenuOpen.value = false;
  router.push({
    path: "/overview",
    query: buildOverviewQuery({
      year: String(year),
      yearName: String(year),
    }),
  });
};

const selectCountry = (slug: string, name: string) => {
  countryMenuOpen.value = false;
  mobileMenuOpen.value = false;
  router.push({
    path: "/overview",
    query: buildOverviewQuery({
      country: slug,
      countryName: name,
    }),
  });
};

const selectListType = (slug: string, name: string) => {
  mobileMenuOpen.value = false;
  router.push({
    path: "/overview",
    query: buildOverviewQuery({
      listType: slug,
      listName: name,
    }),
  });
};

const submitSearch = () => {
  const keyword = sanitizeQuery(searchKeyword.value);
  if (!keyword) {
    goAllFilms();
    return;
  }

  mobileMenuOpen.value = false;

  router.push({
    path: "/overview",
    query: buildOverviewQuery({ keyword }),
  });
};

const goAllFilms = () => {
  genreMenuOpen.value = false;
  yearMenuOpen.value = false;
  countryMenuOpen.value = false;
  mobileMenuOpen.value = false;
  searchKeyword.value = "";
  router.push({ path: "/overview" });
};

const handleDocumentClick = (event: MouseEvent) => {
  if (!genreMenuOpen.value && !yearMenuOpen.value && !countryMenuOpen.value) return;

  const target = event.target as Node | null;
  const clickedGenreMenu = target && genreMenuRef.value && genreMenuRef.value.contains(target);
  const clickedYearMenu = target && yearMenuRef.value && yearMenuRef.value.contains(target);
  const clickedCountryMenu = target && countryMenuRef.value && countryMenuRef.value.contains(target);

  if (!clickedGenreMenu) {
    genreMenuOpen.value = false;
  }

  if (!clickedYearMenu) {
    yearMenuOpen.value = false;
  }

  if (!clickedCountryMenu) {
    countryMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
});

watch(
  () => route.fullPath,
  () => {
    genreMenuOpen.value = false;
    yearMenuOpen.value = false;
    countryMenuOpen.value = false;
    mobileMenuOpen.value = false;
    searchKeyword.value = String(route.query.keyword ?? "");
  },
  { immediate: true },
);
</script>

<template>
  <header class="header">
    <button
      v-if="mobileMenuOpen"
      type="button"
      class="header__backdrop"
      @click="mobileMenuOpen = false"
      aria-label="Đóng menu"
    />

    <div class="header__inner">
      <div class="header__topbar">
        <div class="header__brand" @click="goHome">THẬT MÀ</div>

        <div class="header__search">
          <label class="search-field" aria-label="Search products">
            <span class="search-field__icon">⌕</span>
            <input
              v-model="searchKeyword"
              @keyup.enter="submitSearch"
              class="search-field__input"
              type="search"
              placeholder="Tìm phim..."
            />
          </label>

          <button type="button" class="btn btn--primary btn--small" @click="submitSearch">Tìm kiếm</button>
        </div>

        <!-- <router-link to="/login" class="btn btn--secondary btn--small header__member">Thành viên</router-link> -->

        <button type="button" class="header__menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Mở menu">
          <span class="header__menu-line" />
          <span class="header__menu-line" />
          <span class="header__menu-line" />
        </button>
      </div>

      <div class="header__menu" :class="{ 'header__menu--open': mobileMenuOpen }">
        <button type="button" class="header__menu-close" @click="mobileMenuOpen = false" aria-label="Đóng menu">
          ×
        </button>

        <nav class="top-nav" aria-label="Primary">
          <router-link to="/overview" class="top-nav__link"> Phim </router-link>

          <div ref="genreMenuRef" class="top-nav__genre">
            <button class="top-nav__link top-nav__link--button" type="button" @click="toggleGenreMenu">
              Thể loại
              <strong>{{ currentGenreLabel }}</strong>
            </button>

            <div v-if="genreMenuOpen" class="genre-menu__panel">
              <div class="genre-menu__head">
                <span>Chọn thể loại</span>
                <button class="genre-menu__all" type="button" @click="goAllFilms">Tất cả phim</button>
              </div>

              <div class="genre-menu__list">
                <button
                  v-for="genre in genreList"
                  :key="genre._id"
                  type="button"
                  class="genre-menu__item"
                  @click="selectGenre(genre.slug, genre.name)"
                >
                  {{ genre.name }}
                </button>
              </div>
            </div>
          </div>

          <div ref="yearMenuRef" class="top-nav__genre">
            <button class="top-nav__link top-nav__link--button" type="button" @click="toggleYearMenu">
              Năm
              <strong>{{ currentYearLabel }}</strong>
            </button>

            <div v-if="yearMenuOpen" class="genre-menu__panel genre-menu__panel--year">
              <div class="genre-menu__head">
                <span>Chọn năm</span>
                <button class="genre-menu__all" type="button" @click="goAllFilms">Tất cả phim</button>
              </div>

              <div class="year-menu__list">
                <button
                  v-for="year in yearList"
                  :key="year"
                  type="button"
                  class="genre-menu__item"
                  @click="selectYear(year)"
                >
                  {{ year }}
                </button>
              </div>
            </div>
          </div>

          <div ref="countryMenuRef" class="top-nav__genre">
            <button class="top-nav__link top-nav__link--button" type="button" @click="toggleCountryMenu">
              Quốc gia
              <strong>{{ currentCountryLabel }}</strong>
            </button>

            <div v-if="countryMenuOpen" class="genre-menu__panel genre-menu__panel--year">
              <div class="genre-menu__head">
                <span>Chọn quốc gia</span>
                <button class="genre-menu__all" type="button" @click="goAllFilms">Tất cả phim</button>
              </div>

              <div class="country-menu__list">
                <button
                  v-for="country in countryList"
                  :key="country._id"
                  type="button"
                  class="genre-menu__item"
                  @click="selectCountry(country.slug, country.name)"
                >
                  {{ country.name }}
                </button>
              </div>
            </div>
          </div>

          <div class="top-nav__list">
            <button
              type="button"
              class="top-nav__link top-nav__link--button"
              :class="{ 'top-nav__link--active': currentListType === 'phim-le' }"
              @click="selectListType('phim-le', 'Phim lẻ')"
            >
              Phim lẻ
            </button>
            <button
              type="button"
              class="top-nav__link top-nav__link--button"
              :class="{ 'top-nav__link--active': currentListType === 'phim-bo' }"
              @click="selectListType('phim-bo', 'Phim bộ')"
            >
              Phim bộ
            </button>
            <button
              type="button"
              class="top-nav__link top-nav__link--button"
              :class="{ 'top-nav__link--active': currentListType === 'phim-chieu-rap' }"
              @click="selectListType('phim-chieu-rap', 'Phim chiếu rạp')"
            >
              Phim chiếu rạp
            </button>
          </div>

          <!-- <router-link to="/product" class="top-nav__link">
          Danh mục
        </router-link> -->
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header__inner {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
}

.header__topbar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header__search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header__member {
  white-space: nowrap;
}

.top-nav__genre {
  position: relative;
}

.header__backdrop {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 0.48);
  border: 0;
  z-index: 25;
}

.header__menu-toggle {
  display: none;
  width: 2.5rem;
  height: 2.5rem;
  border: 0.0625rem solid var(--color-hairline-dark);
  border-radius: var(--radius-md);
  background: var(--color-surface-dark);
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.25rem;
}

.header__menu-line {
  width: 1.1rem;
  height: 0.125rem;
  border-radius: 1rem;
  background: var(--color-text-dark);
}

.header__menu {
  width: 100%;
  padding-top: 0.5rem;
  border-top: 0.0625rem solid var(--color-hairline-dark);
}

.header__menu-close {
  display: none;
}

.top-nav__link--button {
  border: 0;
  cursor: pointer;
  background: transparent;
}

.top-nav__list {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.top-nav__link--active {
  color: var(--color-primary);
  background: rgb(252 213 53 / 0.1);
}

.top-nav {
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 0.5rem;
  padding-bottom: 0.25rem;
}

.top-nav::-webkit-scrollbar {
  height: 0.25rem;
}

.top-nav::-webkit-scrollbar-thumb {
  background: rgb(252 213 53 / 0.2);
  border-radius: 999px;
}

.top-nav__link {
  padding: 0.4rem 0.6rem;
  font-size: 0.8125rem;
}

.top-nav__link--button strong {
  margin-left: 0.375rem;
  color: var(--color-primary);
  font-weight: 700;
}

.genre-menu__panel {
  position: fixed;
  top: 5.5rem;
  left: 50%;
  right: auto;
  transform: translateX(-50%);
  width: min(60rem, calc(100vw - 2rem));
  max-height: 24rem;
  overflow: auto;
  padding: 1rem;
  border-radius: var(--radius-xl);
  border: 0.0625rem solid var(--color-hairline-dark);
  background: var(--color-canvas-dark);
  box-shadow: var(--shadow-soft);
  z-index: 30;
}

.genre-menu__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.875rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.genre-menu__all {
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.genre-menu__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: 0.5rem;
}

.year-menu__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5.5rem, 1fr));
  gap: 0.5rem;
}

.country-menu__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: 0.5rem;
}

.genre-menu__item {
  padding: 0.75rem 0.875rem;
  border-radius: var(--radius-lg);
  border: 0.0625rem solid var(--color-hairline-dark);
  background: var(--color-surface-dark);
  color: var(--color-text-dark);
  text-align: left;
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.genre-menu__item:hover {
  border-color: rgb(252 213 53 / 0.45);
  background: rgb(252 213 53 / 0.08);
  color: var(--color-primary);
}

@media (max-width: 56rem) {
  .header__inner {
    gap: 0.5rem;
  }

  .header__topbar {
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .header__search {
    order: 3;
    width: 100%;
  }

  .header__menu-toggle {
    display: inline-flex;
    z-index: 35;
  }

  .header__menu {
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    width: 60vw;
    max-width: 22rem;
    min-width: 16rem;
    height: 100vh;
    padding: 1rem;
    background: var(--color-canvas-dark);
    border-left: 0.0625rem solid var(--color-hairline-dark);
    transform: translateX(100%);
    visibility: hidden;
    transition: transform 0.25s ease, visibility 0.25s;
    z-index: 35;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
  }

  .header__menu--open {
    display: flex;
    transform: translateX(0);
    visibility: visible;
  }

  .header__menu-close {
    display: inline-flex;
    align-self: flex-end;
    width: 2rem;
    height: 2rem;
    border: 0;
    border-radius: var(--radius-sm);
    background: var(--color-surface-dark);
    color: var(--color-text-dark);
    font-size: 1.25rem;
    line-height: 1;
    align-items: center;
    justify-content: center;
  }

  .top-nav,
  .header__actions {
    width: 100%;
  }

  .top-nav {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .top-nav__link,
  .top-nav__link--button {
    width: 100%;
    text-align: left;
  }

  .search-field {
    min-width: 0;
    width: 100%;
  }

  .top-nav__genre {
    position: static;
  }

  .genre-menu__panel {
    position: static;
    width: 100%;
    max-height: 14rem;
    transform: none;
    margin-top: 0.5rem;
  }
}

@media (max-width: 40rem) {
  .genre-menu__panel {
    padding: 0.875rem;
  }

  .genre-menu__list {
    grid-template-columns: 1fr 1fr;
  }

  .year-menu__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .country-menu__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
  }
}
</style>

import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../MainLayout.vue";
import NoLayout from "../NoLayout.vue";
import Login from "../views/login/component/Login.vue";
// import { useAuthStore } from "../services/auth/auth.store";

import NotFound from "../views/not-found-page/NotFound.vue";
import ProductView from "../views/product/components/ProductView.vue";
import OverViewFilm from "../views/over-view/pages/OverViewFilm.vue";
import InforFilm from "../views/over-view/pages/InforFilm.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },
    redirect: "/overview",
    children: [
      {
        path: "product",
        component: ProductView,
      },
      {
        path: "overview",
        component: OverViewFilm,
      },
      {
        path: "overview/:slug",
        component: InforFilm,
      },
    ],
  },

  {
    path: "/",
    component: NoLayout,
    children: [
      {
        path: "login",
        component: Login,
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// // 🔐 Guard
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();

//   // 👉 Chưa login mà vào route cần auth
//   if (to.meta.requiresAuth && from.meta.requiresAuth && !authStore.isAuthenticated) {
//     next("/login");
//   }
//   // 👉 Đã login mà vào login
//   else if (to.path === "/login" && authStore.isAuthenticated) {
//     next("/product");
//   } else {
//     next();
//   }
// });

export default router;

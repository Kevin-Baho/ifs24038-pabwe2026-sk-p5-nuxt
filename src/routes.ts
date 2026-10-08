import type { RouteRecordRaw } from "vue-router";
import AuthLayout from "./features/auth/layouts/AuthLayout.vue";
import LoginPage from "./features/auth/pages/LoginPage.vue";
import RegisterPage from "./features/auth/pages/RegisterPage.vue";
import CashFlowLayout from "./features/cashflows/layouts/CashFlowLayout.vue";
import HomePage from "./features/cashflows/pages/HomePage.vue";
import DetailPage from "./features/cashflows/pages/DetailPage.vue";
import ProfilePage from "./features/users/pages/ProfilePage.vue";
import UsersPage from "./features/users/pages/UsersPage.vue";
import NotFoundPage from "./features/common/pages/NotFoundPage.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "login",
        component: LoginPage,
        meta: { requiresGuest: true }
      }
    ]
  },
  {
    path: "/register",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "register",
        component: RegisterPage,
        meta: { requiresGuest: true }
      }
    ]
  },
  {
    path: "/",
    component: CashFlowLayout,
    children: [
      {
        path: "",
        name: "home",
        component: HomePage,
        meta: { requiresAuth: true }
      },
      {
        path: "detail/:id",
        name: "detail",
        component: DetailPage,
        meta: { requiresAuth: true }
      },
      {
        path: "users",
        name: "users",
        component: UsersPage,
        meta: { requiresAuth: true }
      },
      {
        path: "profile",
        name: "profile",
        component: ProfilePage,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundPage
  }
];


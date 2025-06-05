import { createRouter, createWebHistory } from "vue-router";
import ProductView from "@/views/ProductView.vue";
import CartView from "@/views/CartView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import HomeView from "@/views/HomeView.vue";
import BrandView from "@/views/BrandView.vue";
// import ProfileView from "@/views/ProfileView.vue";
import ChatRoomView from "@/views/ChatRoomView.vue";
import MatchView from "../views/MatchView.vue";
import ActivityList from "@/components/ActivityList.vue"
import ActivityView from "@/components/ActivityForm.vue"
import EditProfileView from "@/views/EditProfileView.vue";

import { useUserStore } from "@/stores/user.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    // (0605 目前無用先註解 by蕭)
    // {
    //   path: "/profile",
    //   name: "googleProfile",
    //   component: ProfileView,
    // },
    {
      path: "/product",
      name: "Product",
      component: ProductView,
    },
    {
      path: "/cart",
      name: "Cart",
      component: CartView,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterView,
    },
    {
      path: "/chat",
      name: "ChatRoom",
      component: ChatRoomView,
    },
    {
      path: "/match",
      name: "Match",
      component: MatchView,
    },
    {
      path: "/brand/:id",
      name: "Brand",
      component: BrandView,
    },
    {
      path: "/activities",
      name: "Activities",
      component: ActivityList,
    },
    {
      path: "/activities/new",
      name: "activityCreate",
      component: ActivityView,
    },
    {
      path: "/activities/edit/:id",
      name: "activityEdit",
      component: ActivityView,
    },
    // 加入編輯個人檔案頁面route
    {
      path: "/edit-profile",
      name: "EditProfile",
      component: EditProfileView,
      meta: { requiresAuth: true },
    },
  ],
});

// 避免未登入直接進頁面
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // 強制轉成布林值 判斷是否有token
  const isLoggedIn = !!userStore.accessToken;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: "Login" }); // 沒登入就導登入頁
  } else {
    next(); // 其他狀況放行
  }
});

export default router;

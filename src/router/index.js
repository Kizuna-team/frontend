import { createRouter, createWebHistory } from "vue-router";
import ActivityList from "@/components/ActivityList.vue";
import ActivityView from "@/components/ActivityForm.vue";
import BrandView from "@/views/BrandView.vue";
import BlessingView from "@/views/BlessingView.vue";
import CartView from "@/views/CartView.vue";
import ChatRoomView from "@/views/ChatRoomView.vue";
import EditProfileView from "@/views/EditProfileView.vue";
import GiftCheckoutView from "@/views/GiftCheckoutView.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import MatchView from "../views/MatchView.vue";
import MemberView from "@/views/MemberView.vue";
import ProfileTwoView from "@/views/ProfileTwoView.vue";
import ProductView from "@/views/ProductView.vue";
// import ProfileView from "@/views/ProfileView.vue";
import PaymentView from "@/views/PaymentView.vue";
import ProductAdminView from "@/views/ProductAdminView.vue";
import RegisterView from "@/views/RegisterView.vue";
import SubscriptionView from "@/views/SubscriptionView.vue";

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
    {
      path: "/brand/:id",
      name: "Brand",
      component: BrandView,
    },
    {
      path: "/blessing",
      name: "Blessing",
      component: BlessingView,
    },
    {
      path: "/cart",
      name: "Cart",
      component: CartView,
    },
    {
      path: "/chat",
      name: "ChatRoom",
      component: ChatRoomView,
    },
    {
      path: "/edit-profile",
      name: "EditProfile",
      component: EditProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/gift-checkout",
      name: "GiftCheckout",
      component: GiftCheckoutView,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/match",
      name: "Match",
      component: MatchView,
    },
    {
      path: "/member",
      name: "Member",
      component: MemberView,
    },
    {
      path: "/order/confirm",
      name: "Payment",
      component: PaymentView,
    },
    {
      path: "/super/products/inventory",
      name: "ProductAdmin",
      component: ProductAdminView,
    },
    {
      path: "/profile",
      component: ProfileTwoView,
    },
    {
      path: "/product",
      name: "Product",
      component: ProductView,
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterView,
    },
    {
      path: "/subscribe",
      name: "Subscribe",
      component: SubscriptionView,
    },

    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFound.vue"),
      meta: { hideHeader: true },
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

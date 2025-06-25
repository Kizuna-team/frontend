import { createRouter, createWebHistory } from "vue-router";
import ActivityList from "@/components/ActivityList.vue";
import ActivityView from "@/components/ActivityForm.vue";
import ActivityMyView from "@/views/ActivityMyView.vue";
import CartView from "@/views/CartView.vue";
import ChatRoomView from "@/views/ChatRoomView.vue";
import EventCardByIdView from "@/views/EventCardByIdView.vue";
import EditProfileView from "@/views/EditProfileView.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import MatchView from "@/views/MatchView.vue";
import MatchSetupView from "@/views/MatchSetupView.vue";
import MyOrdersView from "@/views/MyOrdersView.vue"
import NotFound from "@/views/NotFound.vue";
import ProfileTwoView from "@/views/ProfileTwoView.vue";
import ProductView from "@/views/ProductView.vue";
import PaymentView from "@/views/PaymentView.vue";
import ProductAdminView from "@/views/ProductAdminView.vue";
import RegisterView from "@/views/RegisterView.vue";
import SubscriptionView from "@/views/SubscriptionView.vue";

import { useUserStore } from "@/stores/user.js";
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_PATH),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/activities",
      name: "Activities",
      component: ActivityList,
    },
    {
      path: "/activities/my",
      name: "myActivity",
      component: ActivityMyView,
    },
    {
      path: "/activities/new",
      name: "activityCreate",
      component: ActivityView,
    },
    {
      path: "/activities/:id",
      name: "eventDetail",
      component: EventCardByIdView,
    },
    {
      path: "/activities/edit/:id",
      name: "activityEdit",
      component: ActivityView,
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
      path: "/chat",
      name: "ChatRoomView",
      component: ChatRoomView,
    },
    {
      path: "/edit-profile",
      name: "EditProfile",
      component: EditProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
      meta: { hideHeader: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/my-orders",
      name: "MyOrdersView",
      component: MyOrdersView,
    },
    {
      path: "/match",
      name: "Match",
      component: MatchView,
    },
    {
      path: "/match/setup",
      name: "MatchSetup",
      component: MatchSetupView,
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
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFound.vue"),
      meta: { hideHeader: true },
    },
    {
      path: "/subscription",
      name: "Subscription",
      component: SubscriptionView,
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

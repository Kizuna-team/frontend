import { createRouter, createWebHistory } from "vue-router";
import ProductView from "@/views/ProductView.vue";
import CartView from "@/views/CartView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import HomeView from "@/views/HomeView.vue";
import BrandView from "@/views/BrandView.vue";
import ProfileView from "@/views/ProfileView.vue";
import ChatRoomView from "@/views/ChatRoomView.vue";
import MatchView from "../views/MatchView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/profile",
      name: "googleProfile",
      component: ProfileView,
    },
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
  ],
});

export default router;

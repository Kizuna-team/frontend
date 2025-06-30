import axios from "../api/axios";
import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const accessToken = ref(localStorage.getItem("accessToken") || "");
  const refreshToken = ref(localStorage.getItem("refreshToken") || "");
  const username = ref(localStorage.getItem("username") || "");
  const userId = ref(localStorage.getItem("userId") || "");

  const subscriptionPlan = ref(
    localStorage.getItem("subscriptionPlan") || "free"
  );

  const profile = reactive({
    gender: "",
    age: null,
    city: "",
    bio: "",
  });

  // 從資料庫抓 profile
  function getProfile(profileDate) {
    profile.gender = profileDate.gender;
    profile.age = profileDate.age;
    profile.city = profileDate.city;
    profile.bio = profileDate.bio;
  }

  const isLoggedIn = computed(() => !!accessToken.value);

  const register = async (usernameInput, passwordInput) => {
    try {
      const res = await axios.post("/auth/register", {
        username: usernameInput,
        password: passwordInput,
      });

      if (res.status === 200) {
        return { success: true, message: res.data.message };
      } else {
        console.warn("非 200 回應", res);
        return { success: false, message: "伺服器未回應成功" };
      }
    } catch (error) {
      const msg = error.response?.data?.message || "註冊失敗";
      const reason = error.response?.data?.reason;
      console.error(msg, reason);
      return { success: false, message: msg, reason };
    }
  };

  const login = async (usernameInput, passwordInput) => {
    try {
      const res = await axios.post("/auth/login", {
        username: usernameInput,
        password: passwordInput,
      });

      accessToken.value = res.data.accessToken;
      refreshToken.value = res.data.refreshToken;
      username.value = res.data.username;
      userId.value = res.data.userId;

      localStorage.setItem("accessToken", accessToken.value);
      localStorage.setItem("refreshToken", refreshToken.value);
      localStorage.setItem("username", username.value);
      localStorage.setItem("userId", userId.value);

      const storedCartUserId = localStorage.getItem("cartUserId");
      const currentUserId = String(userId.value);

      if (storedCartUserId && storedCartUserId !== currentUserId) {
        localStorage.removeItem("cartItems");
        const { useCartStore } = await import("../stores/cart.js");
        const cartStore = useCartStore();
        cartStore.cartItems = [];
      }

      localStorage.setItem("cartUserId", currentUserId);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    accessToken.value = "";
    refreshToken.value = "";
    username.value = "";
    userId.value = null;
    profile.age = null;
    profile.gender = "";
    profile.city = "";
    profile.bio = "";

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  };

  const refresh = async () => {
    const res = await axios.post("/refresh", {
      refreshToken: refreshToken.value,
    });

    accessToken.value = res.data.accessToken;
    localStorage.setItem("accessToken", accessToken.value);
  };

  const loginWithGoogle = async (idToken) => {
    try {
      const res = await axios.post("/auth/google", { credential: idToken });

      const {
        accessToken: newAccessToken,
        refreshToken: newFreshToken,
        user,
      } = res.data;

      accessToken.value = newAccessToken;
      refreshToken.value = newFreshToken;
      username.value = user.username;

      localStorage.setItem("accessToken", accessToken.value);
      localStorage.setItem("refreshToken", refreshToken.value);
      localStorage.setItem("username", username.value);
    } catch (error) {
      console.error("Google登入失敗", error.message);
    }
  };

  const setSubscription = (plan) => {
    subscriptionPlan.value = plan;
    localStorage.setItem("subscriptionPlan", plan);
  };
  return {
    accessToken,
    refreshToken,
    username,
    userId,
    profile,
    isLoggedIn,
    getProfile,
    register,
    login,
    logout,
    refresh,
    loginWithGoogle,
    setSubscription,
  };
});

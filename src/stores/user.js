// 使用 Pinia 管理 user 的狀態，Composition API 寫法
import axios from "../api/axios";
import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue"; // 加入 computed

export const useUserStore = defineStore("user", () => {
  // 初始化
  const accessToken = ref(localStorage.getItem("accessToken") || "");
  const refreshToken = ref(localStorage.getItem("refreshToken") || "");
  const username = ref(localStorage.getItem("username") || "");
  const userId = ref(localStorage.getItem("userId") || "");
  // 設定使用者的訂閱計畫
  const subscriptionPlan = ref(localStorage.getItem("subscriptionPlan") || "free");

  const profile = reactive({
    gender: "",
    age: null,
    location: "",
    bio: "",
    interests: [],
  });

  // 【新增】計算屬性 - 檢查是否已登入
  const isLoggedIn = computed(() => {
    return !!(accessToken.value && userId.value);
  });

  // 【新增】計算屬性 - 使用者顯示名稱
  const displayName = computed(() => {
    return username.value || `User${userId.value}` || "訪客";
  });

  // 【新增】計算屬性 - 完整使用者資訊（為了聊天室使用）
  const user = computed(() => ({
    id: userId.value,
    name: username.value,
    displayName: displayName.value,
    profile: profile,
    isLoggedIn: isLoggedIn.value
  }));

  // 從資料庫抓 profile
  function getProfile(profileDate){
    profile.gender = profileDate.gender;
    profile.age = profileDate.age;
    profile.location = profileDate.location;
    profile.bio = profileDate.bio;
    profile.interests = profileDate.interests;
  }

  // 註冊
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

  // 登入
  const login = async (usernameInput, passwordInput) => {
    try {
      const res = await axios.post("/auth/login", {
        username: usernameInput,
        password: passwordInput,
      });

      // console.log(res.data);
      accessToken.value = res.data.accessToken;
      refreshToken.value = res.data.refreshToken;
      username.value = res.data.username;
      userId.value = res.data.userId;

      localStorage.setItem("accessToken", accessToken.value);
      localStorage.setItem("refreshToken", refreshToken.value);
      localStorage.setItem("username", username.value);
      localStorage.setItem("userId", userId.value);
    } catch (error) {
      // console.log("進入 catch 區塊");
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.error("登入失敗", error.response.data.message);
        alert("登入失敗：" + error.response.data.message);
      } else {
        console.error("登入失敗", error.message);
        alert("登入失敗：登入請求失敗：" + error.message);
      }
    }
  };

  // 登出
  const logout = async () => {
    accessToken.value = "";
    refreshToken.value = "";
    username.value = "";
    userId.value = null;
    profile.age= null;
    profile.gender = "";
    profile.location = "";
    profile.bio = "";
    profile.interests = [];

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

  };

  // 用 refreshToken 取得新的 accessToken
  const refresh = async () => {
    const res = await axios.post("/refresh", {
      refreshToken: refreshToken.value,
    });

    accessToken.value = res.data.accessToken;
    localStorage.setItem("accessToken", accessToken.value);
  };

  // Google 登入
  const loginWithGoogle = async (idToken) => {
    try {
      console.log("google嘗試登入中 idToken", idToken);

      const res = await axios.post("/auth/google", { credential: idToken });
      
      const { accessToken: newAccessToken, refreshToken: newFreshToken, user } = res.data;
      console.log("從後端傳回來的response:", res.data);

      accessToken.value = newAccessToken;
      refreshToken.value = newFreshToken;
      username.value = user.username;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("username", username);
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
    getProfile,
    register,
    login,
    logout,
    refresh,
    loginWithGoogle,
    setSubscription,
  };
});

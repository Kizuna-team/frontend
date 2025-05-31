// 使用 Pinia 管理 user 的狀態，Composition API 寫法
import axios from "../api/axios";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useUserStore = defineStore("user", () => {
  // 初始化
  const accessToken = ref(localStorage.getItem("accessToken") || "");
  const refreshToken = ref(localStorage.getItem("refreshToken") || "");
  const username = ref(localStorage.getItem("username") || "");
  const userId = ref(localStorage.getItem("userId") || "");

  const profile = reactive({
    gender: "",
    age: null,
    location: "",
    bio: "",
    interests: [],
  });

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
      const res = await axios.post("/auth/google", { idToken });

      accessToken.value = res.data.accessToken;
      refreshToken.value = res.data.refreshToken;
      username.value = res.data.username;

      localStorage.setItem("accessToken", accessToken.value);
      localStorage.setItem("refreshToken", refreshToken.value);
      localStorage.setItem("username", username.value);
    } catch (error) {
      console.error("Google登入失敗", error.message);
    }
  };

  // 最後 return 出來
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
  };
});

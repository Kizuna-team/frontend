// 使用 Pinia 管理 user 的狀態 實現 login logout refresh token 的動作
import axios from "@/api/axios";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  // 初始化 從 localStorage 中拿出儲存的 token (如果有的話)
  state: () => ({
    accessToken: localStorage.getItem("accessToken") || "",
    refreshToken: localStorage.getItem("refreshToken") || "",
    // 在 state 中定義 username 這樣vue模板才吃得到值
    username: localStorage.getItem("username") || "",
    userId: localStorage.getItem("userId") || "",
  }),
  actions: {
    // 註冊
    async register(username, password) {
      try {
        const res = await axios.post("/auth/register", { username, password });
        // 只有當後端真的回傳成功才算註冊成功
        if (res.status === 200) {
          // console.log("註冊成功", res.data);
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
    },
    // 發送POST請求到指定的API網址 代入帳號&密碼 後端會回傳JWT Token
    // login()方法總共做3件事:
    // 1 打API(POST 新增這個使用者)
    // 2 將 res 的 accessToken 和 refreshToken 存到 Pinia 的 state
    // 3 同步儲存到瀏覽器的 localStorage (這樣重新整理也能保留登入狀態)
    async login(username, password) {
      try {
        const res = await axios.post("/auth/login", {
          username,
          password,
        });
        // console.log(res);
        // console.log(res.data);
        this.accessToken = res.data.accessToken;
        this.refreshToken = res.data.refreshToken;
        // 把資料寫入 pinia 的 state => 這樣 Vue 模板中的畫面才會 立即更新
        this.username = res.data.username;
        // 為了知道是哪個使用者在聊天 接住從後端回傳的userId
        this.userId = res.data.userId;

        localStorage.setItem("accessToken", this.accessToken);
        localStorage.setItem("refreshToken", this.refreshToken);
        // 在 login() 成功後 順便把 username 記下來
        localStorage.setItem("username", this.username);
        localStorage.setItem("userId", this.userId);
      } catch (error) {
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
    },
    // 清除 token
    // logout做兩件事:
    // 1 將 store 中的 token 清除
    // 2 清空 localStorage ( 避免刷新後仍為登入狀態 )
    async logout() {
      this.accessToken = "";
      this.refreshToken = "";
      this.username = "";
      this.userId = "";

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
    },
    // 用 refreshToken 取得新的 accessToken
    // refresh做三件事:
    // 1 再打一次API 帶上目前的 refreshToken 發送POST請求到 /api/refresh 要求新的 accessToken
    // 2 更新 store 中的 accessToken
    // 3 更新 localStorage 中的 accessToken
    async refresh() {
      const res = await axios.post("/refresh", {
        refreshToken: this.refreshToken,
      });

      this.accessToken = res.data.accessToken;
      localStorage.setItem("accessToken", this.accessToken);
    },
    // 用 Google 登入
    async loginWithGoogle(idToken) {
      try {
        const res = await axios.post("/auth/google", { idToken });

        // 更新 store 中的各個資料的狀態
        this.accessToken = res.data.accessToken;
        this.refreshToken = res.data.refreshToken;
        // 假設後端有回傳使用者名稱(gmail帳號)
        this.username = res.data.username;

        localStorage.setItem("accessToken", this.accessToken);
        localStorage.setItem("refreshToken", this.refreshToken);
        localStorage.setItem("username", this.username);
      } catch (error) {
        console.error("Google登入失敗", error.message);
      }
    },
  },
});

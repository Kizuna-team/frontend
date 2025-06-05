// 提供方法setProfile，避免把後端沒回傳的欄位直接覆蓋，而是合併後保留未編輯的欄位
// 組件可用 store.loading 和 store.error 直接知道目前載入與錯誤狀態
// 跨頁共享資料，用 ref + .value 比 reactive明確好控

import { defineStore } from "pinia";
import { ref } from "vue";
import {
  fetchProfile,
  updateProfileApi,
  createProfileApi,
} from "@/api/profile";

export const useUserProfileStore = defineStore("userProfile", () => {
  // 使用者的存檔資料（後端同步）
  const userProfile = ref({
    userId: null,
    name: "",
    gender: "",
    bio: "",
    orientation: "",
    age: null,
    location: "",
    zodiac: "",
    mbti: "",
    job: "",
    interests: [],
  });

  // 資料載入中狀態、錯誤狀態提示
  const loading = ref(false);
  const error = ref(null);

  // 保留沒傳回來的欄位，再覆蓋被編輯的
  // 帶入後端傳回的「使用者資料物件」
  const setProfile = (data) => {
    userProfile.value = { ...userProfile.value, ...data };
  };

  // 從後端取得個人資料，顯示「載入中」將錯誤狀態清空，最後都結束在載入中
  // data 是 { message, user }
  const getProfile = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await fetchProfile();
      setProfile(data.user); // 不會遺失沒有回傳的欄位
    } catch (err) {
      error.value = "取得資料失敗";
      console.error("取得使用者資料失敗", err);
    } finally {
      loading.value = false;
    }
  };

  // 建立個人資料 (送出 showFormData 的值給後端)
  const createProfile = async (newUserData) => {
    loading.value = true;
    error.value = null;

    try {
      console.log("初次建立的資料:", newUserData);
      // 使用者填的資料（只有按按鈕才會執行這段）
      const res = await createProfileApi(newUserData);
      setProfile(res.user); // 存進狀態或 Pinia
    } catch (err) {
      error.value = "建立個人資料失敗";
      console.error("建立個人資料失敗", err);
    } finally {
      loading.value = false;
    }
  };

  // 更新個人資料
  const updateProfile = async (newUserData) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await updateProfileApi(newUserData);
      setProfile(data.user); // 用最新資料覆蓋狀態
    } catch (err) {
      error.value = "更新資料失敗";
      console.error("更新使用者資料失敗", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    userProfile,
    setProfile,
    getProfile,
    createProfile,
    updateProfile,
  };
});
// stores 裡需要保持是 確定的資料，暫存的資料 移去組件
// 再重新get最新資料的做法，會多一次 API 請求浪費效能

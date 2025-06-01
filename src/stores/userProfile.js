// 前端的使用者個人資料中心，儲存使用者的個人資料（profile）
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
    id: null,
    name: "",
    gender: "",
    bio: "",
    orientation: "",
    age: null,
    location: "",
    zodiac: "",
    mbti: "",
    job: "",
    interest: [],
  });

  // 暫存資料表單 (不會存後端)
  const showFormData = ref({ ...userProfile.value });

  // 資料載入中狀態、錯誤狀態提示
  const loading = ref(false);
  const error = ref(null);

  // 保留沒傳回來的欄位，再覆蓋被編輯的
  const setProfile = (data) => {
    userProfile.value = { ...userProfile.value, ...data };
  };

  // 避免誤把未儲存的資料當成正式資料使用，還原
  const resetFormData = () => {
    showFormData.value = { ...userProfile.value };
    console.log("resetFormData showFormData.value:", showFormData.value);
    console.log(
      "interest 型別",
      typeof showFormData.value.interest,
      Array.isArray(showFormData.value.interest)
    );
  };

  // 從後端取得個人資料，顯示「載入中」將錯誤狀態清空，最後都結束在載入中
  // data 是 { message, user }
  const getProfile = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await fetchProfile();
      setProfile(data.user); // 不會遺失沒有回傳的欄位
      resetFormData(); // 同步更新暫存資料
    } catch (err) {
      error.value = "取得資料失敗";
      console.error("取得使用者資料失敗", err);
    } finally {
      loading.value = false;
    }
  };

  // 建立個人資料 (送出 showFormData 的值給後端)
  const createProfile = async () => {
    loading.value = true;
    error.value = null;
    const data = await createProfileApi(showFormData.value);

    try {
      console.log("送出的資料:", data);

      const res = await createProfileApi(data);
      setProfile(data.user); // user.id 現在是資料庫產生的 id
      resetFormData(); // 畫面和狀態同步
    } catch (err) {
      error.value = "建立個人資料失敗";
      console.error("建立個人資料失敗", err);
    } finally {
      loading.value = false;
    }
  };

  // 更新個人資料
  const updateProfile = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await updateProfileApi(showFormData.value);
      setProfile(data.user); // 用最新資料覆蓋狀態
      resetFormData();
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
    showFormData,
    resetFormData,
    setProfile,
    getProfile,
    createProfile,
    updateProfile,
  };
});

// 再重新get最新資料的做法，會多一次 API 請求浪費效能

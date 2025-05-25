// 前端的使用者個人資料中心，儲存使用者的個人資料（profile）
// 提供一個方法（setProfile）來更新這份資料
// 對於跨頁共享的資料，用 ref + .value 比 reactive明確好控
import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchProfile } from "@/api/editProfile";

export const useUserProfileStore = defineStore("userProfile", () => {
  // 保存使用者個人資料狀態 userProfile
  const userProfile = ref({
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

  // 覆蓋、更新原始資料 （表單編輯完後、後端 fetch 回來資料）
  const setProfile = (data) => {
    userProfile.value = { ...userProfile.value, ...data };
  };

  // 從後端取得個人資料
  // data 是後端回傳的完整物件 { message, user }
  const getProfile = async () => {
    try {
      const data = await fetchProfile();
      setProfile(data.user); //比較安全不會遺失沒有回傳的欄位值
    } catch (err) {
      console.error("取得使用者資料失敗", err);
    }
  };

  // 更新個人資料
  const updateProfile = async (newData) => {
    try {
      const data = await apiUpdateProfile(newData);
      setProfile(data.user); // 用最新資料覆蓋狀態
    } catch (err) {
      console.error("更新使用者資料失敗", err);
    }
  };

  return { userProfile, setProfile, getProfile, updateProfile };
});

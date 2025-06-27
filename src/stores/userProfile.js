import { defineStore } from "pinia";
import { ref } from "vue";
import {
  fetchProfile,
  updateProfileApi,
  createProfileApi,
} from "@/api/profile";

export const useUserProfileStore = defineStore("userProfile", () => {
  const userProfile = ref({
    userId: null,
    name: "",
    gender: "",
    bio: "",
    orientation: "",
    age: null,
    city: "",
    zodiac: "",
    mbti: "",
    job: "",
  });

  const loading = ref(false);
  const error = ref(null);

  const setProfile = (data) => {
    const allowedFields = [
      "userId",
      "name",
      "gender",
      "bio",
      "orientation",
      "age",
      "city",
      "zodiac",
      "mbti",
      "job",
    ];

    const filteredData = {};
    // 只修改允許修改的欄位

    allowedFields.forEach((field) => {
      if (field in data) {
        filteredData[field] = data[field];
      }
    });
    userProfile.value = {
      ...userProfile.value,
      ...filteredData,
    };
  };

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

  const createProfile = async (newUserData) => {
    loading.value = true;
    error.value = null;

    try {
      console.log("初次建立的資料:", newUserData);
      const res = await createProfileApi(newUserData);
      setProfile(res.user);
      return res.user;
    } catch (err) {
      error.value = "建立個人資料失敗";
      console.error("建立個人資料失敗", err);
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (newUserData) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await updateProfileApi(newUserData);
      setProfile(data.user);
      return data.user;
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

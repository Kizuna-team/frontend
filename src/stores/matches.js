import { defineStore } from "pinia";
import { ref } from "vue";

export const useMatchStore = defineStore("match", () => {
  const userProfile = ref(null);
  const targetProfile = ref(null);

  const setProfiles = (user, target) => {
    userProfile.value = user;
    targetProfile.value = target;
  };

  // 登出或離開配對畫面時清空記憶體內容
  const clearProfiles = () => {
    userProfile.value = null;
    targetProfile.value = null;
  };

  return {
    userProfile,
    targetProfile,
    setProfiles,
    clearProfiles,
  };
});

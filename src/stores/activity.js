import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "../api/axios";

export const useActivityStore = defineStore("activity", () => {
  const activities = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const selectedActivity = ref(null); 

  const fetchActivities = async () => {
    loading.value = true;
    try {
      const response = await axios.get("/activities");
      activities.value = response.data;
      console.log("API response:", response.data);
    } catch (err) {
      error.value = err;
      console.error("Fetch error:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchActivityById = async (id) => {
    loading.value = true;
    try {
      const response = await axios.get(`/activities/${id}`);
      selectedActivity.value = response.data;
      console.log("取得的活動資料:", response.data);
    } catch (err) {
      error.value = err;
      console.log("取得活動資料失敗", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    selectedActivity,
    activities,
    loading,
    error,
    fetchActivities,
    fetchActivityById
  };
});

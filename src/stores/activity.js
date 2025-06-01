import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "../api/axios";

export const useActivityStore = defineStore("activity", () => {
  const activities = ref([]);
  const loading = ref(false);
  const error = ref(null);

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

  return {
    activities,
    loading,
    error,
    fetchActivities,
  };
});

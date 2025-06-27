import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "../api/axios";

export const useActivityStore = defineStore("activity", () => {
  const activities = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const selectedActivity = ref(null);
  const joinActivities = ref([]);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchActivities = async () => {
    loading.value = true;
    try {
      const response = await axios.get("/activities");
      const allActivities = response.data;

      const today = new Date();
      activities.value = allActivities.filter(
        (activity) => new Date(activity.date) >= today
      );
    } catch (err) {
      error.value = err;
      console.error("Fetch error:", err);
    } finally {
      loading.value = false;
    }
  };
  const fetchMyActivities = async () => {
    loading.value = true;
    try {
      const token = getToken();
      const response = await axios.get("/activities/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      activities.value = response.data;
    } catch (err) {
      error.value = err;
      console.error("載入我的活動失敗:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchActivityById = async (id) => {
    loading.value = true;
    try {
      const token = getToken();
      const response = await axios.get(`/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      selectedActivity.value = response.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const updateActivity = async (id, updatedData) => {
    loading.value = true;
    try {
      const token = getToken();
      const response = await axios.put(`/activities/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const createActivity = async (newActivity) => {
    loading.value = true;
    try {
      const token = getToken();
      const response = await axios.post("/activities", newActivity, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchActivities();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const deleteActivity = async (id) => {
    loading.value = true;
    try {
      const token = getToken();
      const response = await axios.delete(`/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const fetchMyJoinActivities = async () => {
    try {
      const res = await axios.get("/activities/me");
      joinActivities.value = res.data;
    } catch (err) {
      console.error("取得參加活動失敗", err);
    }
  };

  const deleteJoinActivity = async (id) => {
    try {
      const res = await axios.delete(`/activities/join/${id}`);
    } catch (error) {
      console.error("刪除失敗", error);
    }
  };

  return {
    selectedActivity,
    activities,
    loading,
    error,
    joinActivities,
    getToken,
    fetchActivities,
    fetchMyActivities,
    fetchActivityById,
    updateActivity,
    createActivity,
    deleteActivity,
    fetchMyJoinActivities,
    deleteJoinActivity,
  };
});

import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "../api/axios";

export const useActivityStore = defineStore("activity", () => {
  const activities = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const selectedActivity = ref(null);

  const getToken=()=>{
    return localStorage.getItem('token'); 
  }

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
      const token = getToken();
      const response = await axios.get(`/activities/${id}`,{
      headers: { Authorization: `Bearer ${token}` }
    });
      selectedActivity.value = response.data;
      console.log("取得的活動資料:", response.data);
    } catch (err) {
      error.value = err;
      console.log("取得活動資料失敗", err);
    } finally {
      loading.value = false;
    }
  };

  const updateActivity = async (id, updatedData) => {
    loading.value = true;
    try {
      const token = getToken();
      const response = await axios.put(`/activities/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` }
    });
      console.log("更新成功:", response.data);
    } catch (err) {
      error.value = err;
      console.log("更新失敗:", err);
    } finally {
      loading.value = false;
    }
  };

  const createActivity = async (newActivity) => {
    loading.value = true;
    try {
      const token = getToken();
      const response = await axios.post("/activities", newActivity,{
      headers: { Authorization: `Bearer ${token}` }
    });
      console.log("新增成功:", response.data);
      // 可選：新增後自動刷新活動列表
      await fetchActivities();
    } catch (err) {
      error.value = err;
      console.log("新增失敗:", err);
    } finally {
      loading.value = false;
    }
  };

  const deleteActivity = async (id) => {
    loading.value = true;
    try {
      const token = getToken();
      const response = await axios.delete(`/activities/${id}`,{
      headers: { Authorization: `Bearer ${token}` }
    });
      console.log("刪除成功:", response.data);
    } catch (err) {
      error.value = err;
      console.log("刪除失敗:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    selectedActivity,
    activities,
    loading,
    error,
    getToken,
    fetchActivities,
    fetchActivityById,
    updateActivity,
    createActivity,
    deleteActivity,
  };
});

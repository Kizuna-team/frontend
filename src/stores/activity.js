import { defineStore } from "pinia";
import axios from "../api/axios";

export const useActivityStore = defineStore("activity", {
  state: () => ({
    activities: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchActivities() {
      this.loading = true;
      try {
        const response = await axios.get("/activities");
        this.activities = response.data;
        console.log("API response:", response.data);
      } catch (err) {
        this.error = err;
        console.error("Fetch error:", err);
      } finally {
        this.loading = false;
      }
    },
  },
});

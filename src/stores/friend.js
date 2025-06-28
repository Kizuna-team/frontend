import { defineStore } from "pinia";
import axios from "@/api/axios";
import { ref } from "vue";

export const useFriendStore = defineStore("friend", () => {
  const friendList = ref([]);

  const fetchFriendList = async () => {
    try {
      const res = await axios.get("/friendLists");
      friendList.value = res.data.friends;
      console.log(friendList.value);
    } catch (error) {
      console.error("無法取得聊天室列表", error);
    }
  };

  return {
    friendList,
    fetchFriendList,
  };
});
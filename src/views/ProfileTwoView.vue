<script setup>
import { useUserStore } from "@/stores/user";
import { onMounted } from "vue";

const userStore = useUserStore();

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get("accessToken");
  const refreshToken = urlParams.get("refreshToken");
  const userId = urlParams.get("userId");
  const username = urlParams.get("username");

  if (accessToken && refreshToken && userId && username) {
    userStore.accessToken = accessToken;
    userStore.refreshToken = refreshToken;
    userStore.userId = userId;
    userStore.username = username;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
  }
});
</script>

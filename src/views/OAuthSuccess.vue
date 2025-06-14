<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    localStorage.setItem("token", token);
    userStore.setToken(token);
    router.replace("/"); // 導回首頁
  } else {
    router.replace("/login"); // 如果沒有 token，回登入頁
  }
});
</script>

<script setup>
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { onMounted, ref } from "vue";

const route = useRoute();
const userStore = useUserStore();
const user = ref(null);

onMounted(() => {
  const encodedUser = route.query.user;
  if (encodedUser) {
    user.value = JSON.parse(decodeURIComponent(encodedUser));
    console.log(user);
    userStore.username = user.value.email;
    userStore.accessToken = user.value.accessToken;
    userStore.refreshToken = user.value.refreshToken;
  }
});
</script>

<template>
  <div class="home-container">
    <div class="home-content">
      <div v-if="user" class="user-info">
        <div class="photo-location">
          <img :src="user.avatar" alt="Profile" class="profile-picture" />
        </div>
        <h2>{{ user.name }}</h2>
        <p>{{ user.email }}</p>
      </div>
    </div>
  </div>
</template>

<style>
.home-container {
  padding: 2rem;
  width: 500px;
  margin: 0 auto;
}

.home-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.profile-picture {
  margin: 0 auto 2rem auto;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>

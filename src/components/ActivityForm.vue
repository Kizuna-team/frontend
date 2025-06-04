<script setup>
import { ref, watch, computed } from "vue";
import { useActivityStore } from "@/stores/activity.js";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
const store = useActivityStore();
const { loading, error, selectedActivity } = storeToRefs(store);
const { fetchActivityById, updateActivity,createActivity,deleteActivity } = store;

const route = useRoute();

const isEditMode = computed(() => route.name === "activityEdit"); //computed
const formTitle = computed(() => (isEditMode.value ? "編輯活動" : "新增活動"));
const form = ref({
  title: "",
  location: "",
  date: "",
  description: "",
  createdBy: "",
});

watch(
  () => route.name,
  async () => {
    if (isEditMode.value) {
      const id = route.params.id;
      // console.log(selectedActivity)
      try {
        await fetchActivityById(id);
        form.value = {
          title: selectedActivity.value?.title || "",
          location: selectedActivity.value?.location || "",
          date: selectedActivity.value?.date || "",
          description: selectedActivity.value?.description || "",
          createdBy: selectedActivity.value?.createdBy || "",
        };
      } catch (err) {
        console.log(err);
      }
    } else {
      form.value = {
        title: "",
        location: "",
        date: "",
        description: "",
        createdBy: "",
      };
    }
  },
  { immediate: true }
);

async function handleSubmit() {
  if (isEditMode.value) {
    try {
      const id = parseInt(route.params.id);
      await updateActivity(id, form.value); 
      alert("活動已更新！");
    } catch (err) {
      console.log("更新活動時發生錯誤", err);
      alert("更新失敗，請稍後再試");
    }
  } else {
    try {
    await createActivity(form.value);
    alert("活動已建立！");
  } catch (err) {
    console.log("建立活動時發生錯誤", err);
    alert("建立失敗，請稍後再試");
  }
  }
}

async function handleDelete(){
    try {
      const id = parseInt(route.params.id);
      await deleteActivity(id, form.value); 
      alert("活動已刪除！");
    } catch (err) {
      console.log("刪除活動失敗", err);
      alert("刪除失敗，請稍後再試");
    }
}
</script>

<template>
  <p>{{ formTitle }}</p>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="createdBy">主辦人：</label>
      <input id="createdBy" v-model="form.createdBy" placeholder="請輸入名字" />
    </div>
    <div>
      <label for="title">活動標題：</label>
      <input id="title" v-model="form.title" placeholder="請輸入活動標題" />
    </div>
    <div>
      <label for="location">活動地點：</label>
      <input
        id="location"
        v-model="form.location"
        placeholder="請輸入活動地點"
      />
    </div>
    <div>
      <label for="date">活動日期：</label>
      <input id="date" v-model="form.date" type="date" />
    </div>
    <div>
      <label for="description">活動描述：</label>
      <textarea
        id="description"
        v-model="form.description"
        placeholder="請輸入活動描述"
      ></textarea>
    </div>
    <button type="submit">
      {{ isEditMode ? "更新活動" : "建立活動" }}
    </button>
    <button v-if="isEditMode" @click="handleDelete" type="button">
      刪除活動
    </button>
  </form>
</template>

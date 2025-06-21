<script setup>
import { ref, watch, computed } from "vue";
import { useActivityStore } from "@/stores/activity.js";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user.js";
const userStore = useUserStore(); //抓username
const previewUrl = ref(""); // 圖片預覽網址
const store = useActivityStore();
const { loading, error, selectedActivity } = storeToRefs(store);
const { fetchActivityById, updateActivity, createActivity, deleteActivity } =
  store;

const route = useRoute();
const activityId = route.params.id;

const isEditMode = computed(() => route.name === "activityEdit"); //computed
const formTitle = computed(() => (isEditMode.value ? "編輯活動" : "新增活動"));
const form = ref({
  title: "",
  location: "",
  date: "",
  time: "",
  description: "",
  createdBy: "",
});

const today = new Date().toISOString().split("T")[0];
const imageFile = ref(null);

// 處理使用者選檔案
function handleFileChange(event) {
  const file = event.target.files[0];
  imageFile.value = file;
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  } else if (selectedActivity.value?.image_url) {
    previewUrl.value = selectedActivity.value.image_url;
  } else {
    previewUrl.value = "";
  }
}

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
        // 如果有舊圖片就顯示，沒有就空字串
        if (selectedActivity.value?.image_url) {
          previewUrl.value = selectedActivity.value.image_url;
        } else {
          previewUrl.value = "";
        }
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
  // 1. 建立 FormData 物件
  const formData = new FormData();
  formData.append("title", form.value.title);
  formData.append("location", form.value.location);
  formData.append("date", `${form.value.date}T${form.value.time}:00`);
  formData.append("description", form.value.description);
  formData.append("createdBy", form.value.createdBy);
  if (imageFile.value) {
    formData.append("image", imageFile.value); // 圖片也放進去
  }

  try {
    if (isEditMode.value) {
      const id = parseInt(route.params.id);
      await updateActivity(id, formData); // 要用 FormData
      alert("活動已更新！");
    } else {
      await createActivity(formData); // 要用 FormData
      alert("活動已建立！");
    }
  } catch (err) {
    console.log("提交活動時發生錯誤", err);
    alert(isEditMode.value ? "更新失敗" : "建立失敗");
  }
}

async function handleDelete() {
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
  <div class="max-w-xl p-8 mx-auto mt-6 shadow-md rounded-2xl">
    <div class="mb-6">
      <label class="mb-2 mr-2 text-lg font-bold text-darkblue">主辦人：</label>
      <span class="text-gray-500">
        {{
          isEditMode
            ? selectedActivity?.created_by_username
            : userStore.username
        }}
      </span>
    </div>

    <div class="flex justify-center mb-6">
      <img
        v-if="previewUrl"
        :src="previewUrl"
        class="object-cover w-full border h-80 rounded-xl"
      />
    </div>

    <h2 class="mb-6 text-2xl font-bold text-center text-darkblue">{{ formTitle }}</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="title" class="block mb-2 text-lg font-bold text-darkblue ">活動標題：</label>
        <input
          id="title"
          v-model="form.title"
          placeholder="請輸入活動標題"
          class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label for="image" class="block mb-2 text-lg font-bold text-darkblue ">活動圖片：</label>
        <input
          id="image"
          type="file"
          @change="handleFileChange"
          accept="image/*"
          class="w-full border border-gray-300"
        />
      </div>
      <div>
        <label for="location" class="block mb-2 text-lg font-bold text-darkblue "
          >活動地點：</label
        >
        <input
          id="location"
          v-model="form.location"
          placeholder="請輸入活動地點"
          class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:text-secondary"
        />
      </div>
      <div>
        <label for="date" class="block mb-2 text-lg font-bold text-darkblue">活動日期：</label>
        <input
          id="date"
          v-model="form.date"
          type="date"
          :min="today"
          class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:text-secondary"
        />
      </div>
      <div>
        <label for="time" class="block mb-2 text-lg font-bold text-darkblue">活動時間：</label>
        <input
          id="time"
          type="time"
          v-model="form.time"
          class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:text-secondary"
        />
      </div>
      <div>
        <label for="description" class="block mb-2 text-lg font-bold text-darkblue"
          >活動描述：</label
        >
        <textarea
          id="description"
          v-model="form.description"
          placeholder="請輸入活動描述"
          class="w-full h-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:text-secondary"
        ></textarea>
      </div>
      <div class="flex gap-4 mt-6">
        <button
          type="submit"
          class="flex-1 min-w-[130px] w-[150px] h-[40px] px-2.5 py-1.5 font-bold text-white border-2 border-[#219ebc] bg-[#219ebc] rounded-full flex items-center justify-center gap-1 transition-all duration-300 hover:bg-white hover:text-[#219ebc] mx-auto"
        >
          {{ isEditMode ? "更新活動" : "建立活動" }}
        </button>
        <button
          v-if="isEditMode"
          @click="handleDelete"
          type="button"
          class="flex-1 px-4 py-2 font-bold text-white transition bg-red-500 rounded hover:bg-red-600"
        >
          刪除活動
        </button>
      </div>
    </form>
  </div>
</template>

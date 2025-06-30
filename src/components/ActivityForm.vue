<script setup>
import { ref, watch, computed } from "vue";
import { useActivityStore } from "@/stores/activity.js";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user.js";
import { useToast } from "vue-toastification";
import AddressInput from "@/components/AddressInput.vue";
const userStore = useUserStore(); //抓username
const previewUrl = ref(""); // 圖片預覽網址
const fileInputRef = ref(null); // 綁定 input 元件
const store = useActivityStore();
const { selectedActivity } = storeToRefs(store);
const { fetchActivityById, updateActivity, createActivity, deleteActivity } =
  store;

const router = useRouter();
const route = useRoute();
const activityId = route.params.id;
const toast = useToast();
const isLoading = ref(false);

const isEditMode = computed(() => route.name === "activityEdit"); //computed
const formTitle = computed(() => (isEditMode.value ? "編輯活動" : "新增活動"));
const form = ref({
  title: "",
  location: "",
  date: "",
  time: "",
  description: "",
  createdBy: "",
  maxParticipants: "",
});

const today = new Date().toISOString().split("T")[0];
const imageFile = ref(null);

function resetForm() {
  form.value = {
    title: "",
    location: "",
    date: "",
    time: "",
    description: "",
    createdBy: "",
    maxParticipants: "",
  };
  imageFile.value = null;
  previewUrl.value = null;

  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
}

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
      try {
        await fetchActivityById(id);
        form.value = {
          title: selectedActivity.value?.title || "",
          imageInput: selectedActivity.value?.image_url || "",
          location: selectedActivity.value?.location || "",
          date: selectedActivity.value?.date?.slice(0, 10) || "",
          time: selectedActivity.value?.date?.slice(11, 16) || "",
          description: selectedActivity.value?.description || "",
          createdBy: selectedActivity.value?.createdBy || "",
          maxParticipants: selectedActivity.value?.max_participants || "",
        };
        // 如果有舊圖片就顯示，沒有就空字串
        if (selectedActivity.value?.image_url) {
          previewUrl.value = selectedActivity.value.image_url;
        } else {
          previewUrl.value = "";
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      form.value = {
        title: "",
        location: "",
        date: "",
        description: "",
        createdBy: "",
        maxParticipants: "",
      };
    }
  },
  { immediate: true }
);

async function handleSubmit() {
  const requiredFields = {
    title: "活動標題",
    location: "活動地點",
    date: "活動日期",
    time: "活動時間",
    description: "活動描述",
    maxParticipants: "人數上限",
  };

  const missingFields = [];

  for (const key in requiredFields) {
    if (!form.value[key]) {
      missingFields.push(requiredFields[key]);
    }
  }

  if (!imageFile.value && !isEditMode.value) {
  missingFields.push("活動圖片");
  }

  if (missingFields.length > 0) {
    toast.error(`請填寫以下欄位：${missingFields.join("、")}`);
    return;
  }

  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append("title", form.value.title);
    formData.append("location", form.value.location);
    formData.append("date", `${form.value.date}T${form.value.time}:00+08:00`);
    formData.append("description", form.value.description);
    formData.append("createdBy", form.value.createdBy);
    formData.append("maxParticipants", form.value.maxParticipants);
    if (imageFile.value) {
      formData.append("image", imageFile.value);} // 圖片也放進去
    if (isEditMode.value) {
      const id = parseInt(route.params.id);
      await updateActivity(id, formData); // 要用 FormData
      toast("活動已更新！");
      router.push("/activities/my");
    } else {
      await createActivity(formData); // 要用 FormData
      toast("活動已建立！");
      router.push("/activities/my");
    }

    resetForm();
  } catch (err) {
    toast.error(isEditMode.value ? "更新失敗" : "建立失敗");
  } finally {
    isLoading.value = false;
  }
}

async function handleDelete() {
  isLoading.value = true;
  try {
    const id = parseInt(route.params.id);
    await deleteActivity(id, form.value);
    toast("活動已刪除！");
    router.push("/activities/my");
  } catch (err) {
    toast.error("刪除失敗，請稍後再試");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-white/70"
  >
    <img src="@/assets/spinner.svg" alt="處理中..." class="w-16 h-16" />
  </div>
  <div
    class="min-h-screen px-4 py-10 sm:px-6 lg:px-8 bg-gradient-to-b from-[#8ecae6]/10 to-white"
  >
    <div
      class="max-w-xl p-8 mx-auto mt-6 shadow-lg bg-white/80 backdrop-blur-md rounded-2xl"
    >
      <div class="mb-6 text-lg text-darkblue">
        <label class="block mb-1 font-bold">主辦人：</label>
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
          class="object-cover w-full border border-gray-200 h-80 rounded-xl"
        />
      </div>

      <h2 class="mb-6 text-2xl font-bold text-center text-darkblue">
        {{ formTitle }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label for="title" class="block mb-1 text-lg font-bold text-darkblue"
            >活動標題：</label
          >
          <input
            id="title"
            v-model="form.title"
            placeholder="請輸入活動標題"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-primary"
          />
        </div>
        <div>
          <label for="image" class="block mb-1 text-lg font-bold text-darkblue"
            >活動圖片：</label
          >
          <input
            id="image"
            ref="fileInputRef"
            type="file"
            @change="handleFileChange"
            accept="image/*"
            class="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-full file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
          />
          <p v-if="isEditMode" class="mt-1 text-xs text-gray-500 text-">目前圖片為預覽圖片，如需修改請重新選擇</p>
        </div>
        <div>
          <label
            for="location"
            class="block mb-1 text-lg font-bold text-darkblue"
            >活動地點：</label
          >
          <AddressInput v-model="form.location" />
        </div>
        <div>
          <label for="date" class="block mb-1 text-lg font-bold text-darkblue">
            活動日期：
          </label>
          <input
            id="date"
            v-model="form.date"
            type="date"
            :min="today"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-primary"
          />
        </div>
        <div>
          <label for="time" class="block mb-1 text-lg font-bold text-darkblue">
            活動時間：
          </label>
          <input
            id="time"
            type="time"
            v-model="form.time"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-primary"
          />
        </div>
        <div>
          <label
            for="max-participants"
            class="block mb-1 text-lg font-bold text-darkblue"
            >活動人數上限：</label
          >
          <input
            id="max-participants"
            min="2"
            type="number"
            v-model.number="form.maxParticipants"
            placeholder="請輸入 2 人以上"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:text-secondary"
          />
        </div>
        <div>
          <label
            for="description"
            class="block mb-1 text-lg font-bold text-darkblue"
            >活動描述：</label
          >
          <textarea
            id="description"
            v-model="form.description"
            placeholder="請輸入活動描述"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-primary"
          ></textarea>
        </div>
        <div class="flex flex-col justify-center gap-4 pt-6 sm:flex-row">
          <button
            type="submit"
            class="w-full px-6 py-2 font-bold text-white transition border-2 rounded-full sm:w-auto bg-secondary hover:bg-white hover:text-secondary border-secondary"
          >
            {{ isEditMode ? "更新活動" : "建立活動" }}
          </button>
          <button
            v-if="isEditMode"
            @click="handleDelete"
            type="button"
            class="w-full px-6 py-2 font-bold text-white transition bg-red-400 border-2 border-red-400 rounded-full sm:w-auto hover:bg-white hover:text-red-400"
          >
            刪除活動
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

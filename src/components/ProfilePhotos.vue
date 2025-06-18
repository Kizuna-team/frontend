<!-- 照片邏輯 -->
<script setup>
import { ref, onMounted, defineExpose } from "vue";
import {
  getPhotos,
  uploadPhoto,
  deletePhoto,
  changeAvatar,
} from "@/api/photos";

// 在refreshPhotos() 裡正式建立 6 格
const photoList = ref([]);

const myAvatar = ref(null);
const showModal = ref(false);
const fileInputRef = ref(null);

const chooseAvatar = () => (showModal.value = true);
const closeModal = () => (showModal.value = false);

const triggerAvatarInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const refreshPhotos = async () => {
  try {
    const images = await getPhotos();

    // 清空資料
    myAvatar.value = null;
    photoList.value = Array(6)
      .fill()
      .map(() => ({
        file: null,
        preview: "",
        key: null,
      }));

    // 分類圖片
    let photoIndex = 0;
    images.forEach((item) => {
      if (item.is_avatar) {
        myAvatar.value = {
          preview: item.image_url,
          key: item.image_key,
        };
      } else if (photoIndex < photoList.value.length) {
        photoList.value[photoIndex].preview = item.image_url;
        photoList.value[photoIndex].key = item.image_key;
        photoIndex++;
      }
    });
  } catch (err) {
    console.error("載入圖片失敗", err);
  }
};

const handleAvatarUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    // 上傳圖片到 S3，取得 URL 和 key
    const data = await uploadPhoto(file); // 上傳API

    // 設為大頭貼
    await changeAvatar(data.key); // 換頭貼 API
    // 直接重抓所有圖片
    await refreshPhotos();

    // 關閉 modal 並提示
    closeModal();
    alert("大頭貼設定成功");
  } catch (err) {
    console.error("大頭貼上傳失敗", err);
    alert("大頭貼上傳失敗，請重試");
  } finally {
    e.target.value = ""; // 清空 input 讓使用者可重傳同一張
  }
};

// 更換照片檔案並產生預覽
const handleFileChange = (event, index) => {
  const file = event.target.files[0];
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);
  photoList.value[index].file = file;
  photoList.value[index].preview = previewUrl;
  event.target.value = "";
};

// 移除照片、大頭照標記
const removePhoto = async (index) => {
  const imageKey = photoList.value[index].key;

  // 如果照片還沒上傳過（沒有 key），直接清空資料
  if (!imageKey) {
    photoList.value[index].file = null;
    photoList.value[index].preview = "";
    return;
  }

  try {
    // 後端路由顯示方式這裡不可用完整網址，並傳編碼過的檔名
    await deletePhoto(encodeURIComponent(imageKey));
    photoList.value[index].file = null;
    photoList.value[index].preview = "";
    photoList.value[index].key = "";
    console.log(" 圖片刪除成功");
  } catch (err) {
    console.error(" 圖片刪除失敗", err);
  }
};

// 上傳後需要同步更新key
const uploadAll = async () => {
  const uploadPromises = [];
  const uploadedResults = [];

  photoList.value.forEach((item, index) => {
    if (item.file) {
      const uploadPromise = (async () => {
        try {
          const data = await uploadPhoto(item.file);

          const newPhoto = {
            file: null,
            preview: data.url,
            key: data.key,
          };

          photoList.value[index] = newPhoto;
          photoList.value = [...photoList.value];
          uploadedResults.push(newPhoto); // 收集成功結果
          console.log(`第 ${index + 1} 張上傳成功`, data);
        } catch (err) {
          console.error(`第 ${index + 1} 張上傳失敗`, err);
        }
      })();
      uploadPromises.push(uploadPromise);
    }
  });

  try {
    await Promise.all(uploadPromises);
    alert("所有已選圖片都已上傳完成");
    return uploadedResults;
  } catch (err) {
    console.error("上傳過程發生錯誤", err);
  }
};

// 讓外部元件可以呼叫 uploadAll，editProfileView.view 有呼叫
onMounted(refreshPhotos);
defineExpose({ uploadAll });
</script>

<template>
  <!-- 大頭照圓形區塊 -->
  <div class="flex flex-col items-center my-5">
    <h2 class="mb-6 text-2xl font-bold text-center text-darkblue">
      上傳大頭照
    </h2>

    <div
      class="relative flex items-center justify-center w-48 h-48 overflow-hidden bg-gray-100 border-8 border-white rounded-full shadow-xl cursor-pointer"
      @click="chooseAvatar"
    >
      <img
        v-if="myAvatar"
        :src="myAvatar.preview"
        class="object-cover w-full h-full"
      />
      <div
        v-else
        class="flex items-center justify-center w-full h-full text-gray-400"
      >
        尚未設定個人照片
      </div>
    </div>
  </div>

  <!-- 彈窗 -->
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="flex justify-center mb-6">
      <div
        class="relative flex flex-col items-center justify-center p-6 bg-white w-72 h-72 cursor-pointer rounded-[2rem] border border-transparent shadow-2xl bg-gradient-to-br from-white to-gray-50 ring-1 ring-gray-300 ring-opacity-40 hover:shadow-3xl transition-shadow duration-300"
        @click="triggerAvatarInput"
      >
        <!-- 右上角簡單的 ✕ 按鈕 -->
        <button
          @click.stop="closeModal"
          aria-label="Close modal"
          class="absolute text-2xl font-semibold text-gray-500 transition top-4 right-4 hover:text-gray-800"
        >
          ✕
        </button>

        <!-- 中央上傳icon (放大版) -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-24 h-24 mb-4 text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>

        <p class="font-medium text-gray-600 select-none">點擊上傳大頭貼</p>

        <!-- 隱藏檔案輸入 -->
        <input
          type="file"
          accept="image/*"
          ref="fileInputRef"
          class="hidden"
          @change="handleAvatarUpload"
        />
      </div>
    </div>
  </div>

  <!-- 照片上傳區 -->
  <h2 class="mb-6 text-2xl font-bold text-center text-darkblue">上傳生活照</h2>
  <div class="grid grid-cols-3 gap-4 pb-4">
    <div
      v-for="(img, index) in photoList"
      :key="index"
      class="relative flex items-center justify-center overflow-hidden border border-dashed cursor-pointer rounded-xl aspect-square"
    >
      <!-- 預覽照片 -->
      <input
        type="file"
        class="absolute inset-0 opacity-0 cursor-pointer"
        @change="handleFileChange($event, index)"
      />
      <img
        v-if="img.preview"
        :src="img.preview"
        :key="img.preview"
        class="object-cover w-full h-full"
      />

      <!-- 刪除按鈕 -->
      <button
        v-if="img.preview"
        @click.stop="removePhoto(index)"
        class="absolute flex items-center justify-center w-6 h-6 text-sm text-orange-500 bg-white border border-gray-300 rounded-full bottom-1 right-1 hover:[bg-orange-100]"
      >
        ✕
      </button>
      <span v-else class="text-2xl text-gray-400">+</span>
    </div>
  </div>
</template>

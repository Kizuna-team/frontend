<script setup>
import { reactive } from "vue";
const props = defineProps({
  formData: Object,
});
// 取出來用（讓你不用一直寫 props.formData）
const formData = props.formData;

// const formData = reactive({
//   name: "",
//   gender: "",
//   bio: "",
//   orientation: "",
//   age: null,
//   location: "",
// });

// label 顯示給使用者，value 送後端或存資料庫
const genderOptions = [
  { label: "我是男生", value: "male" },
  { label: "我是女生", value: "female" },
  { label: "泛性戀", value: "both" },
];
const orientationOptions = [
  { label: "我想找男生", value: "findMale" },
  { label: "我想找女生", value: "findFemale" },
  { label: "我都可以", value: "findBoth" },
];
</script>

<template>
  <!-- 標題 -->
  <h2 class="text-2xl font-bold text-center mb-3 text-[#1c3b5a]">
    編輯個人資料
  </h2>
  <!-- 姓名 -->
  <div class="mb-4">
    <label class="font-bold block text-[#1c3b5a] mb-1">暱稱</label>
    <input
      type="text"
      v-model="formData.name"
      class="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      placeholder="請輸入暱稱"
    />
  </div>
  <!-- 性別 -->
  <div class="mb-4">
    <label class="font-bold block text-[#1c3b5a] mb-1">性別</label>
    <div v-for="option in genderOptions" :key="option.value" class="mb-2">
      <input
        type="radio"
        :value="option.value"
        name="gender"
        v-model="formData.gender"
        :id="option.value"
        class="mx-2 border border-blue-200 rounded-lg focus:outline-none"
      />
      <label :for="option.value">{{ option.label }}</label>
    </div>
  </div>

  <!-- 性取向 -->
  <div class="mb-4">
    <label class="font-bold block text-[#1c3b5a] mb-1">性取向</label>
    <div v-for="option in orientationOptions" :key="option.value" class="mb-2">
      <input
        type="radio"
        :value="option.value"
        name="orientation"
        v-model="formData.orientation"
        :id="option.value"
        class="mx-2 border border-blue-200 rounded-lg focus:outline-none"
      />
      <label :for="option.value">{{ option.label }}</label>
    </div>
  </div>

  <!-- 自我介紹 -->
  <div class="mb-4">
    <label class="font-bold block text-[#1c3b5a] mb-1">自我介紹</label>
    <textarea
      v-model="formData.bio"
      class="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      rows="3"
      placeholder="寫一些關於你..."
    ></textarea>
  </div>
  <!-- 年齡 注意 number 可變空字串-->
  <div class="mb-4">
    <label class="font-bold block text-[#1c3b5a] mb-1">年齡</label>
    <input
      type="number"
      v-model.number="formData.age"
      class="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      placeholder="請輸入年紀"
      min="18"
      max="99"
    />
  </div>
  <!-- 居住地 補disabled-->
  <div class="mb-6">
    <label class="font-bold block text-[#1c3b5a] mb-1">居住地</label>
    <select
      v-model="formData.location"
      class="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      <option disabled value="">請選擇地區</option>
      <option value="taipei">台北市</option>
      <option value="taoyuan">桃園市</option>
      <option value="taichung">台中市</option>
      <option value="tainan">台南市</option>
      <option value="other">其他</option>
    </select>
  </div>
</template>

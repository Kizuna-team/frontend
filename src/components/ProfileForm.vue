<!-- 按儲存 tempFormData 的內容覆蓋回 Store -->
<!-- 顯示表單、處理輸入資料，不接觸 API -->
<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(["update:modelValue"]);

// 避免直接修改props
const tempFormData = ref({ ...props.modelValue });

// props 更新 就 自動更新暫存資料
// 初始化時也會執行一次
watch(
  () => props.modelValue,
  (newVal) => {
    tempFormData.value = { ...(newVal || {}) };
  },
  { deep: true, immediate: true }
);

// 表單暫存資料改變 emit 父元件同步資料
watch(
  tempFormData,
  (newVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(props.modelValue)) {
      emit("update:modelValue", newVal);
    }
  },
  { deep: true }
);
// label 顯示給使用者，value 送後端或存資料庫
const genderOptions = [
  { label: "我是男生", value: "male" },
  { label: "我是女生", value: "female" },
  { label: "我不確定", value: "both" },
];
const orientationOptions = [
  { label: "異性戀", value: 0 },
  { label: "同性戀", value: 1 },
  { label: "雙性戀", value: 2 },
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
      v-model="tempFormData.name"
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
        v-model="tempFormData.gender"
        :id="option.value"
        class="mx-2 border border-blue-200 rounded-lg focus:outline-none"
      />
      <label :for="option.value" class="text-darkblue">{{
        option.label
      }}</label>
    </div>
  </div>

  <!-- 性取向 -->
  <div class="mb-4">
    <label class="block mb-1 font-bold text-darkblue">性取向</label>
    <div v-for="option in orientationOptions" :key="option.value" class="mb-2">
      <input
        type="radio"
        :value="option.value"
        name="orientation"
        v-model="tempFormData.orientation"
        :id="option.value"
        class="mx-2 ml-2 font-medium border border-blue-200 rounded-lg focus:outline-none text-darkblue"
      />
      <label :for="option.value" class="text-darkblue">
        {{ option.label }}
      </label>
    </div>
  </div>

  <!-- 自我介紹 -->
  <div class="mb-4">
    <label class="font-bold block text-[#1c3b5a] mb-1">自我介紹</label>
    <textarea
      v-model="tempFormData.bio"
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
      v-model.number="tempFormData.age"
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
      v-model="tempFormData.location"
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

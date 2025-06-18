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
  <div class="space-y-6">
    <!-- 暱稱 -->
    <div class="form-card">
      <label class="form-label">🖋️ 暱稱</label>
      <input
        type="text"
        v-model="tempFormData.name"
        class="form-input"
        placeholder="輸入你的暱稱吧"
      />
    </div>

    <!-- 性別 -->
    <div class="form-card">
      <label class="form-label">⚧ 性別</label>
      <div class="flex gap-4">
        <label
          v-for="opt in genderOptions"
          :key="opt.value"
          class="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            :value="opt.value"
            v-model="tempFormData.gender"
            name="gender"
            class="form-radio"
          />
          <span>{{ opt.label }}</span>
        </label>
      </div>
    </div>

    <!-- 性取向 -->
    <div class="form-card">
      <label class="form-label">🏳️‍🌈 性取向</label>
      <div class="flex gap-4">
        <label
          v-for="opt in orientationOptions"
          :key="opt.value"
          class="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            :value="opt.value"
            v-model="tempFormData.orientation"
            name="orientation"
            class="form-radio"
          />
          <span>{{ opt.label }}</span>
        </label>
      </div>
    </div>

    <!-- 自我介紹 -->
    <div class="form-card">
      <label class="form-label">💬 自我介紹</label>
      <textarea
        v-model="tempFormData.bio"
        rows="4"
        placeholder="寫一些關於你..."
        class="resize-none form-input"
      ></textarea>
    </div>

    <!-- 年齡 & 居住地 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="form-card">
        <label class="form-label">🎂 年齡</label>
        <input
          type="number"
          v-model.number="tempFormData.age"
          class="form-input"
          placeholder="18~99"
          min="18"
          max="99"
        />
      </div>
      <div class="form-card">
        <label class="form-label">📍 居住地</label>
        <select v-model="tempFormData.location" class="form-input">
          <option disabled value="">選擇地區</option>
          <option value="taipei">台北市</option>
          <option value="taoyuan">桃園市</option>
          <option value="taichung">台中市</option>
          <option value="tainan">台南市</option>
          <option value="other">其他</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-card {
  @apply bg-white p-4 rounded-2xl border border-primary/10 shadow-sm;
}
.form-label {
  @apply block text-base font-bold text-darkblue mb-2;
}
.form-input {
  @apply w-full px-4 py-2 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition;
}
.form-radio {
  @apply accent-secondary w-5 h-5;
}
</style>

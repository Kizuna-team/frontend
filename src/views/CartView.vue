<script setup>
import { ref, reactive, computed } from "vue";
import { useCartStore } from "../stores/cart.js";
import sendOrder from "@/utils/order.js";
import { onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useFriendStore } from "@/stores/friend";

import axios from "@/api/axios";
const cartStore = useCartStore();
const userStore = useUserStore();
const friendStore = useFriendStore();

const friendOptions = computed(() => [
  { value: "", label: "請選擇收件人" },
  ...friendStore.friendList.map((f) => ({
    value: f.friend_id,
    label: f.friend_name,
  })),
]);

// 響應式數據
const currentStep = ref(0);
const isCompleted = ref(false);

// 表單數據
const formData = reactive({
  receiverId: "",
  orderDate: "",
  message: "",
  paymentMethod: "",
});

// 步驟配置
const steps = [
  {
    title: "確認訂購內容",
    isCartStep: true,
  },
  {
    title: "選擇送禮對象",
    fields: [
      {
        name: "receiverId",
        label: "選擇送禮對象",
        type: "select",
        options: friendOptions.value,
      },
    ],
  },
  {
    title: "我想對你說",
    fields: [{ label: "祝福留言", name: "message", type: "textarea" }],
  },
  {
    title: "選擇付款方式",
    fields: [
      {
        name: "paymentMethod",
        label: "選擇付款方式",
        type: "select",
        options: [
          { value: "", label: "選擇付款方式" },
          { value: "LINEPAY", label: "LINEPAY" },
          { value: "PAYPAL", label: "PAYPAL" },
        ],
      },
    ],
  },
];

// 計算屬性 - 使用 cartStore 的資料
const totalPrice = computed(() => {
  return cartStore.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
});

const totalQuantity = computed(() => {
  return cartStore.cartItems.reduce((sum, item) => sum + item.quantity, 0);
});

const progressPercentage = computed(() => {
  return (currentStep.value / (steps.length - 1)) * 100;
});

// 方法 - 使用 cartStore 的方法
const updateQuantity = (id, newQuantity) => {
  if (newQuantity < 1) return;
  cartStore.updateQuantity(id, newQuantity);
};

const removeItem = (id) => {
  cartStore.removeFromCart(id);
};

const isValidStep = () => {
  // 第一步是購物車檢視，只要有商品就算有效
  if (currentStep.value === 0) {
    return cartStore.cartItems.length > 0;
  }

  const stepFields = steps[currentStep.value].fields;
  if (!stepFields) return true;

  return stepFields.every((field) => {
    // 如果是條件欄位，檢查是否需要驗證
    if (field.conditional && formData.paymentMethod !== field.conditional) {
      return true; // 不需要驗證條件欄位
    }
    return formData[field.name];
  });
};

const nextStep = () => {
  if (!isValidStep()) {
    if (currentStep.value === 0) {
      alert("購物車不能為空");
    } else {
      alert("請填寫所有必填欄位");
    }
    return;
  }
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleSubmit = async () => {
  if (!isValidStep()) {
    alert("請填寫所有必填欄位");
    return;
  }
  // 組成訂單資料
  // LINEPAY
  if (formData.paymentMethod === "LINEPAY") {
    try {
      await sendOrder(cartStore.cartItems); //  送訂單 + 跳轉
    } catch (err) {
      alert("訂單建立失敗，請稍後再試");
    }
    // PAYPAL
  } else if (formData.paymentMethod === "PAYPAL") {
    try {
      const items = cartStore.cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      console.log("發送到 PayPal API:", items);

      const res = await axios.post("/paypal/create-order", {
        sender_id: 2,
        receiver_id: 10,
        items: items,
      });

      console.log("PayPal API 回應:", res.data);

      if (res.data.success && res.data.approveUrl) {
        window.location.href = res.data.approveUrl;
      } else {
        alert("PayPal 訂單建立失敗");
      }
    } catch (err) {
      console.error("PayPal 錯誤:", err);
      alert("PayPal 付款失敗，請稍後再試");
    }
  } else {
    // 處理其他付款方式
    const orderData = {
      ...formData,
      items: cartStore.cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
      })),
      totalPrice: totalPrice.value,
      totalQuantity: totalQuantity.value,
    };
    console.log("訂單資料:", orderData);
    isCompleted.value = true;
  }
};

const getStepTitle = (title) => {
  switch (title) {
    case "Recipient":
      return "選擇收件人";
    case "Message":
      return "撰寫祝福留言";
    case "Payment":
      return "確認付款方式";
    default:
      return title;
  }
};
onMounted(() => {
  if (userStore.userId) {
    friendStore.fetchFriendList(userStore.userId);
  }
});
</script>
<template>
  <div class="min-h-[60vh] flex justify-center">
    <!-- 完成狀態 -->
    <div
      v-if="isCompleted"
      class="w-full max-w-md p-8 text-center bg-white shadow-2xl rounded-2xl"
    >
      <div class="mb-6">
        <svg
          class="w-20 h-20 mx-auto mb-4 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h3 class="mb-2 text-2xl font-bold text-gray-800">訂購成功！</h3>
        <p class="text-gray-600">您的訂單已成功建立，我們將盡快為您處理。</p>
      </div>
    </div>

    <!-- 表單主體 -->
    <div
      v-else
      class="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl min-h-[70vh] w-full"
    >
      <h1 class="mb-8 text-3xl font-bold text-center text-gray-800">
        訂購流程
      </h1>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="relative">
          <div
            class="absolute top-5 left-0 w-full h-0.5 bg-gray-200 rounded-full"
          ></div>
          <div
            class="absolute top-5 left-0 h-0.5 rounded-full transition-all duration-500 ease-in-out"
            style="background: linear-gradient(to right, #8ecae6, #e07600)"
            :style="{ width: progressPercentage + '%' }"
          ></div>
          <ol class="relative z-10 flex justify-between">
            <li
              v-for="(step, index) in steps"
              :key="index"
              class="flex flex-col items-center"
            >
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  currentStep > index
                    ? 'text-white shadow-lg'
                    : currentStep === index
                    ? 'bg-white border-4 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500',
                ]"
                :style="
                  currentStep > index
                    ? 'background: linear-gradient(to right, #fb8500, #e07600)'
                    : currentStep === index
                    ? 'border-color: #ffb703; color: #ffb703'
                    : ''
                "
              >
                <svg
                  v-if="currentStep > index"
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span
                :class="[
                  'mt-2 text-xs font-medium',
                  currentStep >= index ? '' : 'text-gray-400',
                ]"
                :style="currentStep >= index ? 'color: #ffb703' : ''"
              >
                {{ step.title }}
              </span>
            </li>
          </ol>
        </div>
      </div>

      <!-- Form Steps -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="relative overflow-hidden">
          <div
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentStep * 100}%)` }"
          >
            <!-- 購物車步驟 -->
            <div v-if="currentStep === 0" class="flex-shrink-0 w-full px-4">
              <h3
                class="flex items-center justify-center mb-6 text-xl font-semibold text-center text-gray-800"
              >
                目前購物車內容
              </h3>

              <div
                v-if="cartStore.cartItems.length === 0"
                class="min-h-[30vh] text-center py-12"
              >
                <p class="text-lg text-gray-500">購物車是空的</p>
                <p class="text-sm text-gray-400">請先添加商品到購物車</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="item in cartStore.cartItems"
                  :key="item.id"
                  class="p-4 transition-shadow duration-300 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
                >
                  <div class="flex items-center space-x-4">
                    <img
                      :src="item.img"
                      :alt="item.name"
                      class="object-cover w-20 h-20 rounded-lg"
                    />
                    <div class="flex-1">
                      <h4 class="text-lg font-semibold text-gray-800">
                        {{ item.name }}
                      </h4>
                      <p class="mt-1 text-sm text-gray-600">
                        {{ item.description }}
                      </p>
                      <div class="flex items-center justify-between mt-3">
                        <div class="flex items-center space-x-3">
                          <span class="text-lg font-bold text-accent"
                            >NT$ {{ item.price.toLocaleString() }}</span
                          >
                        </div>
                        <div class="flex items-center space-x-3">
                          <button
                            type="button"
                            @click="updateQuantity(item.id, item.quantity - 1)"
                            class="flex items-center justify-center w-8 h-8 transition-colors bg-gray-100 rounded-full hover:bg-gray-200"
                          >
                            <svg
                              class="w-4 h-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M20 12H4"
                              ></path>
                            </svg>
                          </button>
                          <span class="w-8 font-medium text-center">{{
                            item.quantity
                          }}</span>
                          <button
                            type="button"
                            @click="updateQuantity(item.id, item.quantity + 1)"
                            class="flex items-center justify-center w-8 h-8 transition-colors bg-gray-100 rounded-full hover:bg-gray-200"
                          >
                            <svg
                              class="w-4 h-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              ></path>
                            </svg>
                          </button>
                          <button
                            type="button"
                            @click="removeItem(item.id)"
                            class="flex items-center justify-center w-8 h-8 ml-2 transition-colors bg-red-100 rounded-full hover:bg-red-200"
                          >
                            <svg
                              class="w-4 h-4 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div class="mt-2 text-right">
                        <span class="text-sm text-gray-500">小計: </span>
                        <span class="font-bold text-gray-800"
                          >NT$
                          {{
                            (item.price * item.quantity).toLocaleString()
                          }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 總計區域 -->
                <div
                  class="p-6 mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-600">商品總數:</span>
                    <span class="font-medium">{{ totalQuantity }} 件</span>
                  </div>
                  <div
                    class="flex items-center justify-between text-xl font-bold text-darkblue"
                  >
                    <span>總計:</span>
                    <span>NT$ {{ totalPrice.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 其他表單步驟 -->
            <div
              v-for="(step, stepIndex) in steps"
              :key="stepIndex"
              class="flex-shrink-0 w-full px-4"
            >
              <div v-if="currentStep === stepIndex && stepIndex > 0">
                <h3
                  class="mb-6 text-xl font-semibold text-center text-gray-800"
                >
                  {{ getStepTitle(step.title) }}
                </h3>
                <div class="space-y-4">
                  <div
                    v-for="field in step.fields"
                    :key="field.name"
                    class="space-y-2"
                  >
                    <!-- 如果是條件欄位且條件不符合，則不顯示 -->
                    <template
                      v-if="
                        !field.conditional ||
                        formData.paymentMethod === field.conditional
                      "
                    >
                      <label
                        :for="field.name"
                        class="block text-sm font-medium text-gray-700"
                      >
                        {{ field.label }}
                        <span v-if="!field.conditional"> *</span>
                      </label>

                      <!-- Textarea -->
                      <textarea
                        v-if="field.type === 'textarea'"
                        :id="field.name"
                        :name="field.name"
                        v-model="formData[field.name]"
                        rows="4"
                        class="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        :placeholder="
                          field.name === 'message'
                            ? '請寫下您的祝福留言...'
                            : `請輸入${field.label}`
                        "
                        :required="!field.conditional"
                      />

                      <!-- Select -->
                      <select
                        v-else-if="field.type === 'select'"
                        :id="field.name"
                        :name="field.name"
                        v-model="formData[field.name]"
                        class="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option
                          v-for="option in field.options"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>

                      <!-- Input -->
                      <input
                        v-else
                        :type="field.type"
                        :id="field.name"
                        :name="field.name"
                        v-model="formData[field.name]"
                        :min="field.type === 'number' ? '1' : undefined"
                        class="w-full px-4 py-3 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        :placeholder="getPlaceholder(field.name, field.label)"
                        :required="
                          !field.conditional ||
                          (field.conditional &&
                            formData.paymentMethod === field.conditional)
                        "
                      />
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-between pt-12">
          <button
            type="button"
            @click="prevStep"
            :class="[
              'flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300',
              currentStep === 0
                ? 'invisible'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md transform hover:scale-105',
            ]"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            上一步
          </button>

          <button
            v-if="currentStep < steps.length - 1"
            type="button"
            @click="nextStep"
            class="flex items-center px-6 py-3 font-medium text-white transition-all duration-300 transform rounded-lg bg-gradient-to-r from-accent to-pink-400 hover:from-accent hover:to-pink-700 hover:scale-105 hover:shadow-lg"
          >
            下一步
            <svg
              class="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>

          <button
            v-else
            type="submit"
            class="px-8 py-3 font-medium text-white transition-all duration-300 transform rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105 hover:shadow-lg"
          >
            確認訂購
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

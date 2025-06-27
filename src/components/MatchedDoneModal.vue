<script setup>
import { useRouter } from "vue-router";
import { useSendFriendMsg } from "@/api/useMatches.js";

const router = useRouter();
const { sendFriendMsg } = useSendFriendMsg();

const props = defineProps({
  myProfile: Object,
  targetProfile: Object,
});

const emit = defineEmits(["cancel", "go-chat"]);

const onCancelClick = () => {
  emit("cancel");
};

const goToChatRoom = async () => {
  try {
    await sendFriendMsg(props.targetProfile.userId);

    router.push("/chat");
  } catch (err) {
    console.error("建立好友關係失敗", err);
    alert("無法進入聊天室，請稍後再試");
  }
};
</script>

<template>
  <div
    class="w-full px-6 py-8 rounded-md bg-[#f5f5f5] backdrop-blur-2xl shadow-inner shadow-gray-400/30"
  >
    <div
      class="relative max-w-2xl p-12 mx-auto shadow-2xl rounded-2xl ring-1 ring-white/30 bg-[#ffd] backdrop-blur-md"
    >
      <button
        class="absolute text-xl text-gray-500 top-4 right-6 hover:text-gray-700"
        title="關閉"
        @click="onCancelClick"
      >
        X
      </button>

      <div class="flex justify-center gap-10 pb-4 border-b border-white/50">
        <div
          class="flex flex-col items-center px-3 pt-3 pb-4 bg-white rounded-md shadow-lg w-60"
        >
          <div class="w-full bg-gray-200 rounded-sm h-44">
            <img
              class="object-contain object-center w-full h-full"
              :src="props.myProfile.avatarUrl"
              alt="My Avatar"
            />
          </div>
          <span class="mt-4 text-xl font-bold text-darkblue">{{
            props.myProfile?.name
          }}</span>
        </div>
        <div
          class="flex flex-col items-center px-3 pt-3 pb-4 bg-white rounded-md shadow-lg w-60"
        >
          <div class="w-full bg-gray-200 rounded-sm h-44">
            <img
              class="object-contain object-center w-full h-full"
              :src="props.targetProfile.avatarUrl"
              alt="Target Avatar"
            />
          </div>
          <span class="mt-4 text-xl font-bold text-darkblue">{{
            props.targetProfile?.name
          }}</span>
        </div>
      </div>

      <div class="pt-4">
        <div
          class="flex items-center justify-center gap-3 px-4 py-3 border shadow-inner bg-white/50 backdrop-blur-sm border-white/40 rounded-xl"
        >
          <span class="text-lg font-medium text-darkblue"
            >點擊按鈕進入聊天室</span
          >

          <button
            title="進入聊天室"
            class="transition text-darkblue hover:text-accent"
            @click="goToChatRoom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="rotate-45 w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

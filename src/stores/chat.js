import { defineStore } from "pinia";

export const userChatStore = defineStore("chat",{
    state:()=>({
        messages:[],
    }),
    actions:{
        // 單獨加入訊息( 傳訊息按送出時使用 )
        addMessage(msg){
            // 現在是誰在發送訊息
            console.log(msg.sender_id);
            this.messages.push(msg.content);
        },
        // 聊天室初始化( 批量更新聊天訊息 )、切換聊天室時清空或重設訊息列表
        setMessage(msgs){
            this.messages = msgs;
        }
    }
});
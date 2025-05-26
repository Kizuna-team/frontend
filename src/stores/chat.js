import {defineStore} from "pinia";

export const userChatStore = defineStore("chat",{
    state:()=>({
        messages:[],
    }),
    actions:{
        // 單獨加入訊息( 傳訊息按送出時使用 )
        addMessage(msg){
            this.messages.push(msg);
        },
        // 聊天室初始化( 批量更新聊天訊息 )、切換聊天室時清空或重設訊息列表
        setMessage(msgs){
            this.messages = msgs;
        }
    }
});
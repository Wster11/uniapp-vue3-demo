import { defineStore } from "pinia";
import { useConnStore } from "./conn";
import { useConversationStore } from "./conversation";
import { useMessageStore } from "./message";
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import { ref } from "vue";

export const useChatStore = defineStore("chat", () => {
  const { getChatConn } = useConnStore();
  const { getConversationById, deleteConversation } = useConversationStore();
  const { insertMessage } = useMessageStore();
  const conn = getChatConn();
  const isInitEvent = ref(false);

  /** 登录参数类型 */
  type LoginParams = Parameters<typeof conn.open>[0];

  const login = (p: LoginParams) => {
    return conn.open(p);
  };

  const initSDKEvent = () => {
    if (isInitEvent.value) return;
    isInitEvent.value = true;
    conn.addEventHandler("STORE_MULTI_DEIVCE", {
      onMultiDeviceEvent: (e) => {
        if (e.operation === "deleteConversation") {
          let conv = getConversationById(e.conversationId);
          if (conv) {
            deleteConversation(conv);
          }
        }
      }
    });

    conn.addEventHandler("STORE_MESSAGE", {
      onTextMessage: (msg) => {
        insertMessage(msg);
      }
    });
  };

  // 初始化SDK事件
  initSDKEvent();

  return {
    conn,
    login,
    getChatConn
  };
});

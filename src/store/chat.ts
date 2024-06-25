import { defineStore } from "pinia";
import { useConnStore } from "./conn";
import { useConversationStore } from "./conversation";
import { useMessageStore } from "./message";
import { useContactStore } from "./contact";
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import type { ContactNotice } from "@/types/index";
import { ref } from "vue";

export const useChatStore = defineStore("chat", () => {
  const { getChatConn } = useConnStore();
  const { getConversationById, deleteConversation } = useConversationStore();
  const { onMessage } = useMessageStore();
  const { addContactNotice, addStoreContact } = useContactStore();
  const conn = getChatConn();
  const isInitEvent = ref(false);

  /** 登录参数类型 */
  type LoginParams = Parameters<typeof conn.open>[0];

  const login = (p: LoginParams) => {
    return conn.open(p);
  };

  const close = () => {
    return conn.close();
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
        onMessage(msg);
      },
      onImageMessage: (msg) => {
        onMessage(msg);
      },
      onVideoMessage: (msg) => {
        onMessage(msg);
      }
    });

    conn.addEventHandler("STORE_CONNECTION_STATE", {
      onConnected: () => {
        uni.showToast({
          icon: "none",
          title: "onConnected"
        });
      },
      onDisconnected: () => {
        uni.showToast({
          icon: "none",
          title: "onDisconnected"
        });
      },
      //@ts-ignore
      onReconnecting: () => {
        uni.showToast({
          icon: "none",
          title: "onReconnecting"
        });
      },
      onOnline: () => {
        uni.showToast({
          icon: "none",
          title: "onOnline"
        });
      },
      onOffline: () => {
        uni.showToast({
          icon: "none",
          title: "onOffline"
        });
      }
    });

    conn.addEventHandler("STORE_CONTACT", {
      onContactInvited: (msg) => {
        const notice: ContactNotice = {
          ...msg,
          ext: "invited",
          time: new Date().getTime()
        };
        addContactNotice(notice);
      },
      onContactAgreed: (msg) => {
        const notice: ContactNotice = {
          ...msg,
          ext: "agreed",
          time: new Date().getTime()
        };
        addContactNotice(notice);
      },
      onContactRefuse: (msg) => {
        const notice: ContactNotice = {
          ...msg,
          ext: "refused",
          time: new Date().getTime()
        };
        addContactNotice(notice);
      },
      onContactDeleted: (msg) => {
        const notice: ContactNotice = {
          ...msg,
          ext: "deleted",
          time: new Date().getTime()
        };
        addContactNotice(notice);
      },
      onContactAdded: (msg) => {
        const notice: ContactNotice = {
          ...msg,
          ext: "added",
          time: new Date().getTime()
        };
        addStoreContact({
          userId: msg.from,
          remark: ""
        });
        addContactNotice(notice);
      }
    });
  };

  // 初始化SDK事件
  initSDKEvent();

  return {
    conn,
    login,
    close,
    getChatConn
  };
});

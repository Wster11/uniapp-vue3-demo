import { defineStore } from "pinia";
import { useConnStore } from "./conn";
import { useConversationStore } from "./conversation";
import { useMessageStore } from "./message";
import { useContactStore } from "./contact";
import { useGroupStore } from "./group";
import { useBlockStore } from "./block";
import { useAppUserStore } from "./appUser";
import type { ContactNotice } from "@/types/index";
import { ref } from "vue";

export const useChatStore = defineStore("chat", () => {
  const { getChatConn } = useConnStore();
  const {
    getConversationById,
    deleteConversation,
    getConversationList,
    clear: clearConversation
  } = useConversationStore();
  const { onMessage, clear: clearMessage } = useMessageStore();
  const {
    addContactNotice,
    addStoreContact,
    getContacts,
    clear: clearContacts
  } = useContactStore();
  const {
    getJoinedGroupList,
    clear: clearGroup,
    addGroupNotice,
    getGroupInfo,
    setJoinedGroupList,
    removeStoreGroup
  } = useGroupStore();
  const { getBlockList, clear: clearBlock } = useBlockStore();
  const conn = getChatConn();
  const { getUsersInfo, clear: clearAppUser } = useAppUserStore();
  const isInitEvent = ref(false);

  /** 登录参数类型 */
  type LoginParams = Parameters<typeof conn.open>[0];

  /** 登录IM */
  const login = (p: LoginParams) => {
    return conn.open(p).then((res) => {
      getConversationList();
      getContacts();
      getJoinedGroupList();
      getBlockList();
      getUsersInfo({
        userIdList: [p.user]
      });
      return res;
    });
  };

  /** 清除Store */
  const clearStore = () => {
    clearConversation();
    clearMessage();
    clearContacts();
    clearGroup();
    clearBlock();
    clearAppUser();
  };

  /** 关闭IM连接 */
  const close = () => {
    clearStore();
    return conn.close();
  };

  const initSDKEvent = () => {
    if (isInitEvent.value) return;
    isInitEvent.value = true;
    /** 多端同步事件 */
    conn.addEventHandler("STORE_MULTI_DEVICE", {
      onMultiDeviceEvent: (e) => {
        if (e.operation === "deleteConversation") {
          let conv = getConversationById(e.conversationId);
          if (conv) {
            deleteConversation(conv);
          }
        }
      }
    });

    /** 消息事件 */
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

    /** 连接状态事件 */
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

    /** 联系人事件 */
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
        addStoreContact({
          userId: msg.from,
          remark: ""
        });
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
    /** 群组事件 */
    conn.addEventHandler("STORE_GROUP", {
      onGroupEvent: async (event) => {
        switch (event.operation) {
          case "directJoined":
          case "create":
          case "acceptRequest":
            let res = await getGroupInfo(event.id);
            const info = res.data?.[0];
            if (info) {
              setJoinedGroupList([
                {
                  groupId: info.id,
                  groupName: info.name,
                  public: info.public,
                  description: info.description,
                  disabled: true,
                  allowInvites: info.allowinvites,
                  maxUsers: info.maxusers,
                  approval: info.membersonly
                }
              ]);
            }
            break;
          case "removeMember":
          case "destroy":
            removeStoreGroup(event.id);
          default:
            break;
        }
        addGroupNotice({
          ...event,
          time: new Date().getTime()
        });
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

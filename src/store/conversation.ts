import { defineStore } from "pinia";
import { useConnStore } from "./conn";
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import { ref } from "vue";

export const useConversationStore = defineStore("conversation", () => {
  const { getChatConn, getChatSDK } = useConnStore();

  const conn = getChatConn();

  const SDK = getChatSDK();

  type GetConversationsParams = Parameters<
    typeof conn.getServerConversations
  >[0];

  const conversationParams = ref<GetConversationsParams>({
    pageSize: 50,
    cursor: ""
  });

  const conversationList = ref<EasemobChat.ConversationItem[]>([]);

  const setConversation = (conversations: EasemobChat.ConversationItem[]) => {
    if (!Array.isArray(conversations)) {
      return console.error("Invalid parameter: conversations");
    }

    let currentCvsId = conversationList.value.map(
      (item) => item.conversationId
    );
    let filteredConversations = conversations.filter(
      ({ conversationId }) => !currentCvsId.find((id) => id === conversationId)
    );

    filteredConversations.forEach((conversationItem) => {
      conversationList.value.push(conversationItem);
    });
  };

  const setConversationParams = (p: GetConversationsParams) => {
    conversationParams.value.cursor = p.cursor;
    conversationParams.value.pageSize = p.pageSize;
  };

  const getConversationList = () => {
    return conn.getServerConversations(conversationParams.value).then((res) => {
      setConversation(res.data?.conversations || []);
      conversationParams.value.cursor = res.data?.cursor;
      return res;
    });
  };

  const deleteStoreConversation = (
    conversation: EasemobChat.ConversationItem
  ) => {
    const idx = conversationList.value.findIndex((cvs) => {
      return (
        cvs.conversationType == conversation.conversationType &&
        cvs.conversationId == conversation.conversationId
      );
    });
    if (idx > -1) {
      conversationList.value.splice(idx, 1);
    }
  };

  /** 删除会话*/
  const deleteConversation = async (
    conversation: EasemobChat.ConversationItem,
    deleteMessage?: boolean
  ) => {
    if (typeof conversation != "object") {
      return console.error("Invalid parameter: conversation");
    }
    await conn.deleteConversation({
      channel: conversation.conversationId,
      chatType: conversation.conversationType,
      deleteRoam: deleteMessage || false
    });
    deleteStoreConversation(conversation);
  };

  /** 根据会话ID和会话类型获取会话 */
  const getConversationById = (
    conversationId: string
  ): EasemobChat.ConversationItem | undefined => {
    const conv = conversationList.value.find((item) => {
      return item.conversationId === conversationId;
    });
    if (conv) {
      return conv;
    }
    return undefined;
  };

  /** 获取会话时间 */
  const getConversationTime = (
    message: EasemobChat.ConversationItem["lastMessage"]
  ) => {
    if (!message) {
      return "";
    }
    //@ts-ignore
    const time = message.time;
    if (!time) return "";
    const localTimeList = new Date().toString().split(" ");
    const MsgTimeList = new Date(time).toString().split(" ");
    if (localTimeList[3] === MsgTimeList[3]) {
      if (localTimeList[1] === MsgTimeList[1]) {
        if (localTimeList[0] === MsgTimeList[0]) {
          if (localTimeList[2] === MsgTimeList[2]) {
            return MsgTimeList[4].substr(0, 5);
          }
        } else {
          if (Number(localTimeList[0]) - Number(MsgTimeList[0]) === 1) {
            return "Yday";
          } else {
            return MsgTimeList[0];
          }
        }
      } else {
        return MsgTimeList[1];
      }
    } else {
      return MsgTimeList[1];
    }
  };

  /** 标记会话已读 */
  const markConversationRead = async (
    conversation: EasemobChat.ConversationItem
  ) => {
    const msg = SDK.message.create({
      type: "channel",
      chatType: conversation.conversationType,
      to: conversation.conversationId
    });
    await conn.send(msg);
    const conv = getConversationById(conversation.conversationId);
    if (conv) {
      conv.unReadCount = 0;
    }
  };
  return {
    conversationList,
    conversationParams,
    setConversationParams,
    getConversationList,
    deleteConversation,
    getConversationById,
    getConversationTime,
    markConversationRead
  };
});

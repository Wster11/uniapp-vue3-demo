import { defineStore } from "pinia";
import { useConnStore } from "./conn";
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import { ref } from "vue";

export const useConversationStore = defineStore("conversation", () => {
  const { getChatConn } = useConnStore();

  const conn = getChatConn();

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

  /** 获取消息时间 */
  const getConversationLastMessageTime = (
    message: EasemobChat.ConversationItem["lastMessage"]
  ) => {
    if (!message) {
      return "";
    }
    //@ts-ignore
    const time = new Date(message.time);
    const lastMessageTime = `${time.toLocaleTimeString()} `;
    return lastMessageTime;
  };

  return {
    conversationList,
    conversationParams,
    setConversationParams,
    getConversationList,
    deleteConversation,
    getConversationById,
    getConversationLastMessageTime
  };
});

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
    pageSize: 20,
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

  return {
    conversationList,
    conversationParams,
    setConversationParams,
    getConversationList
  };
});

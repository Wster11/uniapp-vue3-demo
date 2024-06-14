import { defineStore } from "pinia";
import { useConnStore } from "./conn";
import { ref } from "vue";
import type { EasemobChat } from "easemob-websdk/Easemob-chat";

interface ConversationMessagesInfo {
  messages: EasemobChat.ExcludeAckMessageBody[];
  cursor: string;
  isLast: boolean;
}

export const useMessageStore = defineStore("message", () => {
  const conn = useConnStore();
  // 消息ID和消息体的映射
  const messageMap = ref<Map<string, EasemobChat.ExcludeAckMessageBody>>(
    new Map()
  );

  const conversationMessagesMap = ref<Map<string, ConversationMessagesInfo>>(
    new Map()
  );

  /** 获取历史消息 */
  const getHistoryMessages = async (
    conversation: EasemobChat.ConversationItem,
    cursor?: string
  ) => {
    const dt = await conn.getChatConn().getHistoryMessages({
      targetId: conversation.conversationId,
      chatType: conversation.conversationType,
      pageSize: 10,
      cursor: cursor || ""
    });
    // 更新本地消息映射
    dt.messages.forEach((msg) => {
      //@ts-ignore
      messageMap.value.set(msg.id, msg);
    });

    conversationMessagesMap.value.set(conversation.conversationId, {
      //@ts-ignore
      messages: dt.messages.reverse(),
      cursor: "",
      isLast: false
    });
  };

  return { messageMap, conversationMessagesMap, getHistoryMessages };
});

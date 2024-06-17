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
      pageSize: 100,
      cursor: cursor || ""
    });
    // 更新本地消息映射
    dt.messages.forEach((msg) => {
      //@ts-ignore
      messageMap.value.set(msg.id, msg);
    });

    if (conversationMessagesMap.value.has(conversation.conversationId)) {
      const info = conversationMessagesMap.value.get(
        conversation.conversationId
      );
      if (info) {
        //@ts-ignore
        info.messages.unshift(...dt.messages.reverse());
        info.cursor = dt.cursor || "";
        info.isLast = dt.isLast;
        conversationMessagesMap.value.set(conversation.conversationId, info);
      }
      return;
    }

    conversationMessagesMap.value.set(conversation.conversationId, {
      //@ts-ignore
      messages: dt.messages.reverse(),
      cursor: dt.cursor || "",
      isLast: dt.isLast
    });
  };

  return { messageMap, conversationMessagesMap, getHistoryMessages };
});

import { defineStore } from "pinia";
import { useConnStore } from "./conn";
import { ref } from "vue";
import { useConversationStore } from "./conversation";
import type { EasemobChat } from "easemob-websdk/Easemob-chat";

interface ConversationMessagesInfo {
  messages: EasemobChat.ExcludeAckMessageBody[];
  cursor: string;
  isLast: boolean;
}

export const useMessageStore = defineStore("message", () => {
  const { getChatConn } = useConnStore();
  const {
    getConversationById,
    createConversation,
    updateConversationLastMessage,
    moveConversationTop,
    getCvsIdFromMessage,
    markConversationRead
  } = useConversationStore();
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
    const dt = await getChatConn().getHistoryMessages({
      targetId: conversation.conversationId,
      chatType: conversation.conversationType,
      pageSize: 50,
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

  /** 插入新消息 */
  const insertMessage = (msg: EasemobChat.ExcludeAckMessageBody) => {
    let convId = getCvsIdFromMessage(msg as EasemobChat.ExcludeAckMessageBody);
    // 如果已经存在会话消息映射，则直接插入, 否则通过历史消息获取
    if (conversationMessagesMap.value.has(convId)) {
      const info = conversationMessagesMap.value.get(convId);
      if (info) {
        //@ts-ignore
        info.messages.push(msg);
      }
      return;
    }
  };

  /** 发送消息 */
  const sendMessage = (msg: EasemobChat.MessageBody) => {
    return getChatConn()
      .send(msg)
      .then((res) => {
        if (
          msg.type !== "delivery" &&
          msg.type !== "read" &&
          msg.type !== "channel"
        ) {
          insertMessage(msg);
          if (msg.chatType === "chatRoom") {
            return res;
          }
          const convId = getCvsIdFromMessage(msg);
          const conv = getConversationById(convId);
          if (conv) {
            // 如果会话存在，则更新会话最后一条消息和未读消息数
            updateConversationLastMessage(
              {
                conversationId: convId,
                conversationType: msg.chatType
              },
              msg,
              conv.unReadCount
            );
            // 移动会话到顶部
            moveConversationTop(conv);
            return;
          }
        }
        return res;
      });
  };

  /** 收到消息回调处理 */
  const onMessage = (msg: EasemobChat.ExcludeAckMessageBody) => {
    const { currConversation } = useConversationStore();
    insertMessage(msg);
    // 不处理聊天室会话
    if (msg.chatType === "chatRoom") {
      return;
    }
    const convId = getCvsIdFromMessage(msg);
    const conv = getConversationById(convId);
    if (conv) {
      // 如果会话存在，则更新会话最后一条消息和未读消息数
      updateConversationLastMessage(
        {
          conversationId: convId,
          conversationType: msg.chatType
        },
        msg,
        msg.from !== getChatConn().user
          ? conv.unReadCount + 1
          : conv.unReadCount
      );
      // 移动会话到顶部
      moveConversationTop(conv);
      // 如果当前会话是当前会话，则标记为已读
      if (currConversation?.conversationId === convId) {
        markConversationRead({
          conversationId: convId,
          conversationType: msg.chatType
        });
      }
      return;
    }
    //如果会话不存在,创建新会话
    const newConv = createConversation(
      {
        conversationId: convId,
        conversationType: msg.chatType
      },
      msg,
      msg.from !== getChatConn().user ? 1 : 0
    );
    // 移动会话到顶部
    moveConversationTop(newConv);
  };
  return {
    messageMap,
    conversationMessagesMap,
    getHistoryMessages,
    insertMessage,
    sendMessage,
    onMessage
  };
});

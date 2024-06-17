<template>
  <view class="chat-wrap">
    <!-- 消息列表 -->
    <view class="msgs-wrap">
      <MessageList
        v-if="msgs"
        ref="msgListRef"
        :msgs="msgs"
        :conversationId="conversationId"
        :conversationType="conversationType"
      />
    </view>
    <!-- 输入框 -->
    <view class="chat-input-wrap">
      <MessageInput @onMessageSend="onMessageSend" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMessageStore } from "@/store/message";
import { useConversationStore } from "@/store/conversation";
import { useI18n } from "vue-i18n";
import MessageList from "./components/message/messageList.vue";
import MessageInput from "./components/messageInput/index.vue";
import { onMounted, computed } from "vue";
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import { onLoad } from "@dcloudio/uni-app";

const msgListRef = ref(null);

const { t } = useI18n();
const conversationId = ref("");
const conversationType = ref<EasemobChat.ConversationItem["conversationType"]>(
  "" as EasemobChat.ConversationItem["conversationType"]
);
const { getHistoryMessages, conversationMessagesMap } = useMessageStore();
const { markConversationRead, setCurrentConversation } = useConversationStore();

const msgs = computed(() => {
  return conversationMessagesMap.get(conversationId.value)?.messages;
});

const onMessageSend = () => {
  msgListRef?.value?.toBottomMsg();
};

onMounted(() => {
  if (!conversationId.value && !conversationType.value) {
    return;
  }
  markConversationRead({
    conversationId: conversationId.value,
    conversationType: conversationType.value
  } as EasemobChat.ConversationItem);
  const vl = msgs.value;
  if (!vl) {
    getHistoryMessages({
      conversationId: conversationId.value,
      conversationType: conversationType.value
    } as EasemobChat.ConversationItem);
  }
});

onLoad((option) => {
  conversationType.value = option?.type;
  conversationId.value = option?.id;
  if (option?.id) {
    setCurrentConversation({
      conversationId: conversationId.value,
      conversationType: conversationType.value
    });
  }
});
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>

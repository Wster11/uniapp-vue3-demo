<template>
  <view class="chat-wrap">
    <view class="loadMore" v-if="msgs && !isLast" @tap="loadMore">{{
      $t("loadMore")
    }}</view>
    <view class="msgs-wrap">
      <MessageList v-if="msgs" :msgs="msgs" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMessageStore } from "@/store/message";
import { useConversationStore } from "@/store/conversation";
import { useI18n } from "vue-i18n";
import MessageList from "./components/message/messageList.vue";
import { onMounted, computed } from "vue";
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import { onLoad } from "@dcloudio/uni-app";

const { t } = useI18n();
const conversationId = ref("");
const conversationType = ref("");
const isLoading = ref(false);
const { getHistoryMessages, conversationMessagesMap } = useMessageStore();
const { markConversationRead } = useConversationStore();

const msgs = computed(() => {
  return conversationMessagesMap.get(conversationId.value)?.messages;
});

const isLast = computed(() => {
  return conversationMessagesMap.get(conversationId.value)?.isLast;
});

const cursor = computed(() => {
  return conversationMessagesMap.get(conversationId.value)?.cursor;
});

const loadMore = async () => {
  if (isLoading.value === true) {
    return;
  }
  isLoading.value = true;
  try {
    await getHistoryMessages(
      {
        conversationId: conversationId.value,
        conversationType: conversationType.value
      } as EasemobChat.ConversationItem,
      cursor.value
    );
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
  }
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
});
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>

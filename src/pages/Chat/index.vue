<template>
  <view class="chat-wrap">
    <view class="msgs-wrap">
      <MessageList v-if="msgs" :msgs="msgs" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMessageStore } from "@/store/message";
import { useI18n } from "vue-i18n";
import MessageList from "./components/message/messageList.vue";
import { onMounted, computed } from "vue";

const { t } = useI18n();
const { getHistoryMessages, conversationMessagesMap } = useMessageStore();

const msgs = computed(() => {
  return conversationMessagesMap.get("yjj")?.messages;
});

onMounted(() => {
  getHistoryMessages({
    conversationId: "yjj",
    conversationType: "singleChat"
  } as any);
});
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>

<template>
  <view class="message-input-wrap">
    <view class="send-input">
      <input
        v-model="text"
        auto-blur
        @confirm="handleSendMessage"
        :placeholder="$t('sendMessagePlaceholder')"
    /></view>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useConnStore } from "@/store/conn";
import { useConversationStore } from "@/store/conversation";
import { useMessageStore } from "@/store/message";

const emits = defineEmits(["onMessageSend"]);

const { currConversation } = useConversationStore();

const { sendMessage } = useMessageStore();

const { getChatSDK } = useConnStore();

const SDK = getChatSDK();

const text = ref("");

const handleSendMessage = async () => {
  const msg = SDK.message.create({
    to: currConversation!.conversationId,
    chatType: currConversation!.conversationType,
    type: "txt",
    msg: text.value
  });
  text.value = "";
  await sendMessage(msg);
  nextTick(() => {
    emits("onMessageSend");
  });
};
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>

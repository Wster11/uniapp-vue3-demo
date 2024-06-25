<template>
  <view class="message-input-wrap">
    <view class="send-input">
      <input
        v-model="text"
        :adjust-position="true"
        :auto-blur="true"
        confirm-type="send"
        @confirm="handleSendMessage"
        :placeholder="$t('sendMessagePlaceholder')"
    /></view>
    <view class="send-more">
      <image
        class="icon"
        @tap.stop="emits('onShowToolbar')"
        :src="PlusIcon"
      ></image>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useConnStore } from "@/store/conn";
import { useConversationStore } from "@/store/conversation";
import { useMessageStore } from "@/store/message";
import PlusIcon from "@/static/images/inputbar/tofeipeng/icons/plus_in_circle@2x.png";

const emits = defineEmits(["onMessageSend", "onShowToolbar"]);

const convStore = useConversationStore();

const { sendMessage } = useMessageStore();

const { getChatSDK } = useConnStore();

const SDK = getChatSDK();

const text = ref("");

const handleSendMessage = async () => {
  const msg = SDK.message.create({
    to: convStore.currConversation!.conversationId,
    chatType: convStore.currConversation!.conversationType,
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

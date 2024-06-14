<template>
  <view class="msg-text">
      <span class="msg">{{ msg.msg }}</span>
  </view>
</template>

<script lang="ts" setup>
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
interface Props {
  msg: EasemobChat.TextMsgBody;
}
const props = defineProps<Props>();

const { msg } = props;
</script>

<style lang="scss" scoped>
.msg-text {
  color: #333;
  text-align: left;
  overflow-y: auto;
  word-break: break-all;
  word-wrap: break-word;
  white-space: break-spaces;
}
</style>

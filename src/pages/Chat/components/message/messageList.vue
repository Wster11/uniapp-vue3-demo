<template>
  <view class="msg-bubble">
    <scroll-view scroll-y="true" class="message-scroll-list">
      <view v-for="(msg, idx) in msgs" :key="msg.id">
        <MessageTime
          :curr-time="msg.time"
          :prev-time="idx > 0 ? msgs[idx - 1].time : 0"
        />
        <MessageItem :msg="msg" />
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import MessageItem from "./messageItem.vue";
import MessageTime from "./messageTime.vue";
import { ref, toRef } from "vue";
interface Props {
  msgs: EasemobChat.ExcludeAckMessageBody[];
}
const props = defineProps<Props>();

const { msgs } = props;

// const scrollTop = ref(999999);
</script>

<template>
  <view class="msg-bubble">
    <div class="message-scroll-list" ref="content">
      <view v-for="(msg, idx) in msgs" :id="`msg-${msg.id}`" :key="msg.id">
        <MessageTime
          :curr-time="msg.time"
          :prev-time="idx > 0 ? msgs[idx - 1].time : 0"
        />
        <MessageItem :msg="msg" />
      </view>
    </div>
  </view>
</template>

<script lang="ts" setup>
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import MessageItem from "./messageItem.vue";
import MessageTime from "./messageTime.vue";
import { ref, toRef, onMounted } from "vue";
interface Props {
  msgs: EasemobChat.ExcludeAckMessageBody[];
}
const props = defineProps<Props>();

const { msgs } = props;

const content = ref(null);

onMounted(() => {
  const contentEl = content.value;
  uni.pageScrollTo({
    //@ts-ignore
    scrollTop: contentEl?.scrollHeight,
    duration: 0
  });
});
</script>

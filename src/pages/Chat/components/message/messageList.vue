<template>
  <view class="msg-bubble">
    <div class="message-scroll-list" ref="content">
      <view class="loadMore" v-if="msgs && !isLast" @tap="loadMore">{{
        $t("loadMore")
      }}</view>
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
import { ref, onMounted, computed } from "vue";
import { useMessageStore } from "@/store/message";
interface Props {
  msgs: EasemobChat.ExcludeAckMessageBody[];
  conversationId: string;
  conversationType: EasemobChat.ConversationItem["conversationType"];
}
const props = defineProps<Props>();

const { msgs, conversationId, conversationType } = props;

const content = ref(null);

const isLoading = ref(false);

const { getHistoryMessages, conversationMessagesMap } = useMessageStore();

const isLast = computed(() => {
  return conversationMessagesMap.get(conversationId)?.isLast;
});

const cursor = computed(() => {
  return conversationMessagesMap.get(conversationId)?.cursor;
});

const loadMore = async () => {
  if (isLoading.value === true) {
    return;
  }
  isLoading.value = true;
  try {
    await getHistoryMessages(
      {
        conversationId: conversationId,
        conversationType: conversationType
      } as EasemobChat.ConversationItem,
      cursor.value
    );
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
  }
};

const toBottomMsg = () => {
  const contentEl = content.value;
  //@ts-ignore
  contentEl.scrollTop = contentEl?.scrollHeight;
};

onMounted(() => {
  toBottomMsg();
});

defineExpose({
  toBottomMsg
});

</script>

<style lang="scss" scoped>
.msg-bubble {
  height: 100%;
  overflow-y: scroll;
}

.message-scroll-list {
  height: 100%;
  overflow-y: scroll;
  padding: 0 20rpx;
}

.loadMore {
  text-align: center;
  font-size: 28rpx;
  margin: 10rpx 0;
  color: #999;
}
</style>

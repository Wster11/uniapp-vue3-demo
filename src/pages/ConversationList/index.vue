<template>
  <view class="conversation-list-wrap">
    <view class="input-wrap">
      <input
        v-model="filter"
        :placeholder="$t('conversationSearchPlaceholder')"
      />
    </view>
    <view v-if="filteredConversationList.length">
      <view v-for="conv in filteredConversationList" :key="conv.conversationId">
        <ConversationItem :conversation="conv" />
      </view>
    </view>
    <view v-else class="conversation-empty">
      {{ $t("conversationEmptyTip") }}
    </view>
  </view>
</template>

<script setup lang="ts">
import ConversationItem from "./components/conversationItem/index.vue";
import { useConversationStore } from "@/store/conversation";
import { ref, onMounted, computed, watch } from "vue";

const filter = ref("");

const {
  getConversationList,
  conversationList,
  setConversationParams,
  conversationParams
} = useConversationStore();

setConversationParams({
  pageSize: 2,
  cursor: ""
});

const filteredConversationList = computed(() => {
  return conversationList.filter((conv) => {
    return conv.conversationId.includes(filter.value);
  });
});

watch(
  () => conversationParams.cursor,
  (newCursor) => {
    if (newCursor) {
      getConversationList();
    }
  }
);

onMounted(() => {
  getConversationList();
});
</script>
<style lang="scss">
@import url("./style.scss");
</style>

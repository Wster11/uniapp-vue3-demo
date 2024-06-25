<template>
  <view class="conversation-list-wrap">
    <view class="input-wrap">
      <input
        v-model="filter"
        :placeholder="$t('conversationSearchPlaceholder')"
      />
    </view>
    <PopMenu
      v-if="isShowMenu"
      :pop-style="popStyle"
      :conversation="selectedConv"
      @on-menu-close="onMenuClose"
    />
    <view v-if="filteredConversationList.length">
      <view
        v-for="conv in filteredConversationList"
        :key="conv.conversationId"
        :data-id="conv.conversationId"
        @longpress="onLongPress"
        class="conversation-item-wrap"
        :class="{
          'conversation-item-wrap-selected':
            conv.conversationId === selectedConv.conversationId
        }"
      >
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
import PopMenu from "./components/menu/index.vue";
import { useConversationStore } from "@/store/conversation";
import { ref, onMounted, computed, watch, nextTick } from "vue";
import type { EasemobChat } from "easemob-websdk";
import { onLoad } from "@dcloudio/uni-app";
const filter = ref("");
const popStyle = ref("");
const selectedConv = ref({} as EasemobChat.ConversationItem);
const isShowMenu = ref(false);
const winSize = ref({
  width: 0,
  height: 0
});

const convStore = useConversationStore();

const { getConversationList } = convStore;

const filteredConversationList = computed(() => {
  return convStore.conversationList.filter((conv) => {
    return conv.conversationId.includes(filter.value);
  });
});

const getWindowSize = () => {
  uni.getSystemInfo({
    success: (res) => {
      winSize.value.width = res.windowWidth;

      winSize.value.height = res.windowHeight;
    }
  });
};

const onLongPress = (e: any) => {
  let [touches, style, conversationId] = [
    e.touches[0],
    "",
    e.currentTarget.dataset.id
  ];

  selectedConv.value = convStore.conversationList.find(
    (conv) => conv.conversationId === conversationId
  ) as EasemobChat.ConversationItem;

  /* 因 非H5端不兼容 style 属性绑定 Object ，所以拼接字符 */
  if (touches.clientY > winSize.value.height / 2) {
    style = `bottom:${winSize.value.height - touches.clientY}px;`;
  } else {
    style = `top:${touches.clientY}px;`;
  }
  if (touches.clientX > winSize.value.width / 2) {
    style += `right:${winSize.value.width - touches.clientX}px`;
  } else {
    style += `left:${touches.clientX + 20}px`;
  }

  popStyle.value = style;
  isShowMenu.value = true;
};

const onMenuClose = () => {
  isShowMenu.value = false;
  selectedConv.value = {} as EasemobChat.ConversationItem;
};

watch(
  () => convStore.conversationParams.cursor,
  (newCursor) => {
    if (newCursor) {
      getConversationList();
    }
  },
  {
    immediate: true
  }
);

onLoad(() => {
  getWindowSize();
});
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>

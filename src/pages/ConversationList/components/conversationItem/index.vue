<template>
  <view class="conversation-item-wrap">
    <view>
      <Avatar src="" :placeholder="getAvatarPlaceholder()" />
    </view>
    <view class="content-wrap">
      <view class="user-info-wrap">
        <view class="user-nick-name">{{ conversation.conversationId }}</view>
        <view class="last-msg">{{ formatLastMessage(conversation) }}</view>
      </view>
      <view v-if="conversation.unReadCount > 0" class="unreadCount">
        {{ conversation.unReadCount > 99 ? "99+" : conversation.unReadCount }}
      </view>
      <view class="time">{{
        getConversationLastMessageTime(conversation.lastMessage)
      }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import Avatar from "@/components/avatar/index.vue";
import defaultAvatar from "@/static/images/defaultAvatar.png";
import defaultGroupAvatar from "@/static/images/defaultGroupAvatar.png";
import { useI18n } from "vue-i18n";
import { useConversationStore } from "@/store/conversation";

const { t } = useI18n();

interface Props {
  conversation: EasemobChat.ConversationItem;
}
const props = defineProps<Props>();

const { getConversationLastMessageTime } = useConversationStore();

const getAvatarPlaceholder = () => {
  return props.conversation.conversationType === "groupChat"
    ? defaultGroupAvatar
    : defaultAvatar;
};

const formatLastMessage = (conversation: EasemobChat.ConversationItem) => {
  let lastMsg = "";
  switch (conversation.lastMessage?.type) {
    case "txt":
      if (conversation.lastMessage?.msg == "the combine message") {
        lastMsg = `/${t("chatHistory")}/`;
      } else {
        lastMsg = conversation.lastMessage?.msg;
      }
      break;
    case "img":
      lastMsg = `/${t("image")}/`;
      break;
    case "audio":
      lastMsg = `/${t("audio")}/`;
      break;
    case "file":
      lastMsg = `/${t("file")}/`;
      break;
    case "video":
      lastMsg = `/${t("video")}/`;
      break;
    case "custom":
      if (conversation.lastMessage.customEvent == "userCard") {
        lastMsg = `/${t("contact")}/`;
      } else {
        lastMsg = `/${t("custom")}/`;
      }
      break;
    case "combine":
      lastMsg = `/${t("chatHistory")}/`;
      break;
    default:
      console.warn("unexpected message type:", conversation.lastMessage?.type);
      break;
  }
  return lastMsg;
};
</script>
<style lang="scss">
@import url("./style.scss");
</style>

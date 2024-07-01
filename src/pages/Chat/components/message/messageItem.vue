<template>
  <view
    class="msg-item-wrap"
    :style="{ flexDirection: isSelf ? 'row-reverse' : 'row' }"
  >
    <view class="avatar-wrap">
      <Avatar
        :src="getUserInfoFromStore(msg.from || '').avatar"
        :placeholder="defaultAvatar"
      />
    </view>
    <view class="msg-content">
      <view v-if="!isSelf"> {{ msg.from }}</view>
      <view class="msg-bubble">
        <view v-if="msg.type === 'txt'">
          <TextMessage :msg="msg" />
        </view>
        <view v-else-if="msg.type === 'img'">
          <ImageMessage :msg="msg" />
        </view>
        <view v-else-if="msg.type === 'video'">
          <VideoMessage :msg="msg" />
        </view>
        <view v-else-if="msg.type === 'audio'">
          <view>[Audio]</view>
        </view>
        <view v-else-if="msg.type === 'custom'">
          <view>[Custom]</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import Avatar from "@/components/avatar/index.vue";
import TextMessage from "./messageTxt.vue";
import ImageMessage from "./messageImage.vue";
import VideoMessage from "./messageVideo.vue";
import defaultAvatar from "@/static/images/defaultAvatar.png";
import { useConnStore } from "@/store/conn";
import { useAppUserStore } from "@/store/appUser";

interface Props {
  msg: EasemobChat.ExcludeAckMessageBody;
}
const props = defineProps<Props>();

const appUserStore = useAppUserStore();

const { getUserInfoFromStore } = appUserStore;

const isSelf =
  useConnStore().getChatConn().user === props.msg.from || props.msg.from === "";
</script>

<style lang="scss" scoped>
.msg-item-wrap {
  display: flex;
  width: 100%;
  display: flex;
  margin-bottom: 30rpx;
  align-items: center;

  .msg-bubble {
    font-size: 28rpx;
    display: inline-block;
    word-break: break-all;
    background: #f5f5f5;
    border-radius: 20rpx;
    padding: 14rpx;
    max-width: calc(100vw - 200rpx);
    min-width: 30rpx;
  }

  .msg-content {
    margin: 0 20rpx 20rpx;
  }

  .avatar-wrap {
    align-self: self-end;
  }
}
</style>

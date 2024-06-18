<template>
  <view class="msg-video">
    <video
      id="videoEle"
      class="video-box"
      :src="msg.url"
      :poster="msg.thumb"
      controls
      autoplay
    />
  </view>
</template>

<script lang="ts" setup>
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
interface Props {
  msg: EasemobChat.VideoMsgBody;
}
const props = defineProps<Props>();

const { msg } = props;
</script>

<style lang="scss" scoped>
.video-box {
  max-width: 400rpx;
  max-height: 550rpx;
}
.msg-video {
  width: 80%;
}
</style>

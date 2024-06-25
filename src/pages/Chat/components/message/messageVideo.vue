<template>
  <view class="msg-video">
    <view class="video-poster">
      <image @error="onError" class="image" :src="msg.thumb" mode="aspectFit" />
      <view v-if="!isError" @tap="toVideoPreview" class="video-play-btn">
        <image class="video-play-btn-image" :src="VideoPlayBtn"></image>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import ImageNotFound from "@/static/images/img404.jpg";
import VideoPlayBtn from "@/static/images//inputbar/tofeipeng/icons/video-play-btn.png";
import { ref } from "vue";
interface Props {
  msg: EasemobChat.VideoMsgBody;
}
const props = defineProps<Props>();

const isError = ref(false);

const onError = () => {
  props.msg.thumb = ImageNotFound;
  isError.value = true;
};

const toVideoPreview = () => {
  uni.navigateTo({
    url: `../../pages/VideoPreview/index?url=${props.msg.url}`
  });
};
</script>

<style lang="scss" scoped>
.msg-video {
  position: relative;
}
.image {
  max-width: 400rpx;
  max-height: 550rpx;
}

.video-poster {
  position: relative;
}

.video-play-btn {
  display: inline-block;
  position: absolute;
  width: 100rpx;
  height: 100rpx;
  top: 50%;
  left: 50%;
  transform: translateX(-50rpx) translateY(-50rpx);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
}

.video-play-btn-image {
  width: 100rpx;
  height: 100rpx;
}
</style>

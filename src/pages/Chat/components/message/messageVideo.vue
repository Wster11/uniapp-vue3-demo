<template>
  <view class="msg-video">
    <view class="video-poster">
      <image @error="onError" class="image" :src="msg.thumb" mode="aspectFit" />
      <view v-if="!isError" @tap="isShowVideo = true" class="video-play-btn">
        <image class="video-play-btn-image" :src="VideoPlayBtn"></image>
      </view>
    </view>
    <view class="video-mask" v-if="isShowVideo">
      <video
        class="video-box"
        :src="msg.url"
        :poster="msg.thumb"
        controls
        autoplay
      >
        <cover-view @tap="isShowVideo = false" class="close-video">
          X
        </cover-view>
      </video>
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

const { msg } = props;

const isError = ref(false);

const isShowVideo = ref(false);

const onError = () => {
  msg.thumb = ImageNotFound;
  isError.value = true;
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

.video-mask {
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  align-items: center;
  z-index: 999;
}

.video-box {
  width: 100%;
  height: 100%;
}

.close-video {
  position: absolute;
  top: 20rpx;
  right: 40rpx;
  font-size: 40rpx;
  color: #fff;
  z-index: 1000;
  padding: 0 20rpx;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 10rpx;
  text-align: center;
}
</style>

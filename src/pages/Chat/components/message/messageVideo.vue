<template>
  <view class="msg-video">
    <view class="video-poster">
      <image
        mode="widthFix"
        :style="{ height: imgHeight + 'px' }"
        @error="onError"
        @load="onImgLoad"
        class="image"
        :src="msg.thumb"
      />
      <view
        v-if="!isError && isLoaded"
        @tap="toVideoPreview"
        class="video-play-btn"
      >
        <image class="video-play-btn-image" :src="VideoPlayBtn"></image>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import ImageNotFound from "@/static/images/img404.jpg";
import VideoPlayBtn from "@/static/images/videoplay.png";
import { ref } from "vue";
interface Props {
  msg: EasemobChat.VideoMsgBody;
}
const props = defineProps<Props>();

const isError = ref(false);

const isLoaded = ref(false);

const imgHeight = ref(0);

const onError = () => {
  props.msg.thumb = ImageNotFound;
  isError.value = true;
};

const onImgLoad = (e: any) => {
  isLoaded.value = true;
  const { width, height } = e.detail;
  imgHeight.value = (height / width) * 100;
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
  width: 110rpx;
  height: 100rpx;
  top: 50%;
  left: 50%;
  transform: translateX(-50rpx) translateY(-50rpx);
  border-radius: 50%;
}

.video-play-btn-image {
  width: 110rpx;
  height: 100rpx;
}
</style>

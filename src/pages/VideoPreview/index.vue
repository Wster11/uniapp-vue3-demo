<template>
  <view class="video-preview">
    <video
      class="video-box"
      :src="videoUrl"
      :style="{ height: videoHeight + 'px' }"
      controls
      autoplay
    ></video>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { isSafari } from "@/utils/index";

const videoUrl = ref("");
const height =
  uni.getStorageSync("screenHeight") || uni.getSystemInfoSync().screenHeight;
// TODO: video 100vh显示总有黑边偏移，暂时的解决方案
const videoHeight = height - 100;

uni.setStorage({
  key: "screenHeight",
  data: height
});

onLoad((option) => {
  // 支持safari浏览器播放
  if (isSafari()) {
    videoUrl.value = `${option?.url}&origin-file=true`;
    return;
  }
  videoUrl.value = option?.url;
});
</script>

<style lang="scss" scoped>
.video-preview {
  width: 100%;
  height: 100%;
  background-color: #000;
}
.video-box {
  width: 100%;
}
</style>

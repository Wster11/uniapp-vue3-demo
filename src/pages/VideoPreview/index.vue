<template>
  <view class="video-preview">
    <video class="video-box" :src="videoUrl" controls autoplay></video>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

const videoUrl = ref("");

onLoad((option) => {
  // 支持safari浏览器播放
  videoUrl.value = `${option?.url}&origin-file=true`;
});
</script>

<style lang="scss" scoped>
.video-preview,
.video-box {
  width: 100%;
  height: 100%;
}
</style>

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
  videoUrl.value = option?.url;
});
</script>

<style lang="scss" scoped>
.video-preview,
.video-box {
  width: 100%;
  height: 100%;
}
</style>

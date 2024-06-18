<template>
  <view class="message-input-toolbar">
    <swiper class="swiper">
      <swiper-item class="swiper-item">
        <ImageUpload />
        <VideoUpload />
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup lang="ts">
import ImageUpload from "./imageUpload.vue";
import VideoUpload from "./videoUpload.vue";
import { ref, nextTick } from "vue";

const emits = defineEmits(["onMessageSend"]);
</script>
<style lang="scss" scoped>
.message-input-toolbar {
  background: #ebf0f6;
}

.swiper-item {
  display: flex;
  flex-flow: row wrap;
}
</style>

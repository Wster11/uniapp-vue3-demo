<template>
  <view class="msg-image">
    <image
      mode="widthFix"
      :style="{ height: imgHeight + 'px' }"
      @error="onError"
      @tap="previewImage"
      @load="onImgLoad"
      class="image"
      :src="msg.thumb"
    />
  </view>
</template>

<script lang="ts" setup>
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import ImageNotFound from "@/static/images/img404.jpg";
import { ref } from "vue";
interface Props {
  msg: EasemobChat.ImgMsgBody;
}
const props = defineProps<Props>();
const isError = ref(false);
const imgHeight = ref(0);

const onError = () => {
  isError.value = true;
  props.msg.thumb = ImageNotFound;
};

const previewImage = () => {
  if (isError.value) {
    return;
  }
  uni.previewImage({
    urls: [props.msg.url || ""]
  });
};

const onImgLoad = (e: any) => {
  const { width, height } = e.detail;
  imgHeight.value = (height / width) * 100;
};
</script>

<style lang="scss" scoped>
.image {
  max-width: 400rpx;
  max-height: 550rpx;
}
</style>

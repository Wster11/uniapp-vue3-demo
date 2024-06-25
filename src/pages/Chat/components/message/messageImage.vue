<template>
  <view class="msg-image">
    <image
      @error="onError"
      @tap="previewImage"
      class="image"
      :src="msg.thumb"
      mode="aspectFit"
    />
  </view>
</template>

<script lang="ts" setup>
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import ImageNotFound from "@/static/images/img404.jpg";
interface Props {
  msg: EasemobChat.ImgMsgBody;
}
const props = defineProps<Props>();

const onError = (e: any) => {
  props.msg.url = ImageNotFound;
};

const previewImage = (url: string) => {
  uni.previewImage({
    urls: [props.msg.url || ""]
  });
};
</script>

<style lang="scss" scoped>
.image {
  max-width: 400rpx;
  max-height: 550rpx;
}
.msg-image {
  width: 80%;
}
</style>

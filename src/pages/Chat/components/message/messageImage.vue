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
import { ref } from "vue";
interface Props {
  msg: EasemobChat.ImgMsgBody;
}
const props = defineProps<Props>();
const isError = ref(false);

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

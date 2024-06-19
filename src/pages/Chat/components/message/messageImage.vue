<template>
  <view class="msg-image">
    <image @error="onError" class="image" :src="msg.url" mode="aspectFit" />
  </view>
</template>

<script lang="ts" setup>
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import ImageNotFound from "@/static/images/img404.jpg";
interface Props {
  msg: EasemobChat.ImgMsgBody;
}
const props = defineProps<Props>();

const { msg } = props;

const onError = (e: any) => {
  msg.url = ImageNotFound;
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

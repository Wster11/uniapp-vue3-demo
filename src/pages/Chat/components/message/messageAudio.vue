<template>
  <view class="msg-audio">
    <view class="content-wrap" @tap="play">
      <view class="content" v-if="isSelf">
        <view> {{ props.msg.length }}'' </view>
        <image class="image" :src="SendAudioIcon" mode="aspectFit" />
      </view>
      <view class="content" v-else>
        <image class="image" :src="ReceiveAudioIcon" mode="aspectFit" />
        <view> {{ props.msg.length }}''</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import { useConnStore } from "@/store/conn";
import ReceiveAudioIcon from "@/static/images/other_playing_icon.png";
import SendAudioIcon from "@/static/images/mine_playing_icon.png";
import { ref, onUnmounted } from "vue";

interface Props {
  msg: EasemobChat.AudioMsgBody;
}
const connStore = useConnStore();
const conn = connStore.getChatConn();
const props = defineProps<Props>();
const audioContext = uni.createInnerAudioContext();
const playing = ref(false);
const isSelf = conn.user === props.msg.from || props.msg.from === "";
const play = () => {
  playing.value = true;
  audioContext.src = props.msg.url || "";
  audioContext.play();
};

const stop = () => {
  playing.value = false;
  audioContext.stop();
};

onUnmounted(() => {
  stop();
});
</script>

<style lang="scss" scoped>
.image {
  width: 40rpx;
  height: 40rpx;
}

.content {
  display: flex;
  align-items: center;
  width: 120rpx;
  line-height: 100%;
  justify-content: space-between;
}
</style>

<template>
  <view class="msg-audio">
    <view class="content-wrap" @tap="play">
      <view class="content" v-if="isSelf">
        <view> {{ props.msg.length }}'' </view>
        <image
          class="image"
          :src="playing ? SendAudioPlayingIcon : SendAudioIcon"
          mode="aspectFit"
        />
      </view>
      <view class="content" v-else>
        <image
          class="image"
          :src="playing ? ReceiveAudioPlayingIcon : ReceiveAudioIcon"
          mode="aspectFit"
        />
        <view> {{ props.msg.length }}''</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import { useConnStore } from "@/store/conn";
import ReceiveAudioIcon from "@/static/images/receive_audio.png";
import SendAudioIcon from "@/static/images/send_audio.png";
import SendAudioPlayingIcon from "@/static/images/send_audio_playing.gif";
import ReceiveAudioPlayingIcon from "@/static/images/receive_audio_playing.gif";
import { ref, onUnmounted } from "vue";
import { useMessageStore } from "@/store/message";

interface Props {
  msg: EasemobChat.AudioMsgBody;
}
const connStore = useConnStore();
const conn = connStore.getChatConn();
const props = defineProps<Props>();
const audioContext = uni.createInnerAudioContext();
const playing = ref(false);
const isSelf = conn.user === props.msg.from || props.msg.from === "";
const messageStore = useMessageStore();
const { setAudioInstance } = messageStore;

audioContext.onPlay(() => {
  if (messageStore.audioInstance) {
    messageStore.audioInstance.stop();
  }
  setAudioInstance(audioContext);
  playing.value = true;
});

audioContext.onStop(() => {
  playing.value = false;
});

audioContext.onPause(() => {
  playing.value = false;
});

audioContext.onError(() => {
  playing.value = false;
});

const play = () => {
  audioContext.src = props.msg.url || "";
  audioContext.play();
};

const stop = () => {
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

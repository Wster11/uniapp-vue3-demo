<template>
  <div v-if="isShowTime" class="message-time">
    {{ time }}
  </div>
</template>
<script setup lang="ts">
import { toRefs, ref, watch } from "vue";
import { formatTime } from "@/utils/index";
interface Props {
  currTime: number;
  prevTime: number;
}

const props = defineProps<Props>();

const { currTime, prevTime } = toRefs(props);
const isShowTime = ref(false);
const time = ref("");

const handleItemTime = (currTime: number, prevTime: number) => {

  isShowTime.value = true;
  if (currTime <= 0) {
    return "";
  } else if (!prevTime || prevTime <= 0) {
    isShowTime.value = true;
    return formatTime(currTime);
  } else {
    const minDiffToShow = 10 * 60 * 1000; // 10min
    const diff = currTime - prevTime; //
    if (diff >= minDiffToShow) {
      isShowTime.value = true;
      return formatTime(currTime);
    }
  }
  return "";
};

watch(
  () => [currTime.value, prevTime.value],
  (newVal: any, oldVal: any) => {
    if (newVal?.toString() === oldVal?.toString()) {
      return;
    } else {
      time.value = handleItemTime(currTime.value, prevTime.value);
    }
  },
  {
    immediate: true
  }
);
</script>
<style lang="scss" scoped>
.message-time {
  margin: 0 auto;
  color: #999;
  font-size: 12px;
  overflow-wrap: anywhere;
  display: flex;
  place-content: center center;
  align-items: center;
  text-align: center;
}
</style>

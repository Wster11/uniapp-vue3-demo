<template>
  <view
    :class="['avatar', shape]"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <image class="image" :src="imageSrc" :alt="alt" @error="onError" />
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface Props {
  src: string;
  alt?: string;
  size?: number;
  shape?: "circle" | "square";
  placeholder?: string;
}

const props = defineProps<Props>();

const imageSrc = ref(props.src || props.placeholder);
const size = props.size ?? 50; // 默认大小为50px
const shape = props.shape ?? "circle"; // 默认形状为圆形
const placeholder = props.placeholder;

const onError = () => {
  if (props.placeholder) {
    imageSrc.value = placeholder || "";
  }
};
</script>

<style lang="scss" scoped>
@import url("./style.scss");
</style>

<template>
  <view class="msg-notice">
    <view class="notice">
      <view class="notice-content">
        <view class="notice-text">
          <view v-if="noticeType === 'recallMessage'">
            {{ `${recallFrom} 撤回了一条消息` }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { MixedMessageBody } from "@/types/index";
import { useAppUserStore } from "@/store/appUser";
interface Props {
  msg: MixedMessageBody;
  noticeType: "recallMessage";
}
const appUserStore = useAppUserStore();
const props = defineProps<Props>();
const { msg, noticeType } = props;
const recallFrom = appUserStore.getUserInfoFromStore(
  msg?.extInfo?.recallFrom
).name;
</script>

<style lang="scss" scoped>
.msg-notice {
  margin: 20rpx 0;
}
.notice-text {
  text-align: center;
  font-size: 24rpx;
  color: #999;
}
</style>

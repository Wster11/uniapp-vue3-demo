<template>
  <view class="notices-wrap">
    <view
      class="notice-empty"
      v-if="groupStore.groupNoticeInfo.list.length === 0"
    >
      {{ $t("emptyNoticeTip") }}
    </view>
    <view
      class="item-info-wrap"
      v-for="notice in groupStore.groupNoticeInfo.list"
      :key="notice.time"
    >
      <view class="notice-info-wrap">
        <view class="item-id">{{
          getUserInfoFromStore(notice.from).name
        }}</view>
        <view class="notice-info">
          <view class="notice-msg">
            <view class="item-opt">
              <view>{{ `${notice.operation}, groupId: ${notice.id}` }}</view>
            </view>
          </view>
          <view class="notice-time">
            {{ getTimeStringAutoShort(notice.time) }}</view
          >
        </view>
      </view>
      <!-- TODO: 群组操作 -->
    </view>
  </view>
</template>

<script setup lang="ts">
import { useGroupStore } from "@/store/group";
import { getTimeStringAutoShort } from "@/utils/index";
import { useAppUserStore } from "@/store/appUser";
import { onUnmounted } from "vue";
const groupStore = useGroupStore();
const appUserStore = useAppUserStore();

const { getUserInfoFromStore } = appUserStore;

onUnmounted(() => {
  groupStore.clearGroupNoticeUnReadCount();
});
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>

<template>
  <view class="notices-wrap">
    <view class="notice-empty" v-if="groupStore.groupNotices.list.length === 0">
      {{ $t("emptyNoticeTip") }}
    </view>
    <view
      class="item-info-wrap"
      v-for="notice in groupStore.groupNotices.list"
      :key="notice.time"
    >
      <view class="notice-info-wrap">
        <view class="item-id">{{ notice.from }}</view>
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
      <!-- <view class="notice-btn-wrap" v-if="notice.type === 'subscribe'">
        <view class="notice-btn" @tap="acceptContactInvite(notice.from)">{{
          $t("acceptFriend")
        }}</view>
        <view class="notice-btn" @tap="declineContactInvite(notice.from)">{{
          $t("refuseFriend")
        }}</view>
      </view> -->
    </view>
  </view>
</template>

<script setup lang="ts">
import { useGroupStore } from "@/store/group";
import { getTimeStringAutoShort } from "@/utils/index";
const groupStore = useGroupStore();
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>

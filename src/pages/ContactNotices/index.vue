<template>
  <view class="notices-wrap">
    <view class="notice-empty" v-if="contactStore.contactsNotices.length === 0">
      {{ $t("emptyNoticeTip") }}
    </view>
    <view
      class="item-info-wrap"
      v-for="notice in contactStore.contactsNotices"
      :key="new Date().getTime()"
    >
      <view class="notice-info-wrap">
        <view class="item-id">{{ notice.from }}</view>
        <view class="notice-info">
          <view class="notice-msg">
            <view v-if="notice.ext === 'invited'" class="item-opt">
              <view>{{ $t("applyAddFriend") }}</view>
            </view>
            <view v-else-if="notice.ext === 'agreed'" class="item-opt">
              <view>{{ $t("agreedFriend") }}</view>
            </view>
            <view v-else-if="notice.ext === 'refused'" class="item-opt">
              <view>{{ $t("refusedFriend") }}</view>
            </view>
            <view v-else-if="notice.ext === 'added'" class="item-opt">
              <view>{{ $t("addedFriend") }}</view>
            </view>
            <view v-else-if="notice.ext === 'deleted'" class="item-opt">
              <view>{{ $t("deletedFriend") }}</view>
            </view>
          </view>
          <view class="notice-time">
            {{ getTimeStringAutoShort(notice.time) }}</view
          >
        </view>
      </view>
      <view class="notice-btn-wrap" v-if="notice.type === 'subscribe'">
        <view class="notice-btn" @tap="acceptContactInvite(notice.from)">{{
          $t("acceptFriend")
        }}</view>
        <view class="notice-btn" @tap="declineContactInvite(notice.from)">{{
          $t("refuseFriend")
        }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useContactStore } from "@/store/contact";
import { getTimeStringAutoShort } from "@/utils/index";
const contactStore = useContactStore();
const { acceptContactInvite, declineContactInvite } = contactStore;
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>

<template>
  <view class="user-wrap">
    <view class="user-info-wrap">
      <Avatar src="" :placeholder="defaultAvatar" />
      <view class="user-id-wrap">
        <view>{{ userId }}</view>
      </view>
    </view>
    <view class="divider"></view>

    <view class="menu-wrap">
      <view class="menu-item" @tap="toContactNotices">
        {{ $t("contactNotice") }}
        {{
          contactStore.contactsNotices.length > 0
            ? `(${contactStore.contactsNotices.length})`
            : ""
        }}
        <view class="item-info">></view>
      </view>
      <view class="menu-item" @tap="toGroupNotices">
        {{ $t("groupNotice") }}
        <view class="item-info">></view>
      </view>
      <view class="menu-item">
        {{ $t("feedback") }}
        <view class="item-info">yunxing@easemob.com</view>
      </view>
      <view class="menu-item">
        <view>{{ $t("about") }}</view>
        <view class="item-info">Easemob UniApp SDK v4.7.0</view>
      </view>
      <view class="menu-item menu-item-logout" @tap="logout">
        {{ $t("logout") }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Avatar from "@/components/avatar/index.vue";
import defaultAvatar from "@/static/images/defaultAvatar.png";
import { useChatStore } from "@/store/chat";
import { useConnStore } from "@/store/conn";
import { CHAT_STORE } from "@/const/index";
import { useContactStore } from "@/store/contact";

const contactStore = useContactStore();

const { close } = useChatStore();

const { getChatConn } = useConnStore();

const userId = getChatConn().user;

const toContactNotices = () => {
  uni.navigateTo({
    url: `../../pages/ContactNotices/index`
  });
};

const toGroupNotices = () => {
  uni.navigateTo({
    url: `../../pages/GroupNotices/index`
  });
};

const logout = () => {
  close();
  uni.removeStorageSync(CHAT_STORE);
  uni.reLaunch({
    url: "/pages/Login/index"
  });
};
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>

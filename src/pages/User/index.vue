<template>
  <view class="user-wrap">
    <view class="user-info-wrap">
      <Avatar
        src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/27/169bdc71a9825fd4~tplv-t2oaga2asx-no-mark:180:180:180:180.awebp"
      />
      <view class="user-id-wrap">
        <view>{{ userId }}</view>
      </view>
    </view>
    <view class="divider"></view>
    <view class="menu-wrap">
      <view class="menu-item">
        <view>{{$t("about")}}</view>
        <view class="item-info">Easemob UniApp SDK v4.7.0</view>
      </view>
      <view class="menu-item menu-item-logout" @tap="logout"> {{$t("logout")}}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Avatar from "@/components/avatar/index.vue";
import { useChatStore } from "@/store/chat";
import { useConnStore } from "@/store/conn";
import { useMessageStore } from "@/store/message";
import { useConversationStore } from "@/store/conversation";
import { useI18n } from "vue-i18n";
import { CHAT_STORE } from "@/const/index";

const { close } = useChatStore();

const { getChatConn } = useConnStore();

const userId = getChatConn().user;

const logout = () => {
  close();
  useMessageStore().clear();
  useConversationStore().clear();
  uni.removeStorageSync(CHAT_STORE);
  uni.reLaunch({
    url: "/pages/Login/index"
  });
};
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>

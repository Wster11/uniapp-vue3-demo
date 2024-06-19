<template>
  <view class="contact-wrap">
   
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useChatStore } from "@/store/chat";
import { useI18n } from "vue-i18n";
import { CHAT_STORE } from "@/const/index";

const { login } = useChatStore();
const { t } = useI18n();

const userId = ref("");
const password = ref("");

const loginIM = () => {
  if (userId.value === "") {
    uni.showToast({
      title: t("loginUserIdPlaceholder"),
      icon: "none"
    });
    return;
  }
  uni.showLoading({
    title: t("loginLoadingTitle")
  });

  login({
    user: userId.value,
    pwd: password.value // 密码登录
    // accessToken: "" // token登录
  })
    .then((res) => {
      uni.setStorage({
        key: CHAT_STORE,
        data: {
          userId: userId.value,
          token: res.accessToken
        }
      });
      // 跳转会话列表页面
      uni.switchTab({
        url: "../ConversationList/index"
      });
    })
    .catch((e) => {
      uni.showToast({
        title: e?.data?.data?.error_description,
        icon: "none"
      });
    })
    .finally(() => {
      uni.hideLoading();
    });
};
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>

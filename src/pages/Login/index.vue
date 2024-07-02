<template>
  <view class="login-wrap">
    <view class="login-header">
      <image
        src="/static/images/logo.png"
        style="width: 100px; height: 100px"
      ></image>
      <text class="login-title">{{ $t("easemob") }}IM Demo</text>
    </view>
    <!-- 用户名密码登录 -->
    <view v-if="isPasswordLogin" class="login-form-warp">
      <view class="input-wrap">
        <input v-model="userId" :placeholder="$t('loginUserIdPlaceholder')" />
      </view>
      <view class="input-wrap">
        <input
          type="password"
          v-model="password"
          :placeholder="$t('loginPasswordPlaceholder')"
        />
      </view>
    </view>
    <!--手机号验证码登录  -->
    <view v-else class="login-form-wrap">
      <view class="input-wrap">
        <input
          v-model="tel"
          maxlength="11"
          :placeholder="$t('loginPhoneIdPlaceholder')"
        />
      </view>
      <view class="item-wrap">
        <input v-model="code" :placeholder="$t('loginCodePlaceholder')" />
        <button
          size="mini"
          type="primary"
          class="send-code"
          @tap="getCode"
          :disabled="counter !== 60"
        >
          {{ counter === 60 ? $t("sendCode") : counter }}
        </button>
      </view>
    </view>
    <view class="private-wrap">
      <checkbox-group @change="checkboxChange">
        <label>
          <checkbox value="true" :checked="privacyChecked" />
          {{ $t("agreeTo") }}
          <a @tap="toPrivacy">《{{ $t("privacyPolicy") }}》</a>
        </label>
      </checkbox-group>
    </view>
    <button type="primary" @click="loginIM">{{ $t("login") }}</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useChatStore } from "@/store/chat";
import { useI18n } from "vue-i18n";
import { CHAT_STORE } from "@/const/index";

const { login } = useChatStore();
const { t } = useI18n();
const counter = ref(60);
const userId = ref("");
const password = ref("");
const tel = ref("");
const code = ref("");
const privacyChecked = ref(false);
// 是否使用用户名密码登录
const isPasswordLogin = ref(false);

const startCount = () => {
  const timer = setInterval(() => {
    counter.value--;
    if (counter.value <= 0) {
      clearInterval(timer);
      counter.value = 60;
    }
  }, 1000);
};

const getCode = async () => {
  if (!/^1[3456789]\d{9}$/.test(tel.value)) {
    uni.showToast({
      title: t("telNumberError"),
      icon: "none"
    });
    return false;
  }
  try {
    startCount();
    // 发送验证码
    const res: any = await uni.request({
      url: `https://a1.easemob.com/inside/app/sms/send/${tel.value}`,
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      data: {
        phoneNumber: tel.value
      }
    });
    if (res.statusCode == 200) {
      startCount();
      uni.showToast({ title: t("sendCodeSuccess"), icon: "none" });
    } else if (res.statusCode == 400) {
      if (res.data.errorInfo == "phone number illegal") {
        uni.showToast({ title: t("telNumberError"), icon: "none" });
      } else if (
        res.data.errorInfo == "Please wait a moment while trying to send."
      ) {
        uni.showToast({
          title: t("sendCodeFrequent"),
          icon: "none"
        });
      } else if (res.data.errorInfo.includes("exceed the limit")) {
        uni.showToast({ title: t("sendCodeReachLimit"), icon: "none" });
      } else {
        uni.showToast({ title: res.data.errorInfo, icon: "none" });
      }
    }
  } catch (error) {
    uni.showToast({ title: t("sendCodeFailed"), icon: "none" });
  }
};

// 用户名密码登录
const loginWithPassword = () => {
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
// 手机号验证码登录
const loginWithTel = async () => {
  uni.showLoading({
    title: t("loginLoadingTitle")
  });
  try {
    const res: any = await uni.request({
      url: "https://a1.easemob.com/inside/app/user/login/V2",
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      data: {
        phoneNumber: tel.value,
        smsCode: code.value
      }
    });

    if (res.statusCode == 200) {
      const { token, chatUserName } = res.data;
      login({
        user: chatUserName,
        accessToken: token
      })
        .then((res) => {
          uni.setStorage({
            key: CHAT_STORE,
            data: {
              userId: chatUserName,
              token: res.accessToken
            }
          });
          // 跳转会话列表页面
          uni.switchTab({
            url: "../ConversationList/index"
          });
        })
        .finally(() => {
          uni.hideLoading();
        });
    } else if (res.statusCode == 400) {
      if (res.data.errorInfo) {
        switch (res.data.errorInfo) {
          case "UserId password error.":
            uni.showToast({
              title: t("userIdOrPasswordError"),
              icon: "none"
            });
            break;
          case "phone number illegal":
            uni.showToast({
              title: t("telNumberError"),
              icon: "none"
            });
            break;
          case "SMS verification code error.":
            uni.showToast({
              title: t("codeError"),
              icon: "none"
            });
            break;
          case "Sms code cannot be empty":
            uni.showToast({
              title: t("codeIsEmpty"),
              icon: "none"
            });
            break;
          case "Please send SMS to get mobile phone verification code.":
            uni.showToast({
              title: t("sendCodeFirst"),
              icon: "none"
            });
            break;
          default:
            uni.showToast({
              title: res.data.errorInfo,
              icon: "none"
            });
            break;
        }
      }
    }
  } catch (error) {
    console.log(error);
    uni.showToast({
      title: t("loginFailed"),
      icon: "none"
    });
  }
};

const loginIM = () => {
  if (!privacyChecked.value) {
    uni.showToast({
      title: t("privacyChecked"),
      icon: "none"
    });
    return;
  }
  if (isPasswordLogin.value) {
    if (userId.value === "") {
      uni.showToast({
        title: t("loginUserIdPlaceholder"),
        icon: "none"
      });
      return;
    }
    loginWithPassword();
  } else {
    if (tel.value === "") {
      uni.showToast({
        title: t("loginPhoneIdPlaceholder"),
        icon: "none"
      });
      return;
    }
    if (code.value === "") {
      uni.showToast({
        title: t("loginCodePlaceholder"),
        icon: "none"
      });
      return;
    }
    loginWithTel();
  }
};

const toPrivacy = () => {
  const url = "https://www.easemob.com/terms";
  // #ifdef APP-PLUS
  plus.runtime.openURL(url);
  // #endif
  // #ifdef WEB
  window.open(url);
  // #endif
};

const checkboxChange = (e: any) => {
  privacyChecked.value = !!e.detail.value[0];
};
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>

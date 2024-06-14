<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useConnStore } from "@/store/conn";
import { useChatStore } from "@/store/chat";
import { CHAT_STORE } from "@/const/index";
import conn from "./initIM";

const autoLogin = async () => {
  try {
    let res = await uni.getStorage({
      key: CHAT_STORE
    });
    // 如果存在缓存，直接登录
    if (res.data) {
      const pages = getCurrentPages();
      console.log(pages, "pages");
      // 跳转会话列表页面
      uni.switchTab({
        url: "/pages/ConversationList/index"
      });
      const { userId, token } = res.data;
      await useChatStore().login({
        user: userId,
        accessToken: token
      });
    }
  } catch (error) {
    uni.redirectTo({
      url: "/pages/Login/index"
    });
    console.log(error, "error");
  }
};

onLaunch(() => {
  console.log("App Launch");
  // set Connection
  useConnStore().setChatConn(conn);
  autoLogin();
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});
</script>
<style>
@import url("./common.scss");
</style>

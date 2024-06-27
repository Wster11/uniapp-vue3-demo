//@ts-ignore
import { useConnStore } from "@/store/conn";
import { APPKEY, API_URL, URL } from "@/const/index";
import pinia from "@/store/pinia";
import i18n from "@/locales/index";

const { initChatSDK, getChatConn } = useConnStore(pinia);

// 初始化环信SDK
initChatSDK({
  appKey: APPKEY,
  isHttpDNS: false,
  url: URL,
  apiUrl: API_URL
});

// 获取IM实例
const conn = getChatConn();

// 绑定demo的事件监听
conn.addEventHandler("GROUP_EVENT", {
  onGroupEvent: (event) => {
    switch (event.operation) {
      case "acceptRequest":
        uni.showToast({
          icon: "none",
          title: `${i18n.global.t("joinedGroupNotice")}, id: ${event.id}`
        });
        break;
      case "destroy":
        uni.showToast({
          icon: "none",
          title: `${i18n.global.t("destroyGroupNotice")}, id: ${event.id}`
        });
        break;
      default:
        break;
    }
  }
});

export default conn;

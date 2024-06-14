import type { EasemobChatStatic } from "easemob-websdk/Easemob-chat";
//@ts-ignore
import { useConnStore } from "@/store/conn";
import pinia from "@/store/pinia";

const { getChatSDK } = useConnStore(pinia);

const websdk = getChatSDK();

const conn = new (websdk as EasemobChatStatic).connection({
  appKey: "easemob-demo#support",
  isHttpDNS: false,
  url: "wss://im-api-wechat.easemob.com/websocket",
  apiUrl: "https://a1.easemob.com"
});

export default conn;

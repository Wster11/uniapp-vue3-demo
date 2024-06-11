import type { EasemobChatStatic } from "easemob-websdk/Easemob-chat";
//@ts-ignore
import websdk from "easemob-websdk/uniApp/Easemob-chat.js";

const conn = new (websdk as EasemobChatStatic).connection({
  appKey: "easemob-demo#support",
  isHttpDNS: false,
  url: "wss://im-api-wechat.easemob.com/websocket",
  apiUrl: "https://a1.easemob.com"
});

export default conn;

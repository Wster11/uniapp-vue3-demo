import type { EasemobChatStatic } from "easemob-websdk/Easemob-chat";
import pinia from "./store/pinia";
//@ts-ignore
import websdk from "easemob-websdk/uniApp/Easemob-chat.js";
import {useConnStore} from "@/store/conn"

const conn = new (websdk as EasemobChatStatic).connection({
  appKey: "easemob-demo#support",
  isHttpDNS: false,
  url: "wss://im-api-wechat.easemob.com/websocket",
  apiUrl: "https://a1.easemob.com"
});

useConnStore(pinia).setChatConn(conn);


export default conn;

import type { EasemobChatStatic } from "easemob-websdk/Easemob-chat";
//@ts-ignore
import { useConnStore } from "@/store/conn";
import { APPKEY, API_URL, URL } from "@/const/index";
import pinia from "@/store/pinia";

const { getChatSDK } = useConnStore(pinia);

const websdk = getChatSDK();

const conn = new (websdk as EasemobChatStatic).connection({
  appKey: APPKEY,
  isHttpDNS: false,
  url: URL,
  apiUrl: API_URL
});

export default conn;

import { defineStore } from "pinia";
import type {
  EasemobChat,
  EasemobChatStatic
} from "easemob-websdk/Easemob-chat";

export const useConnStore = defineStore("conn", () => {
  let conn = null as unknown as EasemobChat.Connection;
  let sdk = null as unknown as EasemobChatStatic;
  /** 设置conn实例 */
  const setChatConn = (connection: EasemobChat.Connection) => {
    conn = connection;
  };

  /** 获取conn实例 */
  const getChatConn = (): EasemobChat.Connection => {
    if (conn) {
      return conn;
    }
    throw "conn is not initialized";
  };

  /** 设置 websdk */
  const setChatSDK = (websdk: EasemobChatStatic) => {
    sdk = websdk;
  };

  /** 获取 websdk */
  const getChatSDK = (): EasemobChatStatic => {
    if (sdk) {
      return sdk;
    }
    throw "conn is not initialized";
  };

  return {
    conn,
    setChatConn,
    getChatConn,
    setChatSDK,
    getChatSDK
  };
});

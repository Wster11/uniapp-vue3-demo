import { defineStore } from "pinia";
import type { EasemobChat } from "easemob-websdk/Easemob-chat";

export const useConnStore = defineStore("conn", () => {
  let conn = null as unknown as EasemobChat.Connection;
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

  return {
    conn,
    setChatConn,
    getChatConn
  };
});

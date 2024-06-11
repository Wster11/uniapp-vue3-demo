import { defineStore } from "pinia";
import { useConnStore } from "./conn";

export const useChatStore = defineStore("chat", () => {
  const { getChatConn } = useConnStore();
  const conn = getChatConn();

  /** 登录参数类型 */
  type LoginParams = Parameters<typeof conn.open>[0];

  const login = (p: LoginParams) => {
    return conn.open(p);
  };

  return {
    conn,
    login,
    getChatConn
  };
});

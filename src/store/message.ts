import { defineStore } from "pinia";

export const useMessageStore = defineStore("message", {
  state: () => {
    return { messageList: [] };
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++;
    }
  }
});

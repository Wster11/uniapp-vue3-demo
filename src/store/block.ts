import { defineStore } from "pinia";
import { ref } from "vue";
import { useConnStore } from "./conn";

export const useBlockStore = defineStore("block", () => {
  const blockList = ref<string[]>([]);
  const conn = useConnStore().getChatConn();

  const getBlockList = () => {
    conn.getBlocklist().then((res) => {
      blockList.value = res.data || [];
    });
  };

  const blockUser = (userId: string) => {
    return conn
      .addUsersToBlocklist({
        name: userId
      })
      .then((res) => {
        blockList.value.unshift(userId);
        return res;
      });
  };

  const unBlockUser = (userId: string) => {
    return conn
      .removeUserFromBlocklist({
        name: userId
      })
      .then((res) => {
        const index = blockList.value.findIndex((item) => item === userId);
        if (index !== -1) {
          blockList.value.splice(index, 1);
        }
        return res;
      });
  };

  return {
    blockList,
    blockUser,
    unBlockUser,
    getBlockList
  };
});

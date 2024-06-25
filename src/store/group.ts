import { defineStore } from "pinia";
import { useConnStore } from "./conn";
import { ref } from "vue";
import type { EasemobChat } from "easemob-websdk/Easemob-chat";

export const useGroupStore = defineStore("group", () => {
  const joinedGroupList = ref<EasemobChat.BaseGroupInfo[]>([]);

  const viewedGroupInfo = ref<EasemobChat.BaseGroupInfo>(
    {} as EasemobChat.BaseGroupInfo
  );

  const { getChatConn } = useConnStore();
  const conn = getChatConn();

  type GetJoinedGroupListParams = Parameters<typeof conn.getJoinedGroups>[0];

  type CreateGroupParams = Parameters<typeof conn.createGroup>[0];

  const getJoinedGroupListParams = ref<GetJoinedGroupListParams>({
    pageSize: 50,
    pageNum: 1
  });

  const getJoinedGroupList = () => {
    conn.getJoinedGroups(getJoinedGroupListParams.value).then((res) => {
      if (res.data) {
        joinedGroupList.value.push(
          ...(res.data as EasemobChat.BaseGroupInfo[])
        );
      }
    });
  };

  const applyJoinGroup = (groupId: string) => {
    return conn
      .joinGroup({
        groupId: groupId,
        message: "apply join group"
      })
      .then((res) => {
        return res;
      });
  };

  const createGroup = (params: CreateGroupParams) => {
    return conn
      .createGroup({
        ...params
      })
      .then((res) => {
        joinedGroupList.value.unshift({
          groupid: res?.data?.groupid || "",
          groupname: params.data.groupname
        });
        return res;
      });
  };

  const destroyGroup = (groupId: string) => {
    return conn
      .destroyGroup({
        groupId
      })
      .then((res) => {
        let index = joinedGroupList.value.findIndex(
          (group) => group.groupid === groupId
        );
        if (index !== -1) {
          joinedGroupList.value.splice(index, 1);
        }
        return res;
      });
  };

  const setViewedGroupInfo = (group: EasemobChat.BaseGroupInfo) => {
    viewedGroupInfo.value = group;
  };

  const clear = () => {
    joinedGroupList.value = [];
    viewedGroupInfo.value = {} as EasemobChat.BaseGroupInfo;
  };

  return {
    joinedGroupList,
    getJoinedGroupListParams,
    viewedGroupInfo,
    destroyGroup,
    setViewedGroupInfo,
    getJoinedGroupList,
    applyJoinGroup,
    createGroup,
    clear
  };
});

import { defineStore } from "pinia";
import { useConnStore } from "./conn";
import { useAppUserStore } from "./appUser";
import { ref } from "vue";
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import type { GroupNotice } from "@/types/index";
import { DEFAULT_GROUP_MEMBER_COUNT } from "@/const/index";

export const useGroupStore = defineStore("group", () => {
  const joinedGroupList = ref<EasemobChat.GroupInfo[]>([]);
  /** 群组详情Map */
  const groupDetailMap = ref<Map<string, EasemobChat.GroupDetailInfo>>(
    new Map()
  );

  const groupNotices = ref<GroupNotice[]>([]);

  const appUserStore = useAppUserStore();

  const { getUsersInfo } = appUserStore;

  const viewedGroupInfo = ref<EasemobChat.GroupInfo>(
    {} as EasemobChat.GroupInfo
  );

  const { getChatConn } = useConnStore();
  const conn = getChatConn();

  type GetJoinedGroupListParams = Parameters<typeof conn.getJoinedGroups>[0];

  type CreateGroupParams = Parameters<typeof conn.createGroup>[0];
  // 是否已获取完全部已加入群组
  const isJoinedGroupListLast = ref(true);
  const getJoinedGroupListParams = ref<GetJoinedGroupListParams>({
    pageSize: 20, // 最大支持20
    pageNum: 0,
    needAffiliations: true,
    needRole: true
  });

  /** 获取已加入的群组 */
  const getJoinedGroupList = () => {
    conn.getJoinedGroups(getJoinedGroupListParams.value).then((res) => {
      if (res.entities) {
        setJoinedGroupList(res.entities as EasemobChat.GroupInfo[]);
        if (res.entities.length < getJoinedGroupListParams.value.pageSize) {
          isJoinedGroupListLast.value = true;
        } else {
          getJoinedGroupListParams.value.pageNum++;
          getJoinedGroupList();
        }
      }
    });
  };

  /** 设置已加入的群列表 */
  const setJoinedGroupList = (groups: EasemobChat.GroupInfo[]) => {
    let currentGroupIds = joinedGroupList.value.map((item) => item.groupId);
    let filterJoinedGroups = groups.filter(
      ({ groupId }) => !currentGroupIds.find((id) => id === groupId)
    );

    filterJoinedGroups.forEach((groupItem) => {
      joinedGroupList.value.push(groupItem);
    });
  };

  /** 申请加入群组 */
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

  /** 创建群组 */
  const createGroup = (params: CreateGroupParams) => {
    return conn
      .createGroup({
        ...params
      })
      .then((res) => {
        joinedGroupList.value.unshift({
          groupId: res?.data?.groupid || "",
          groupName: params.data.groupname,
          role: "owner",
          disabled: false,
          public: params.data.public
        } as EasemobChat.GroupInfo);
        return res;
      });
  };
  /** 删除Store中的群组 */
  const removeStoreGroup = (groupId: string) => {
    let index = joinedGroupList.value.findIndex(
      (group) => group.groupId === groupId
    );
    if (index !== -1) {
      joinedGroupList.value.splice(index, 1);
    }
  };

  /** 删除Store中的群组成员 */
  const removeStoreGroupUser = (groupId: string, userIds: string[]) => {
    let group = groupDetailMap.value.get(groupId);
    if (group) {
      group.affiliations = group.affiliations.filter((affiliation) => {
        //@ts-ignore
        return !userIds.includes(affiliation.member || affiliation.owner);
      });
      group.affiliations_count = group.affiliations_count - userIds.length;
      groupDetailMap.value.set(groupId, group);
    }
  };

  /** 解散群组 */
  const destroyGroup = (groupId: string) => {
    return conn
      .destroyGroup({
        groupId
      })
      .then((res) => {
        removeStoreGroup(groupId);
        return res;
      });
  };

  /** 获取群组详情 */
  const getGroupInfo = (groupId: string | string[]) => {
    return conn
      .getGroupInfo({
        groupId
      })
      .then((res) => {
        res.data?.forEach((info) => {
          groupDetailMap.value.set(info.id, info);
          // 获取默认展示的群组成员属性
          const userIdList = info.affiliations
            .map((affiliation) => {
              return affiliation.member || affiliation.owner;
            })
            .slice(0, DEFAULT_GROUP_MEMBER_COUNT);
          // 获取群组成员的用户属性
          getUsersInfo({
            userIdList
          });
        });
        return res;
      });
  };

  /** 添加群组通知 */
  const addGroupNotice = (event: GroupNotice) => {
    groupNotices.value.unshift(event);
  };

  const setViewedGroupInfo = (group: EasemobChat.GroupInfo) => {
    viewedGroupInfo.value = group;
  };

  /** 邀请加入群组 */
  const inviteJoinGroup = (groupId: string, members: string[]) => {
    return conn.inviteUsersToGroup({
      groupId,
      users: members
    });
  };

  /** 移除群组成员 */
  const removeUserFromGroup = (groupId: string, members: string[]) => {
    return conn
      .removeGroupMembers({
        groupId,
        users: members
      })
      .then((res) => {
        removeStoreGroupUser(groupId, members);
        return res;
      });
  };

  const clear = () => {
    joinedGroupList.value = [];
    groupNotices.value = [];
    groupDetailMap.value.clear();
    viewedGroupInfo.value = {} as EasemobChat.GroupInfo;
  };

  return {
    joinedGroupList,
    getJoinedGroupListParams,
    viewedGroupInfo,
    groupNotices,
    groupDetailMap,
    destroyGroup,
    setViewedGroupInfo,
    getJoinedGroupList,
    applyJoinGroup,
    createGroup,
    getGroupInfo,
    setJoinedGroupList,
    addGroupNotice,
    removeStoreGroup,
    inviteJoinGroup,
    removeUserFromGroup,
    clear
  };
});

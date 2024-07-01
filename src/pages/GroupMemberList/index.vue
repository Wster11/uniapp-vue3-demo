<template>
  <view class="group-members-wrap">
    <view class="content">
      <label
        class="uni-list-cell uni-list-cell-pd"
        v-for="item in list"
        :key="item.owner || item.member"
      >
        <view class="user-item-wrap">
          <Avatar
            :src="getUserInfoFromStore(item.owner || item.member).avatar"
            :placeholder="defaultAvatar"
          />
          <view class="user-name">{{
            getUserInfoFromStore(item.owner || item.member).name
          }}</view>
        </view>
      </label>
    </view>
  </view>
</template>

<script lang="ts" setup>
import Avatar from "@/components/avatar/index.vue";
import { useGroupStore } from "@/store/group";
import { useAppUserStore } from "@/store/appUser";
import defaultAvatar from "@/static/images/defaultAvatar.png";
import { ref, computed, watch } from "vue";
import { onLoad } from "@dcloudio/uni-app";

const groupStore = useGroupStore();
const groupId = ref("");
const appUserStore = useAppUserStore();

const { getUserInfoFromStore, getUsersInfo } = appUserStore;

const groupDetail = computed(() => {
  return groupStore.groupDetailMap.get(groupId.value);
});

const list = computed(() => {
  return groupDetail.value?.affiliations || [];
});

const total = list.value.length;

// 单次最多获取100个用户属性
const pageSize = 100;

const getGroupMembersInfo = () => {
  // TODO: 分页请求用户信息
  if (total < pageSize) {
    //@ts-ignore
    getUsersInfo(list.value.map((item) => item.owner || item.member));
  }
};

watch(
  list,
  () => {
    getGroupMembersInfo();
  },
  {
    immediate: true
  }
);

onLoad(async (option) => {
  groupId.value = option?.id;
});
</script>

<style lang="scss" scoped>
@import url("./style.scss");
</style>

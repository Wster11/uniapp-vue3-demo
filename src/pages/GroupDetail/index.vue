<template>
  <view class="group-detail-wrap" v-if="groupDetail?.id">
    <view class="group-base-wrap">
      <Avatar class="group-avatar" src="" :placeholder="defaultGroupAvatar" />
      <view>
        <view class="groupname">{{ groupDetail?.name }}</view>
        <view class="group-id"
          >GroupId: {{ groupDetail?.id }}（{{
            groupDetail?.public ? $t("publicGroup") : $t("privateGroup")
          }}）</view
        >
      </view>
    </view>
    <view class="group-member-wrap">
      <view class="group-owner-wrap">
        <view class="label">
          {{ $t("owner") }}
        </view>
        <view>{{ groupDetail?.owner }}</view>
      </view>
      <view class="member-count-wrap">
        <view class="label">
          {{ $t("groupMember") }}
        </view>
        <view class="member-count">{{ groupDetail?.affiliations_count }}</view>
      </view>

      <view class="member-items-wrap">
        <view
          class="member-item"
          v-for="item in groupDetail?.affiliations"
          :key="item.joined_time"
        >
          <Avatar class="avatar1" src="" :placeholder="defaultAvatar" />
          <view v-if="item.owner" class="user-id">{{ item.owner }}</view>
          <view v-if="item.member" class="user-id">{{ item.member }}</view>
        </view>
        <view v-if="isGroupOwner" class="opt-item" @tap="toInviteList">
          <Avatar class="avatar1" src="" :placeholder="addAvatar" />
        </view>
        <view v-if="isGroupOwner" class="opt-item" @tap="toRemoveList">
          <Avatar class="avatar1" src="" :placeholder="delAvatar" />
        </view>
      </view>
    </view>
    <view class="group-desc-wrap">
      <view class="label">{{ $t("groupDesc") }}</view>
      <view class="desc">{{ groupDetail?.description }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import Avatar from "@/components/avatar/index.vue";
import { useGroupStore } from "@/store/group";
import { useConnStore } from "@/store/conn";
import defaultGroupAvatar from "@/static/images/defaultGroupAvatar.png";
import defaultAvatar from "@/static/images/defaultAvatar.png";
import addAvatar from "@/static/images/add_contacts.png";
import delAvatar from "@/static/images/del_contacts.png";
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";

const groupId = ref("");
const groupStore = useGroupStore();
const connStore = useConnStore();

const { getGroupInfo } = groupStore;

const groupDetail = computed(() => {
  return groupStore.groupDetailMap.get(groupId.value);
});

const toInviteList = () => {
  uni.navigateTo({
    url: `/pages/InviteList/index?id=${groupId.value}&type=invite`
  });
};

const toRemoveList = () => {
  uni.navigateTo({
    url: `/pages/InviteList/index?id=${groupId.value}&type=remove`
  });
};

const isGroupOwner = computed(() => {
  return groupDetail.value?.owner === connStore.getChatConn().user;
});

onLoad(async (option) => {
  try {
    uni.showLoading();
    groupId.value = option?.id;
    await getGroupInfo(groupId.value);
    uni.hideLoading();
  } catch (error) {
    console.error(error);
    uni.hideLoading();
  }
});
</script>

<style lang="scss" scoped>
@import url("./style.scss");
</style>

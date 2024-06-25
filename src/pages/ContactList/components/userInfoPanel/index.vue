<template>
  <view class="user-wrap">
    <view class="user-header-wrap">
      <view @tap="resetClearViewedUserInfo" class="back">{{ "<" }}</view>
      <view class="title">{{ "好友详情" }}</view>
    </view>

    <view class="user-info-wrap">
      <Avatar class="avatar" src="" :placeholder="defaultAvatar" />
      <view>
        <view class="remark">{{ contactStore.viewedUserInfo.userId }}</view>
        <view class="user-id">{{ contactStore.viewedUserInfo.userId }}</view>
      </view>
    </view>

    <view class="user-remark-wrap">
      <view
        >备注名:
        <span>{{ editRemark ? "" : contactStore.viewedUserInfo.remark }}</span>
      </view>
      <input
        class="remark-input"
        v-if="editRemark"
        @confirm="setRemark"
        placeholder="请输入备注名"
        v-model="remarkValue"
      />
      <view v-else @tap="editRemark = true">{{ "编辑" }}</view>
    </view>

    <view class="user-block-wrap">
      <view>黑名单:</view>
      <switch :checked="isBlockUser" @change="switchChange" />
    </view>

    <view class="user-opt-wrap">
      <button class="opt-btn" type="primary" @tap="goChat">发送消息</button>
      <button class="opt-btn" type="warn" @tap="deleteContact">删除好友</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import Avatar from "@/components/avatar/index.vue";
import defaultAvatar from "@/static/images/defaultAvatar.png";
import defaultGroupAvatar from "@/static/images/defaultGroupAvatar.png";
import { useContactStore } from "@/store/contact";
import { useBlockStore } from "@/store/block";
import { useGroupStore } from "@/store/group";
import { ref, onUnmounted } from "vue";
import type { EasemobChat } from "easemob-websdk";
import { computed } from "vue";
const contactStore = useContactStore();
const { blockList, blockUser, unBlockUser } = useBlockStore();
const remarkValue = ref("");
const editRemark = ref(false);
const isBlockUser = computed(() => {
  return blockList.includes(contactStore.viewedUserInfo.userId);
});

const resetClearViewedUserInfo = () => {
  contactStore.setViewedUserInfo({
    userId: "",
    remark: ""
  });
};

const setRemark = async () => {
  await contactStore.setContactRemark(
    contactStore.viewedUserInfo.userId,
    remarkValue.value
  );
  contactStore.setViewedUserInfo({
    userId: contactStore.viewedUserInfo.userId,
    remark: remarkValue.value
  });
  editRemark.value = false;
};

const switchChange = (e: any) => {
  if (e.detail.value) {
    blockUser(contactStore.viewedUserInfo.userId);
  } else {
    unBlockUser(contactStore.viewedUserInfo.userId);
  }
};

const goChat = () => {
  uni.navigateTo({
    url: `../../pages/Chat/index?type=singleChat&id=${contactStore.viewedUserInfo.userId}`
  });
  resetClearViewedUserInfo();
};

const deleteContact = () => {
  contactStore.deleteContact(contactStore.viewedUserInfo.userId).then(() => {
    uni.showToast({
      title: "删除成功"
    });
  });
};
</script>

<style lang="scss" scoped>
.user-wrap {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgb(248, 248, 248);
  z-index: 100;
}
.user-header-wrap {
  display: flex;
  align-items: center;
  background: #fff;
}
.back {
  width: 40rpx;
  flex-shrink: 0;
  margin: 0 20rpx;
  font-size: 40rpx;
}

.title {
  width: 100%;
  text-align: center;
  padding-right: 40rpx;
}
.avatar {
  margin-right: 30rpx;
}
.user-info-wrap {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #fff;
  margin-top: 20rpx;
}

.user-remark-wrap {
  display: flex;
  margin-top: 20rpx;
  align-items: center;
  background: #fff;
  padding: 20rpx;
  justify-content: space-between;
}

.user-block-wrap {
  display: flex;
  margin-top: 20rpx;
  align-items: center;
  background: #fff;
  padding: 20rpx;
  justify-content: space-between;
}

.remark {
  font-size: 36rpx;
}

.user-id {
  color: #999;
  font-size: 28rpx;
}

.user-opt-wrap {
  margin-top: 50rpx;
  font-size: 36rpx;
}
.opt-btn {
  margin-top: 20rpx;
}
</style>

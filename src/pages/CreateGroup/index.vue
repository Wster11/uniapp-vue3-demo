<template>
  <view class="create-group-wrap">
    <checkbox-group class="uni-list" @change="checkboxChange">
      <label
        class="uni-list-cell uni-list-cell-pd"
        v-for="item in contacts"
        :key="item.userId"
      >
        <view>
          <checkbox :value="item.userId"></checkbox>
        </view>
        <view class="user-item-wrap">
          <Avatar src="" :placeholder="defaultAvatar" />
          <view class="user-id">{{ item.userId }}</view>
        </view>
      </label>
    </checkbox-group>
    <view @tap="newGroup" class="create-btn">{{ $t("createGroup") }}</view>
  </view>
</template>

<script lang="ts" setup>
import Avatar from "@/components/avatar/index.vue";
import { useContactStore } from "@/store/contact";
import { useGroupStore } from "@/store/group";
import defaultAvatar from "@/static/images/defaultAvatar.png";
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { getContacts, contacts } = useContactStore();
const { createGroup } = useGroupStore();

const checkedUserIdList = ref<string[]>([]);

const checkboxChange = (e: any) => {
  checkedUserIdList.value = e.detail.value;
};

const newGroup = () => {
  if (checkedUserIdList.value.length === 0) {
    uni.showToast({
      icon: "none",
      title: t("selectContact")
    });
    return;
  }
  createGroup({
    data: {
      groupname: checkedUserIdList.value.join(","),
      members: checkedUserIdList.value,
      desc: `${Date.now()} group desc`,
      public: true,
      allowinvites: true,
      inviteNeedConfirm: false,
      approval: false,
      maxusers: 500
    }
  })
    .then(() => {
      uni.showToast({
        icon: "none",
        title: t("createGroupSuccess")
      });
      uni.navigateBack();
    })
    .catch((e) => {
      uni.showToast({
        icon: "none",
        title: e.message
      });
    });
};

onMounted(() => {
  if (contacts.length === 0) {
    getContacts();
  }
});
</script>

<style lang="scss" scoped>
@import url("./style.scss");
</style>

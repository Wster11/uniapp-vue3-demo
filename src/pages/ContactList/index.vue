<template>
  <view class="contact-list-wrap">
    <UserInfoPanel v-if="contactStore.viewedUserInfo.userId" />
    <GroupInfoPanel v-if="groupStore.viewedGroupInfo.groupid" />
    <ContactSearch
      v-if="isShowSearchPanel"
      :searchType="isSearchContact ? 'contact' : 'group'"
      @onCancel="onSearchCancel"
    />
    <view v-else>
      <view class="contact-search menu-item">
        <view @tap="searchContact"> + {{ $t("addContact") }}</view>
      </view>
      <view class="contact-search menu-item">
        <view @tap="searchGroup"> + {{ $t("addGroup") }}</view>
      </view>
      <view class="menu-item">
        <view @tap="toCreateGroup"> + {{ $t("createGroup") }}</view>
      </view>
      <view class="menu-item" @tap="toContactNotices">
        > {{ $t("contactNotice") }}
        {{
          contactStore.contactsNotices.length > 0
            ? `(${contactStore.contactsNotices.length})`
            : ""
        }}
      </view>
      <view class="menu-item">{{ $t("blockList") }}</view>
      <view
        class="item-wrap"
        v-for="blockUserId in blockStore.blockList"
        :key="blockUserId"
      >
        <Avatar src="" :placeholder="defaultAvatar" />
        <view class="item-id">{{ blockUserId }}</view>
      </view>
      <view class="menu-item">{{ $t("contact") }}</view>
      <view class="items-wrap">
        <view
          class="item-wrap"
          v-for="contact in contactStore.contacts"
          :key="contact.userId"
          @tap="viewUserInfo(contact)"
        >
          <Avatar src="" :placeholder="defaultAvatar" />
          <view class="item-id">{{ contact.userId }}</view>
        </view>
      </view>
      <view class="menu-item">
        {{ $t("groupList") }}
      </view>
      <view class="items-wrap">
        <view
          class="item-wrap"
          v-for="group in groupStore.joinedGroupList"
          :key="group.groupid"
          @tap="viewGroupInfo(group)"
        >
          <Avatar src="" :placeholder="defaultGroupAvatar" />
          <view class="item-id">{{ group.groupid }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Avatar from "@/components/avatar/index.vue";
import ContactSearch from "./components/contactSearch/index.vue";
import type { EasemobChat } from "easemob-websdk";
import defaultAvatar from "@/static/images/defaultAvatar.png";
import defaultGroupAvatar from "@/static/images/defaultGroupAvatar.png";
import UserInfoPanel from "./components/userInfoPanel/index.vue";
import GroupInfoPanel from "./components/groupInfoPanel/index.vue";
import { useBlockStore } from "@/store/block";
import { useContactStore } from "@/store/contact";
import { useGroupStore } from "@/store/group";
import { ref } from "vue";

// 是否是搜索联系人
const isSearchContact = ref(true);
const isShowSearchPanel = ref(false);

const blockStore = useBlockStore();
const contactStore = useContactStore();
const groupStore = useGroupStore();

const { setViewedUserInfo } = contactStore;

const { setViewedGroupInfo } = groupStore;

const searchContact = () => {
  isSearchContact.value = true;
  isShowSearchPanel.value = true;
};

const searchGroup = () => {
  isSearchContact.value = false;
  isShowSearchPanel.value = true;
};

const onSearchCancel = () => {
  isShowSearchPanel.value = false;
};

const toContactNotices = () => {
  uni.navigateTo({
    url: `../../pages/ContactNotices/index`
  });
};

const toCreateGroup = () => {
  uni.navigateTo({
    url: `../../pages/CreateGroup/index`
  });
};

const viewUserInfo = (contact: EasemobChat.ContactItem) => {
  setViewedUserInfo(contact);
};

const viewGroupInfo = (group: EasemobChat.BaseGroupInfo) => {
  setViewedGroupInfo(group);
};
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>

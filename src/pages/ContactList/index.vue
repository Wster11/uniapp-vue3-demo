<template>
  <view class="contact-list-wrap">
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
      <view class="menu-item" @tap="toContactNotices">
        > {{ $t("好友通知") }} 
        {{ contactsNotices.length > 0 ? `(${contactsNotices.length})` : "" }}
      </view>
      <view class="menu-item">
        {{ $t("groupList") }}
      </view>
      <view class="items-wrap">
        <view
          class="item-wrap"
          v-for="group in joinedGroupList"
          :key="group.groupid"
          @tap="goChat('groupChat', group.groupid)"
        >
          <Avatar src="" :placeholder="defaultGroupAvatar" />
          <view class="item-id">{{ group.groupid }}</view>
        </view>
      </view>
      <view class="menu-item">{{ $t("contact") }}</view>
      <view class="items-wrap">
        <view
          class="item-wrap"
          v-for="contact in contacts"
          :key="contact.userId"
          @tap="goChat('singleChat', contact.userId)"
        >
          <Avatar src="" :placeholder="defaultAvatar" />
          <view class="item-id">{{ contact.userId }}</view>
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
import { onMounted } from "vue";
import { useContactStore } from "@/store/contact";
import { useGroupStore } from "@/store/group";
import { ref } from "vue";

// 是否是搜索联系人
const isSearchContact = ref(true);
const isShowSearchPanel = ref(false);

const { getContacts, contacts, contactsNotices } = useContactStore();
const { joinedGroupList, getJoinedGroupList } = useGroupStore();

const goChat = (chatType: EasemobChat.ChatType, toId: string) => {
  uni.navigateTo({
    url: `../../pages/Chat/index?type=${chatType}&id=${toId}`
  });
};

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

onMounted(() => {
  if (contacts.length === 0) {
    getContacts();
  }

  if (joinedGroupList.length === 0) {
    getJoinedGroupList();
  }
});
</script>
<style lang="scss" scoped>
@import url("./style.scss");
</style>

import { defineStore } from "pinia";
import { useConnStore } from "./conn";
import { useAppUserStore } from "./appUser";
import { ref } from "vue";
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import type { ContactNotice } from "@/types/index";

export const useContactStore = defineStore("contact", () => {
  const appUserStore = useAppUserStore();
  const contacts = ref<EasemobChat.ContactItem[]>([]);

  const contactsNotices = ref<ContactNotice[]>([]);

  const viewedUserInfo = ref<EasemobChat.ContactItem>(
    {} as EasemobChat.ContactItem
  );

  const connStore = useConnStore();
  const { getChatConn } = connStore;
  const conn = getChatConn();
  const { getUsersInfo } = appUserStore;

  /** 获取全部联系人 */
  const getContacts = () => {
    conn.getAllContacts().then((res) => {
      if (res.data) {
        getUsersInfo({
          userIdList: res.data.map((item) => item.userId)
        });
        contacts.value.push(...res.data);
      }
    });
  };

  /** 添加好友 */
  const addContact = (userId: string) => {
    return conn.addContact(userId, "apply join contact").then((res) => {
      return res;
    });
  };

  /** 删除好友 */
  const deleteContact = (userId: string) => {
    return conn.deleteContact(userId).then((res) => {
      deleteStoreContact(userId);
      return res;
    });
  };

  /** 拒绝好友申请 */
  const declineContactInvite = (userId: string) => {
    return conn.declineContactInvite(userId).then((res) => {
      return res;
    });
  };

  /** 接受好友申请 */
  const acceptContactInvite = (userId: string) => {
    return conn.acceptContactInvite(userId).then((res) => {
      return res;
    });
  };

  /** push 好友通知 */
  const addContactNotice = (msg: ContactNotice) => {
    contactsNotices.value.unshift(msg);
  };

  /** 删除store中的联系人 */
  const deleteStoreContact = (userId: string) => {
    const index = contacts.value.findIndex((item) => item.userId === userId);
    if (index !== -1) {
      contacts.value.splice(index, 1);
    }
  };

  /** 添加store的联系人 */
  const addStoreContact = (user: EasemobChat.ContactItem) => {
    contacts.value.unshift(user);
  };

  const setViewedUserInfo = (user: EasemobChat.ContactItem) => {
    viewedUserInfo.value = user;
  };

  /** 设置联系人备注 */
  const setContactRemark = (userId: string, remark: string) => {
    return conn
      .setContactRemark({
        userId,
        remark
      })
      .then((res) => {
        const index = contacts.value.findIndex(
          (item) => item.userId === userId
        );
        if (index !== -1) {
          contacts.value[index].remark = remark;
        }
        return res;
      });
  };

  const clear = () => {
    contacts.value = [];
    contactsNotices.value = [];
    viewedUserInfo.value = {} as EasemobChat.ContactItem;
  };

  return {
    contacts,
    contactsNotices,
    viewedUserInfo,
    getContacts,
    addContact,
    deleteContact,
    addContactNotice,
    declineContactInvite,
    acceptContactInvite,
    addStoreContact,
    setViewedUserInfo,
    setContactRemark,
    clear
  };
});

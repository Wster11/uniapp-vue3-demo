import { defineStore } from "pinia";
import { useConnStore } from "./conn";
import { ref } from "vue";
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import type { ContactNotice } from "@/types/index";

export const useContactStore = defineStore("contact", () => {
  const contacts = ref<EasemobChat.ContactItem[]>([]);

  const contactsNotices = ref<ContactNotice[]>([]);

  const viewedUserInfo = ref<EasemobChat.ContactItem>(
    {} as EasemobChat.ContactItem
  );

  const { getChatConn } = useConnStore();
  const conn = getChatConn();

  const getContacts = () => {
    conn.getAllContacts().then((res) => {
      if (res.data) {
        contacts.value.push(...res.data);
      }
    });
  };

  const addContact = (userId: string) => {
    return conn.addContact(userId, "apply join contact").then((res) => {
      return res;
    });
  };

  const deleteContact = (userId: string) => {
    return conn.deleteContact(userId).then((res) => {
      deleteStoreContact(userId);
      return res;
    });
  };

  const declineContactInvite = (userId: string) => {
    return conn.declineContactInvite(userId).then((res) => {
      return res;
    });
  };

  const acceptContactInvite = (userId: string) => {
    return conn.acceptContactInvite(userId).then((res) => {
      return res;
    });
  };

  const addContactNotice = (msg: ContactNotice) => {
    contactsNotices.value.unshift(msg);
  };

  const deleteStoreContact = (userId: string) => {
    const index = contacts.value.findIndex((item) => item.userId === userId);
    if (index !== -1) {
      contacts.value.splice(index, 1);
    }
  };

  const addStoreContact = (user: EasemobChat.ContactItem) => {
    contacts.value.unshift(user);
  };

  const setViewedUserInfo = (user: EasemobChat.ContactItem) => {
    viewedUserInfo.value.userId = user.userId;
    viewedUserInfo.value.remark = user.remark;
  };

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

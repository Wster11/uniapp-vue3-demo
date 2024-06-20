import { defineStore } from "pinia";
import { useConnStore } from "./conn";
import { ref } from "vue";
import type { EasemobChat } from "easemob-websdk/Easemob-chat";
import type { ContactNotice } from "@/types/index";

export const useContactStore = defineStore("contact", () => {
  const contacts = ref<EasemobChat.ContactItem[]>([]);

  const contactsNotices = ref<ContactNotice[]>([]);

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

  const clear = () => {
    contacts.value = [];
  };

  return {
    contacts,
    contactsNotices,
    getContacts,
    addContact,
    addContactNotice,
    declineContactInvite,
    acceptContactInvite,
    clear
  };
});

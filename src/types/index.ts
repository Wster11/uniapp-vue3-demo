import type { EasemobChat } from "easemob-websdk/Easemob-chat";

type InputToolbarEvent = {
  onMessageSend: () => void;
  closeToolbar: () => void;
};

type ContactNotice = EasemobChat.ContactMsgBody & {
  ext: "invited" | "agreed" | "refused" | "deleted" | "added";
  time: number;
};

type GroupNotice = EasemobChat.GroupEvent & {
  time: number;
};

export type { InputToolbarEvent, ContactNotice, GroupNotice };

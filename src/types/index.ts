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

interface ContactNoticeInfo {
  list: ContactNotice[];
  unReadCount: number;
}

interface GroupNoticeInfo {
  list: GroupNotice[];
  unReadCount: number;
}

interface MessageNoticeInfo {
  type: "recall";
  ext: {
    recallFrom: string;
  };
}

type MixedMessageBody = EasemobChat.ExcludeAckMessageBody & {
  noticeInfo?: MessageNoticeInfo;
};

export type {
  InputToolbarEvent,
  ContactNotice,
  GroupNotice,
  ContactNoticeInfo,
  GroupNoticeInfo,
  MixedMessageBody
};

const CHAT_STORE = "chat";

const APPKEY = "easemob-demo#support"; // 环信appkey
const API_URL = "https://a1.easemob.com"; // 环信api地址
const URL = "wss://im-api-wechat.easemob.com/websocket"; // 环信websocket地址

const DEFAULT_GROUP_MEMBER_COUNT = 8; // 群组详情默认获取群成员详情的数量

const GET_GROUP_MEMBERS_PAGESIZE = 100; // 获取群组成员列表的每页数量

// Demo内部上传头像地址
const getInsideUploadUrl = (userId: string) => {
  return `https://a1-appserver.easemob.com/inside/app/user/${userId}/avatar/upload`;
};

export {
  CHAT_STORE,
  APPKEY,
  API_URL,
  URL,
  DEFAULT_GROUP_MEMBER_COUNT,
  GET_GROUP_MEMBERS_PAGESIZE,
  getInsideUploadUrl
};

const CHAT_STORE = "chat";

const APPKEY = "easemob#easeim"; // 环信appkey
const API_URL = "https://a1.easemob.com"; // 环信api地址
const URL = "wss://im-api-wechat.easemob.com/websocket"; // 环信websocket地址

// Demo内部上传头像地址
const getInsideUploadUrl = (userId: string) => {
  return `https://a1-appserver.easemob.com/inside/app/user/${userId}/avatar/upload`;
};

export { CHAT_STORE, APPKEY, API_URL, URL, getInsideUploadUrl };

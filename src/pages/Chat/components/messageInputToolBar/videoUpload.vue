<template>
  <view class="tool-video-wrap tool-item" @tap="chooseVideo">
    <ItemContainer :title="title" :iconUrl="ImageIcon"> </ItemContainer>
  </view>
</template>

<script lang="ts" setup>
import ItemContainer from "./itemContainer.vue";
import ImageIcon from "@/static/images/inputbar/tofeipeng/icons/img@2x.png";
import { useConnStore } from "@/store/conn";
import { useConversationStore } from "@/store/conversation";
import { useMessageStore } from "@/store/message";
import { API_URL } from "@/const/index";
import type { InputToolbarEvent } from "@/types/index";
import { inject } from "vue";
import { useI18n } from "vue-i18n";

interface Props {
  title?: string;
}
const props = defineProps<Props>();
const { t } = useI18n();

const title = t("videoUpload");

const toolbarInject = inject<InputToolbarEvent>("InputToolbarEvent");

const { getChatConn, getChatSDK } = useConnStore();

const { sendMessage } = useMessageStore();

const conn = getChatConn();

const SDK = getChatSDK();

const chooseVideo = () => {
  uni.chooseVideo({
    sourceType: ["camera", "album"],
    success: function (res) {
      console.log(res, "resresresres");
      sendVideoMessage(res);
    }
  });
};

const sendVideoMessage = (res: any) => {
  const tempFilePath = res?.tempFilePath;
  const uploadUrl = `${API_URL}/${conn.orgName}/${conn.appName}/chatfiles`;

  if (!tempFilePath) {
    return;
  }
  uni.showLoading();
  const token = conn.token;
  console.log(token, '  token')
  const requestParams = {
    url: uploadUrl,
    filePath: tempFilePath,
    fileType: "video",
    name: "file",
    header: {
      Authorization: "Bearer " + token
    },
    success: async (res: any) => {
      console.log("视频上传成功", res);
      const data = JSON.parse(res.data);
      const videoMsg = SDK.message.create({
        type: "video",
        to: useConversationStore().currConversation!.conversationId,
        chatType: useConversationStore().currConversation!.conversationType,
        file_length: res.duration,
        //@ts-ignore
        body: {
          url: data.uri + "/" + data.entities[0].uuid
        }
      });
      await sendMessage(videoMsg);
      toolbarInject?.onMessageSend();
      toolbarInject?.closeToolbar();
      uni.hideLoading();
    },
    fail: (e: any) => {
      console.log("视频上传失败", e);
      uni.hideLoading();
      uni.showToast({ title: "视频上传失败", icon: "none" });
    }
  };
  //@ts-ignore
  uni.uploadFile(requestParams);
};
</script>

<style lang="scss" scoped>
.tool-item {
  width: 25%;
  display: flex;
  justify-content: center;
}
</style>

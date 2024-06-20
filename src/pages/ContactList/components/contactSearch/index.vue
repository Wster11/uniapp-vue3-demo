<template>
  <view class="contact-search-wrap">
    <view class="search-title-wrap">
      <view @tap="onCancel" class="back">{{ "<" }}</view>
      <view class="title">{{
        searchType === "contact" ? $t("addContact") : $t("addGroup")
      }}</view>
    </view>
    <view class="input-content-wrap">
      <view class="input-wrap">
        <input
          v-model="inputValue"
          @confirm="search"
          :placeholder="$t('searchPlaceholder')"
        />
      </view>
      <view @tap="onCancel" class="cancel">取消</view>
    </view>

    <view class="search-content">
      <view v-if="!hasResult">{{ $t("searchNoContact") }}</view>
      <view v-else class="search-result">
        <view class="search-result-item">
          <view class="info-wrap">
            <Avatar
              src=""
              :placeholder="
                searchType === 'contact' ? defaultAvatar : defaultGroupAvatar
              "
            />
            <view class="user-id">{{ inputValue }}</view>
          </view>
          <view class="add" @tap="onAdd">
            {{ $t("add") }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Avatar from "@/components/avatar/index.vue";
import defaultAvatar from "@/static/images/defaultAvatar.png";
import defaultGroupAvatar from "@/static/images/defaultGroupAvatar.png";
import { useContactStore } from "@/store/contact";
import { useGroupStore } from "@/store/group";
import { ref } from "vue";

interface Props {
  searchType: "contact" | "group";
}

const props = defineProps<Props>();

const { searchType } = props;

const { addContact } = useContactStore();

const { applyJoinGroup } = useGroupStore();

const emits = defineEmits(["onCancel"]);

const inputValue = ref("");
const hasResult = ref(false);

const search = () => {
  hasResult.value = true;
};

const onCancel = () => {
  emits("onCancel");
};

const onAdd = () => {
  if (searchType === "contact") {
    addContact(inputValue.value);
    uni.showToast({
      title: "请求已经发送"
    });
  } else {
    applyJoinGroup(inputValue.value)
      .then(() => {
        uni.showToast({
          title: "请求已经发送"
        });
      })
      .catch((err) => {
        uni.showToast({
          icon: "none",
          title: err?.data?.error_description
        });
      });
  }
};
</script>

<style lang="scss" scoped>
.back {
  width: 40rpx;
  flex-shrink: 0;
  margin: 0 20rpx;
  font-size: 40rpx;
}

.input-wrap {
  margin-bottom: 0;
}

.search-title-wrap {
  display: flex;
  align-items: center;
}

.input-content-wrap {
  display: flex;
  align-items: center;
  margin: 20rpx;
}

.cancel {
  font-size: 30rpx;
  width: 100rpx;
  flex-shrink: 0;
  text-align: center;
  cursor: pointer;
}

.title {
  width: 100%;
  text-align: center;
  padding-right: 40rpx;
}

.search-content {
  color: #999;
  font-size: 30rpx;
  text-align: center;
  margin-top: 30rpx;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  justify-content: space-between;
}

.info-wrap {
  display: flex;
  align-items: center;
}

.user-id {
  margin: 0 20rpx;
  color: #000;
}

.add {
  padding: 0 20rpx;
  background: #479ff8;
  color: #fff;
  border-radius: 10rpx;
}
</style>

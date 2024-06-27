import { defineStore } from "pinia";
import { ref } from "vue";
import { useConnStore } from "./conn";
import type { EasemobChat } from "easemob-websdk";

export const useAppUserStore = defineStore("appUser", () => {
  const appUserInfo = ref<Map<string, EasemobChat.UpdateOwnUserInfoParams>>(
    new Map()
  );

  const conn = useConnStore().getChatConn();

  const getUsersInfo = (props: {
    userIdList: string[];
    withPresence?: boolean;
  }) => {
    const { userIdList, withPresence = true } = props;
    return new Promise((resolve, reject) => {
      const type = [
        "nickname",
        "avatarurl",
        "mail",
        "phone",
        "gender",
        "sign",
        "birth",
        "ext"
      ] as EasemobChat.ConfigurableKey[];
      if (userIdList.length === 0) {
        return;
      }
      conn
        .fetchUserInfoById(userIdList, type)
        .then((res) => {
          res.data &&
            Object.keys(res.data).forEach((key) => {
              const result = res.data?.[key] || {};
              appUserInfo.value.set(key, result);
            });

          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  const getUserInfoFromStore = (userId: string) => {
    const userInfo = appUserInfo.value.get(userId);
    return {
      name: userInfo?.nickname || userId,
      avatar: userInfo?.avatarurl || ""
    };
  };

  const clear = () => {
    appUserInfo.value.clear();
  };

  return {
    appUserInfo,
    getUserInfoFromStore,
    getUsersInfo,
    clear
  };
});

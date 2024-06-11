<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useConnStore } from "@/store/conn";
import conn from "./initIM";

onLaunch(() => {
  console.log("App Launch");
  // set Connection
  useConnStore().setChatConn(conn);
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});
</script>
<style>
@import url("./common.scss");
</style>

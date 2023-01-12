<template>
  <div class="login">
    <loginPanel></loginPanel>
  </div>
</template>

<script lang="ts" setup>
import loginPanel from './c-cpns/login-panel.vue'
import { reactive, ref } from 'vue'
</script>

<style scoped lang="less">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -20px;
  width: 100%;
  height: 100%;

  background: url('../../assets/images/login-bg.svg');
}
</style>

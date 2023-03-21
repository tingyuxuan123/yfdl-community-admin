<template>
  <div class="login-panel">
    <h1 class="title">后台管理系统</h1>
    <div class="tabs">
      <!-- 账号登录 -->
      <el-tabs type="border-card" v-model="activeName" stretch>
        <el-tab-pane label="密码登录" name="account">
          <template #label>
            <span class="account-tabs-label">
              <el-icon><UserFilled /></el-icon>
              <span>密码登录</span>
            </span>
          </template>
          <pane-account ref="accountRef"></pane-account>
        </el-tab-pane>
        <!-- 手机登录 -->
        <el-tab-pane label="邮箱登录" name="phone">
          <template #label>
            <span class="phone-tabs-label">
              <el-icon><Iphone /></el-icon>
              <span>邮箱登录</span>
            </span>
          </template>
          <pane-email ref="emailRef"></pane-email>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="controls">
      <el-checkbox v-model="isRememberPassword" label="记住密码" size="large" />
      <el-link type="primary">忘记密码</el-link>
    </div>
    <div class="login-btn">
      <el-button type="primary" @click="handleLoginBtnClick"
        >立即登录</el-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { localCache } from '@/utils/cache'
import { reactive, ref, watch } from 'vue'
import PaneAccount from './pane-account.vue'
import PaneEmail from './pane-email.vue'
const isRememberPassword = ref(
  localCache.getCache('isRememberPassword') ?? false
)
const activeName = ref('account')

const accountRef = ref<InstanceType<typeof PaneAccount>>()
const emailRef = ref<InstanceType<typeof PaneEmail>>()

watch(isRememberPassword, (newValue) => {
  localCache.setCache('isRememberPassword', newValue)
})

const handleLoginBtnClick = () => {
  if (activeName.value === 'account') {
    accountRef.value?.loginAction(isRememberPassword.value)
  } else {
    emailRef.value?.loginAction()
  }
}
</script>

<style scoped lang="scss">
.login-panel {
  width: 330px;
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  .tabs {
    .account-tabs-label,
    .phone-tabs-label {
      display: flex;
      align-items: center;
      justify-content: center;

      .el-icon {
        margin-right: 4px;
      }
    }
  }
  .controls {
    display: flex;
    justify-content: space-between;
  }

  .login-btn {
    button {
      width: 100%;
      height: 40px;
    }
  }
}
</style>

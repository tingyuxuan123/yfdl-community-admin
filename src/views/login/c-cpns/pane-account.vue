<template>
  <div class="pane-account">
    <el-form
      label-width="60"
      form="account"
      :rules="rules"
      :model="account"
      status-icon
      ref="formRef"
    >
      <el-form-item label="帐号" size="large" prop="name">
        <el-input v-model="account.name" />
      </el-form-item>
      <el-form-item label="密码" size="large" prop="password">
        <el-input type="password" v-model="account.password" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, type ElForm, type FormRules } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
// import useLoginStore from '@/stores/login/login'
import { localCache } from '@/utils/cache'
import { useUserStore } from '@/stores/userStore'

const CACHE_NAME = 'name'
const CACHE_PASSWORD = 'password'

const account = reactive({
  name: localCache.getCache(CACHE_NAME) ?? '',
  password: localCache.getCache(CACHE_PASSWORD) ?? ''
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '必须输入账号信息', trigger: 'blur' },
    {
      pattern: /^[a-z0-9]{2,12}$/,
      message: '长度必须是 2 到 12 位',
      trigger: 'change'
    }
  ],
  password: [
    { required: true, message: '须输入密码信息', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{3,}$/,
      message: '必须是大写小写或数组长度必须是三位以上',
      trigger: 'change'
    }
  ]
})

const formRef = ref<InstanceType<typeof ElForm>>()

const userStore = useUserStore()
const loginAction = (isRememberPassword: boolean) => {
  formRef.value?.validate((valid) => {
    if (valid) {
      const name = account.name
      const password = account.password
      userStore.loginAccountAction(name, password)

      if (isRememberPassword) {
        //如果记住密码为true 存储账号面
        localCache.setCache(CACHE_NAME, name)
        localCache.setCache(CACHE_PASSWORD, password)
      } else {
        localCache.removeCache(CACHE_NAME)
        localCache.removeCache(CACHE_PASSWORD)
      }
    } else {
      ElMessage({
        type: 'error',
        message: '请输入正确格式后再操作~~~'
      })
    }
  })
}

defineExpose({
  loginAction
})
</script>

<style scoped lang="scss">
.pane-account {
}
</style>

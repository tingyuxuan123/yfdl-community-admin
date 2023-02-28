<template>
  <div class="pane-phone">
    <el-form
      label-width="60"
      form="emailLogin"
      :rules="rules"
      :model="emailLogin"
      status-icon
      ref="formRef"
    >
      <el-form-item label="邮箱" size="large" prop="email">
        <el-input v-model="emailLogin.email" />
      </el-form-item>
      <el-form-item label="验证码" size="large" prop="code">
        <div class="verify-code">
          <el-input type="password" v-model="emailLogin.code" />
          <el-button
            class="get-btn"
            @click="handleSendCodeClick"
            type="primary"
            :disabled="!isCanSend"
          >
            <span v-if="isCanSend">验证码</span>
            <span v-else>{{ time }}</span>
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { loginOrRegisterByCode, sendEmail } from '@/api/login'
import { useUserStore } from '@/stores/userStore'
import type ElForm from 'element-plus/es/components/form'
import type { FormRules } from 'element-plus/es/tokens/form'
import { type } from 'os'
import { reactive, ref } from 'vue'

type EmailLogin = {
  email: string
  code: number
}

const emailLogin = reactive<EmailLogin>({
  email: '',
  code: null
})

const rules = reactive<FormRules>({
  email: [
    { required: true, message: '必须输入邮箱', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: '不符合邮箱规则',
      trigger: 'blur'
    }
  ],
  code: [
    { required: true, message: '须输入验证码', trigger: 'blur' },
    {
      pattern: /^[0-9]{6}$/,
      message: '必须是数字且长度为6位',
      trigger: 'change'
    }
  ]
})

const formRef = ref<InstanceType<typeof ElForm>>(null)
const isCanSend = ref(true)
const time = ref<number>(60)

const handleSendCodeClick = async () => {
  formRef.value.validateField('email', async (valid) => {
    if (valid) {
      time.value = 60
      //验证码登录
      isCanSend.value = false
      const timer = setInterval(() => {
        if (time.value <= 0) {
          clearInterval(timer)
          isCanSend.value = true
        }
        time.value -= 1
      }, 1000)

      const result = await sendEmail(emailLogin.email)
      // console.log(result)
    }
  })
}
const userStore = useUserStore()
const loginAction = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      userStore.loginEmailAction(emailLogin)
    }
  })
}

defineExpose({
  loginAction
})
</script>

<style scoped lang="scss">
.pane-phone {
}

.verify-code {
  display: flex;
  .get-btn {
    margin-left: 8px;
  }
}
</style>

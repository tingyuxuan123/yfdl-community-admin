import { defineStore } from 'pinia'
import { login, loginOrRegisterByCode } from '@/api/login'
import { ElMessage } from 'element-plus'
import router from '@/router'
export const useUserStore = defineStore('userStore', {
  state: () => {
    return {
      token: null,
      userInfo: {
        avatar: null,
        email: null,
        id: null,
        nickName: null,
        userName: null,
        sex: null,
        label: null
      }
    }
  },
  getters: {},
  actions: {
    async loginAccountAction(name: string, password: string) {
      const loginResult: any = await login(name, password)
      if (loginResult.code == 200) {
        this.token = loginResult.data.token
        this.userInfo = loginResult.data.userInfo

        ElMessage({
          showClose: true,
          message: '登录成功',
          type: 'success'
        })

        router.push('/layout')
      } else {
        ElMessage({
          showClose: true,
          message: loginResult.msg,
          type: 'error'
        })
      }
    },
    async loginEmailAction(emailLogin: any) {
      //验证码登录
      const loginResult: any = await loginOrRegisterByCode(emailLogin)
      if (loginResult.code == 200) {
        this.token = loginResult.data.token
        this.userInfo = loginResult.data.userInfo

        ElMessage({
          showClose: true,
          message: '登录成功',
          type: 'success'
        })

        router.push('/layout')
      } else {
        ElMessage({
          showClose: true,
          message: loginResult.msg,
          type: 'error'
        })
      }
    }
  },
  persist: true
})

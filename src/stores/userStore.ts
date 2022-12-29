import { defineStore } from 'pinia'

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
  actions: {},
  persist: true
})

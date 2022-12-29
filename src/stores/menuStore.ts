import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usemenuStore = defineStore('menuStore', {
  state: () => {
    return {
      isCollapse: false
    }
  },
  actions: {
    changeCollapse() {
      this.isCollapse = !this.isCollapse
    }
  },
  getters: {
    menuWith() {
      if (this.isCollapse) {
        return 'auto'
      } else {
        return '240px'
      }
    }
  },
  persist: true
})

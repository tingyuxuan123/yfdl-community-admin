import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import SvgIcon from '@/components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'
import './assets/styles/base.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import piniaPluginPersist from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersist) //使用持久化
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

app.component('svg-icon', SvgIcon)
app.use(mavonEditor)
app.use(store)
app.use(router)

app.mount('#app')

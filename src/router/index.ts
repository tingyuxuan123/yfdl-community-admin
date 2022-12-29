import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import login from '../views/login/login.vue'
import { useUserStore } from '@/stores/userStore'
import Layout from '@/views/Layout.vue'
import userInfo from '../views/main/userManage/userInfo.vue'
import { useRoutesStore } from '@/stores/routesStore'

// import panel from "../views/main/panel/index.vue"

export const constantRoutes: RouteRecordRaw[] = []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/layout/panel'
    },
    {
      path: '/layout',
      redirect: '/layout/panel'
    },
    {
      name: 'login',
      path: '/login',
      component: login
    },
    {
      name: 'layout',
      path: '/layout',
      component: Layout,
      children: constantRoutes
    }
  ]
})

//全局守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const routesStore = useRoutesStore()

  if (userStore.token || to.name == 'login') {
    if (routesStore.layoutRouter == undefined && to.name != 'login') {
      routesStore.GenerateRoutes(() => {
        next({ ...to, replace: true }) //若果to不能找到对应的路由的话，会重新加载beforeEach
      })
    } else {
      next()
    }

    // next()
  } else {
    const fullPath: string = encodeURIComponent(
      router.currentRoute.value.fullPath
    )
    //encodeURIComponent 转换url编码，防止解析时出现问题
    router.push('/login?redirectUrl=' + fullPath)
    // next()
  }
})

// router.afterEach((to,from)=>{
//   document.title=to.meta.title

// })

export default router

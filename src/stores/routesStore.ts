import { defineStore } from 'pinia'
import { constantRoutes } from '@/router/index'
import { getRouters } from '@/api/user'
import router from '@/router'
const modules = import.meta.glob('../views/main/*/*.vue')

export const useRoutesStore = defineStore('routesStore', {
  state: () => {
    return {
      layoutRouter: undefined,
      routes: [],
      addRoutes: [],
      defaultRoutes: [],
      topbarRouters: [], //面包屑
      sidebarRouters: [] // 面包屑
    }
  },
  getters: {},
  actions: {
    SET_ROUTES(routes: any) {
      //设置路由
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },
    SET_DEFAULT_ROUTES(routes: any) {
      this.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES(routes: any) {
      // 顶部导航菜单默认添加统计报表栏指向首页
      const index = [
        {
          path: 'index',
          meta: { title: '统计报表', icon: 'dashboard' }
        }
      ]
      this.topbarRouters = routes.concat(index)
    },
    SET_SIDEBAR_ROUTERS(routes: any) {
      this.sidebarRouters = routes
    },
    async GenerateRoutes(callback: Function) {
      const res = await getRouters()
      const routers = buildRouterTree(res.data.menus) //获取动态路由router

      //根路由
      let layout = {
        name: 'layout',
        path: '/layout',
        component: () => import('../views/Layout.vue'),
        children: [...routers]
      }

      router.addRoute(layout) //添加动态路由

      let router404 = {
        //设置4040
        name: '404',
        path: '/404',
        component: () => import('../views/404/idnex.vue')
      }
      let redirect404 = {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
      }

      router.addRoute(router404) //添加404界面
      router.addRoute(redirect404)
      // console.log(layout.children);
      this.layoutRouter = layout
      this.routes = layout.children
      // console.log(router.getRoutes());
      callback()
    }
  }
})

function buildRouterTree(menus: any) {
  //建立路由树

  let reChildren = []
  menus.forEach((item: Record<string, any>, index: number) => {
    if (item.status == '0') {
      let child: any
      if (item.children.length == 0) {
        child = {
          id: item.id,
          name: item.name,
          path: item.path,
          component: loadView(item.component),
          meta: getComponentMeta(item)
        }
      } else {
        child = {
          id: item.id,
          name: item.name,
          path: item.path,
          children: buildRouterTree(item.children),
          meta: getComponentMeta(item)
        }
      }
      reChildren.push(child)
    }
  })

  return reChildren
}
function getComponentMeta(menu: any) {
  //设置meta
  return {
    title: menu.menuName,
    display: menu.visible,
    icon: menu.icon,
    menuType: menu.menuType
  }
}

export const loadView = (view: string) => {
  return modules[`../views/${view}`]
}

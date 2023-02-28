<template>
  <el-breadcrumb separator-icon="ArrowRightBold">
    <el-breadcrumb-item v-for="item in topbar" :key="item.title">{{
      item.title
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup name="breadcrumb">
import { computed, reactive, ref } from 'vue'
import { useRoutesStore } from '@/stores/routesStore'
import { useRoute, useRouter } from 'vue-router'

let route = useRoute()

let routerStore = useRoutesStore()

let routers: any = routerStore.routes
// console.log(routers)

const topbar: any = computed(() => {
  let breadcrumb = []
  const pathArray = route.path.split('/')
  const pathName = pathArray[pathArray.length - 1]

  for (const menu of routers) {
    if (pathName === menu.path) {
      breadcrumb.push({ title: menu.meta.title, path: menu.path })
    } else {
      menu.children?.forEach((submenu: any) => {
        if (pathName === submenu.path) {
          breadcrumb.push({ title: menu.meta.title, path: menu.path })
          breadcrumb.push({ title: submenu.meta.title, path: submenu.path })
        }
      })
    }
  }

  return breadcrumb
})
</script>

<style scoped lang="less"></style>

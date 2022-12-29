<template>
  <el-breadcrumb separator-icon="ArrowRightBold">
    <el-breadcrumb-item>所在位置：首页</el-breadcrumb-item>
    <el-breadcrumb-item
      v-for="item in routerStore.topbarRouters"
      :key="item.title"
      >{{ item.title }}</el-breadcrumb-item
    >
    <!-- <el-breadcrumb-item>promotion list</el-breadcrumb-item>
    <el-breadcrumb-item>promotion detail</el-breadcrumb-item> -->
  </el-breadcrumb>
</template>

<script lang="ts" setup name="breadcrumb">
import { reactive, ref } from 'vue'
import { useRoutesStore } from '@/stores/routesStore'
import { useRoute, useRouter } from 'vue-router'

let route = useRoute()

let routerStore = useRoutesStore()

let links = route.fullPath.split('/') //获取路径
links.shift()
links.shift()
let routers: any = routerStore.routes
let topbar = []
// const setbreadcrumb=()=>{  //动态生成路径
//     links.forEach((item,index)=>{
//         console.log(routerStore.routes);

//         routers.forEach(element => {
//                 // if(element)
//             if(item==element.path){
//                 topbar.push({title:element.meta.title,path:element.path})
//                 routers=routers.children
//             }

//             });
//     })

//     routerStore.topbarRouters=topbar;

// }

// setbreadcrumb()
</script>

<style scoped lang="less"></style>

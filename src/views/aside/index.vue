<template>
  <el-menu
    active-text-color="#fff"
    background-color="#001529"
    :collapse="menuStore.isCollapse"
    class="el-menu-vertical-demo"
    :default-active="defaultActive"
    text-color="#ccc"
    :router="false"
    unique-opened
    @select="handleSelect"
  >
    <logoVue></logoVue>
    <!-- <DynamicMenus></DynamicMenus> -->

    <template v-for="(parent, index) in routerStore.routes">
      <el-sub-menu
        v-if="parent.children && parent.children.length > 0"
        v-show="parent.meta.display == '0'"
        :index="parent.id.toString()"
        :key="index"
      >
        <template #title>
          <svg-icon :icon-class="parent.meta.icon" />
          <span class="title">{{ parent.meta.title }}</span>
        </template>

        <el-menu-item
          :index="item.name"
          v-for="item in parent.children"
          v-show="item.meta.display == '0'"
          :key="item.name"
        >
          <svg-icon :icon-class="item.meta.icon" />
          <template #title
            ><span class="title">{{ item.meta.title }}</span></template
          >
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item
        v-else
        :index="parent.name"
        v-show="parent.meta.display == '0'"
        :key="parent.name"
      >
        <svg-icon :icon-class="parent.meta.icon" />
        <template #title
          ><span class="title">{{ parent.meta.title }}</span></template
        >
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import logoVue from './logo.vue'
import { usemenuStore } from '../../stores/menuStore'
import DynamicMenus from '../../components//header/dynamicMenus.vue'
import { useRoute, useRouter } from 'vue-router'

import { useRoutesStore } from '@/stores/routesStore'
let routerStore = useRoutesStore()

let router = useRouter()

let menuStore = usemenuStore()
let route = useRoute()

let defaultActive = ref<string>('panel')

watch(
  () => route.fullPath,
  (name) => {
    let names = name.split('/')
    console.log(names[names.length - 1])

    defaultActive.value = names[names.length - 1]
  },
  { immediate: true }
)

const handleSelect = (index: string) => {
  defaultActive.value = index

  router.push({
    name: index
  })
}
</script>

<style scoped>
.el-menu {
  /* width: 250px; */
  height: 100vh;
  background-color: #001529;
}

.el-menu-item.is-active {
  background-color: #1890ff !important;
  color: #fff;
}

.title {
  margin-left: 10px;
}
</style>

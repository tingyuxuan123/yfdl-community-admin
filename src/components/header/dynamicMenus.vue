<template>
  <template v-for="parent in routerStore.routes">
    <el-sub-menu
      v-if="parent.children && parent.children.length > 0"
      :index="parent.id.toString()"
      :key="parent.id"
    >
      <template #title>
        <svg-icon :icon-class="parent.meta.icon" />
        <span class="title">{{ parent.meta.title }}</span>
      </template>

      <el-menu-item
        :index="item.name"
        v-for="item in parent.children"
        :key="item.id"
      >
        <svg-icon :icon-class="item.meta.icon" />
        <template #title
          ><span class="title">{{ item.meta.title }}</span></template
        >
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item v-else :index="parent.name" :key="parent.id">
      <svg-icon :icon-class="parent.meta.icon" />
      <template #title
        ><span class="title">{{ parent.meta.title }}</span></template
      >
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRoutesStore } from '@/stores/routesStore'
let routerStore = useRoutesStore()
</script>

<style scoped lang="less">
.title {
  margin-left: 10px;
}
</style>

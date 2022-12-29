<template>
  <div class="common-layout">
    <el-container>
      <el-aside :width="menuStore.menuWith">
        <Aside></Aside>
      </el-aside>
      <el-container>
        <el-header>
          <Header></Header>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import Aside from './aside/index.vue'
import Header from './header/index.vue'
import { usemenuStore } from '@/stores/menuStore'

let menuStore = usemenuStore()
</script>

<style scoped lang="less">
.common-layout {
  width: 100vw;
  height: 100vh;
}
.el-header {
  width: 100%;
  padding: 0px;
}

.el-main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f0f2f5;
}
</style>

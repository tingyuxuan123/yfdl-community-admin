<template>
  <Header>
    <template class="left" #header-left>
      <div class="left_1">
        <span @click="a" style="margin-right: 10px">
          <el-icon v-if="!menuStore.isCollapse">
            <Fold />
          </el-icon>
          <el-icon v-else>
            <Expand />
          </el-icon>
        </span>
        <breadcrumb></breadcrumb>
      </div>
    </template>

    <template #header-right>
      <div>
        <el-dropdown>
          <el-avatar
            :size="30"
            :src="userStore.userInfo ? userStore.userInfo.avatar : ''"
          />
          <el-avatar></el-avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toUserInfo">个人资料</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>
  </Header>
</template>

<script lang="ts" setup>
import Header from '@/components/header/header.vue'
import breadcrumb from '../../components/breadcrumb/index.vue'
import { usemenuStore } from '@/stores/menuStore'
import { useUserStore } from '@/stores/userStore'
import { useRoutesStore } from '@/stores/routesStore'
import { useRouter } from 'vue-router'

let menuStore = usemenuStore()
let userStore = useUserStore()
let routesStore = useRoutesStore()

const router = useRouter()

let a = () => {
  menuStore.changeCollapse()
}

//退出登录
let logout = () => {
  //清空用户信息
  userStore.$reset()
  router.push('/login')
  ;(routesStore.routes = []), (routesStore.layoutRouter = undefined)
}

let toUserInfo = () => {
  router.push({
    name: 'userinfo'
  })
}
</script>

<style scoped lang="less">
.el-icon {
  font-size: 28px;
}

.left {
  cursor: pointer;
}

.left_1 {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

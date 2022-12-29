<template>
  <div class="userinfo">
    <div class="userinfo_left">
      <img :src="userStore.userInfo.avatar" alt="" />
      <p>{{ userStore.userInfo.nickName }}</p>
      <p>{{ userStore.userInfo.label }}</p>
      <p>{{ userStore.userInfo.email }}</p>
    </div>
    <div class="userInfo_right">
      <h3>个人资料</h3>
      <el-tabs type="border-card" class="demo-tabs">
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon><calendar /></el-icon>
              <span>基本资料</span>
            </span>
          </template>

          <el-form
            label-position="top"
            label-width="100px"
            :model="userinfo"
            style="max-width: 460px"
          >
            <el-form-item label="用户名:">
              <el-input v-model="userinfo.userName" />
            </el-form-item>
            <el-form-item label="昵称:">
              <el-input v-model="userinfo.nickName" />
            </el-form-item>
            <el-form-item label="电子邮箱:">
              <el-input v-model="userinfo.email" />
            </el-form-item>
            <el-form-item label="个性签名:">
              <el-input v-model="userinfo.label" type="textarea" :rows="10" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateUserInfo">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="密码">
          <template #label>
            <span class="custom-tabs-label">
              <el-icon><Lock /></el-icon>
              <span style="vertical-align: bottom">密码</span>
            </span>
          </template>

          <el-form
            label-position="top"
            label-width="100px"
            :model="userinfo"
            style="max-width: 460px"
          >
            <el-form-item label="新密码:">
              <el-input type="password" show-password v-model="newpassword" />
            </el-form-item>
            <el-form-item label="确认密码:">
              <el-input type="password" show-password v-model="newpassword2" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updatepas">确认修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup name="userInfo">
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { updateInfo, updatePassword } from '@/api/user'

const userStore = useUserStore()

let userinfo = userStore.userInfo

let newpassword = ref('')
let newpassword2 = ref('')

//修改个人资料
let updateUserInfo = async () => {
  let res = await updateInfo(userinfo)
  userStore.userInfo = res.data
  ElMessage({
    message: '修改成功',
    type: 'success'
  })
}

//修改密码
let updatepas = async () => {
  if (newpassword.value == newpassword2.value) {
    let res = await updatePassword(newpassword.value)
    ElMessage({
      message: '修改成功',
      type: 'success'
    })
  } else {
    ElMessage({
      message: '两次密码不一致',
      type: 'warning'
    })
  }
}
</script>

<style scoped lang="less">
.userinfo {
  width: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
  display: flex;

  .userinfo_left {
    display: flex;
    flex-direction: column;
    padding: 15px;
    box-sizing: border-box;
    align-items: center;
    flex: 4;
    background-color: #fff;
    margin-right: 15px;
    img {
      width: 100px;
      height: 100px;
      border-radius: 999px;
      & + p {
        font-size: 24px;
        padding: 0px;
        margin: 0px;
      }
    }
  }

  .userInfo_right {
    flex: 6;
    background-color: #fff;

    h3 {
      padding-left: 10px;
    }

    .el-icon {
      vertical-align: middle;
    }
    .custom-tabs-label span {
      vertical-align: middle;
      margin-left: 4px;
    }
  }
}
</style>

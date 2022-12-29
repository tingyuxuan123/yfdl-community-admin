<template>
  <div class="login">
    <div class="box">
      <div class="left"></div>
      <div class="right">
        <h4>登录</h4>
        <form action="#">
          <input
            type="text"
            placeholder="用户名"
            class="input"
            v-model="loginForm.userName"
          />
          <input
            type="password"
            placeholder="密码"
            class="input"
            v-model="loginForm.password"
          />
          <input
            type="submit"
            value="Login"
            class="button"
            @click.prevent="onSubmit"
          />
        </form>
        <div class="more">
          <a href="#">注册账号</a>
          <a href="#">找回密码</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="login">
import { reactive, ref } from 'vue'
import { login } from '@/api/login'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

let loginForm = reactive({ userName: '', password: '' })
const userStore = useUserStore()
const router = useRouter()

const onSubmit = async () => {
  let data: any = await login(loginForm.userName, loginForm.password)

  if (data.code == 200) {
    userStore.token = data.data.token
    userStore.userInfo = data.data.userInfo

    ElMessage({
      showClose: true,
      message: '登录成功',
      type: 'success'
    })

    router.push('/layout')
  } else {
    ElMessage({
      showClose: true,
      message: data.msg,
      type: 'error'
    })

    //  console.log(data.msg);
  }

  //   console.log(data)
}
</script>

<style scoped lang="less">
.login {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(120deg, #83c0e1 0%, #d6dce9 100%) no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;

  .box {
    width: 900px;
    height: 550px;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 1rem 0.2rem rgba(0, 0, 0, 0.1);
    display: flex;

    .left {
      width: 35%;
      height: 100%;
      background-color: #83c0e1;
      border-radius: 15px 0 0 15px;
      background-image: url('../../assets/images/2cy.jpg');
      background-size: cover;
      opacity: 0.85;
    }

    .right {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-items: center;

      h4 {
        color: #7092c8;
        font-size: 28px;
        padding: 0px;
        margin: 40px 0 0 0;
      }

      form {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      form .input {
        outline: none;
        width: 80%;
        height: 36px;
        padding: 10px 0 0 12px;
        border: none;
        border-bottom: 1px solid #7092c8;
        background-color: transparent;
        margin-top: 50px;

        &::placeholder {
          font-size: 18px;
        }
      }

      form .button {
        outline: none;
        width: 60%;
        height: 50px;
        margin-top: 50px;
        border: none;
        background-image: linear-gradient(120deg, #83c0e1 0%, #d6dce9 100%);
        text-align: center;
        border-radius: 6px;
        color: #ffffff;
        font-size: 18px;
        cursor: pointer;
      }

      .more {
        width: 130%;
        display: flex;
        justify-content: space-around;
        margin-top: 60px;

        a {
          color: #666;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>

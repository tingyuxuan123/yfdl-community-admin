<template>
  <div class="panel">
    <div class="top">
      <div class="articleNum">
        <block title="文章" :count="10">
          <template #icon>
            <el-icon color="#1890ff"><Plus /></el-icon>
          </template>
        </block>
      </div>
      <div>
        <block title="评论" :count="154">
          <template #icon>
            <el-icon color="#1890ff"><Operation /></el-icon>
          </template>
        </block>
      </div>
      <div>
        <block title="阅读量" :count="258">
          <template #icon>
            <el-tooltip content="阅读量258次" placement="top">
              <el-icon color="#8c8c8c"><WarningFilled /></el-icon>
            </el-tooltip>
          </template>
        </block>
      </div>
      <div>
        <block title="建立天数" :count="368">
          <template #icon>
            <el-tooltip content="建立天数368天" placement="top">
              <el-icon color="#8c8c8c"><WarningFilled /></el-icon>
            </el-tooltip>
          </template>
        </block>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="panel">
import { reactive, ref } from 'vue'
import gsap from 'gsap'
import Block from './components/block.vue'
</script>

<style scoped lang="less">
.panel {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;

  .top {
    display: flex;
    div {
      flex: 1;
      background-color: #fff;
      height: 120px;
    }
    .articleNum ~ div {
      margin-left: 16px;
    }
  }
}
</style>

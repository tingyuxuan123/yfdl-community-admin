<template>
  <div class="CommentAudit">
    <!-- <el-form :model="queryParams">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="用户名称">
            <el-input
              placeholder="请输入用户名"
              v-model="queryParams.userName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择">
              <el-option label="通过审核" :value="0" />
              <el-option label="等待审核" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" :icon="Search" @click="handleSearch"
            >搜索</el-button
          >
          <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form> -->
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

const queryParams = reactive({})
</script>

<style scoped lang="scss">
.CommentAudit {
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
}
</style>

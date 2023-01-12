<template>
  <div class="ArticleAudit">
    <el-form :model="queryParams">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="角色名称">
            <el-input
              placeholder="请输入角色名"
              v-model="queryParams.userName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="状态">
            <el-select v-model="queryParams.audit" placeholder="请选择">
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
    </el-form>

    <el-table
      :data="articleAuditList"
      style="width: 100%"
      :border="true"
      row-key="id"
      :default-expand-all="false"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- v-loading="loading"-->
      <el-table-column
        prop="id"
        label="ID"
        :show-overflow-tooltip="true"
        width="80"
        align="center"
      />
      <el-table-column prop="title" label="标题"> </el-table-column>

      <el-table-column prop="audit" label="状态" width="90" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.audit == 0" type="info">审核通过</el-tag>
          <el-tag v-if="scope.row.audit == 1" type="success">审核中</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="创建时间"
        prop="createTime"
        width="100"
      >
        <template #default="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="更新时间"
        prop="updateTime"
        width="100"
      >
        <template #default="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="推荐" width="180">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isTop"
            class="mb-2"
            active-text="推荐"
            inactive-text="不推荐"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="审核" width="180">
        <template #default="scope">
          <el-tag v-if="scope.row.status == 0" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status == 1" type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template>
          <!--#default="scope"-->
          <el-button :icon="Search" type="success" circle />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import {
  Plus,
  Delete,
  Search,
  Download,
  RefreshLeft
} from '@element-plus/icons-vue'
import { getArticleAuditListApi } from '@/api/article'
import type { type } from 'os'

type QueryParams = {
  currentPage: number
  pageSize: number
  userName?: string
  audit?: number
}

const queryParams = reactive<QueryParams>({
  currentPage: 1,
  pageSize: 10
})

const articleAuditList = ref([])

const getArticleAuditList = async () => {
  const result = await getArticleAuditListApi(queryParams)
  articleAuditList.value = result.data
  console.log(result)
}

getArticleAuditList()

const handleSearch = () => {
  console.log('')
}
const handleReset = () => {
  console.log('')
}
</script>

<style scoped lang="scss">
.ArticleAudit {
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
}
</style>

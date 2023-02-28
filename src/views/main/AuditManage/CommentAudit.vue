<template>
  <div class="CommentAudit">
    <el-form :model="queryParams" ref="fromRef">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="角色名称" prop="userName">
            <el-input
              placeholder="请输入角色名"
              v-model="queryParams.userName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="评论状态" prop="audit">
            <el-select v-model="queryParams.audit" placeholder="请选择">
              <el-option label="通过审核" :value="0" />
              <el-option label="审核中" :value="1" />
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
      <el-table-column prop="nickName" label="昵称" width="150">
      </el-table-column>
      <el-table-column prop="content" label="内容">
        <template #default="scope">
          <span v-html="spanToEmjoy(scope.row.content)"></span>
        </template>
      </el-table-column>

      <el-table-column prop="audit" label="状态" width="100" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.audit == 0" type="info">审核通过</el-tag>
          <el-tag v-if="scope.row.audit == 1" type="success">审核中</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="评论文章"> </el-table-column>

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

      <el-table-column prop="status" label="审核" width="280" align="center">
        <template #default="scope">
          <el-button
            type="success"
            @click="handleAuditClick(scope.row.id, PASSAUDIT)"
            >审核通过</el-button
          >
          <el-button
            type="danger"
            @click="handleAuditClick(scope.row.id, NOTPASSAUDIT)"
            >审核不通过</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :currentPage="queryParams.currentPage"
      :page-size="queryParams.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
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
import { getcommentAudit, getcommentAuditListApi } from '@/api/comment'
import type { type } from 'os'
import { ElForm, ElMessage } from 'element-plus'
import emjoys from '@/assets/data/emjoy.json'

const PASSAUDIT = 0
const AWAITAUDIT = 1
const NOTPASSAUDIT = 2

type QueryParams = {
  currentPage: number
  pageSize: number
  userName?: string
  audit?: number
}

const queryParams = reactive<QueryParams>({
  audit: 1,
  currentPage: 1,
  pageSize: 10
})

const articleAuditList = ref([])
const total = ref(0)

const getCommentAuditList = async () => {
  const result = await getcommentAuditListApi(queryParams)
  articleAuditList.value = result.data.rows
  total.value = result.data.total
  console.log(result)
}

getCommentAuditList()

const fromRef = ref<InstanceType<typeof ElForm>>(null)

const handleSearch = () => {
  getCommentAuditList()
}

const handleReset = () => {
  fromRef.value.resetFields()
  getCommentAuditList()
}

//一页显示数量改变
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  getCommentAuditList()
}

//当前页改变
const handleCurrentChange = (val: number) => {
  queryParams.currentPage = val
  getCommentAuditList()
}

//审核操作
const handleAuditClick = async (id: number, audit: number) => {
  const result: any = await getcommentAudit(id, audit)
  if (result.code === 200 && audit === PASSAUDIT) {
    ElMessage({
      type: 'success',
      message: '审核已通过！'
    })
  } else {
    ElMessage({
      type: 'success',
      message: '审核不通过'
    })
  }
  getCommentAuditList()
}

//标签转图片
const spanToEmjoy = (message: string) => {
  const reg = /\[.+?\]/g

  return message.replace(reg, function (a, b) {
    for (let item of emjoys.emjoys) {
      if (item.imgName == a) {
        let imgElE = document.createElement('img')
        imgElE.setAttribute('src', item.imgUrl)
        imgElE.style.marginLeft = '2px'
        imgElE.style.marginRight = '2px'
        imgElE.setAttribute('alt', item.imgName)
        imgElE.style.width = '16px'
        imgElE.style.height = '16px'
        imgElE.style.verticalAlign = 'text-top'
        return imgElE.outerHTML
      }
    }
    return a
  })
}
</script>

<style scoped lang="scss">
.CommentAudit {
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;

  .el-pagination {
    margin-top: 10px;
  }

  .el-table {
    max-height: 800px;
    overflow-y: auto;
  }
}
</style>

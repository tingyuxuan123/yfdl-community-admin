<template>
  <div class="ArticleAudit">
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
          <el-form-item label="状态" prop="audit">
            <el-select v-model="queryParams.audit" placeholder="请选择">
              <el-option label="审核未通过" :value="NOTPASSAUDIT" />
              <el-option label="审核中" :value="AWAITAUDIT" />
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

      <el-table-column prop="audit" label="状态" width="110" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.audit == NOTPASSAUDIT" type="info"
            >审核不通过</el-tag
          >
          <el-tag v-if="scope.row.audit == AWAITAUDIT" type="success"
            >审核中</el-tag
          >
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
      <el-table-column prop="status" label="推荐" width="180" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isTop"
            class="mb-2"
            active-value="1"
            inactive-value="0"
            active-text="推荐"
            inactive-text="不推荐"
            @click="handleRecommedClick(scope.row.id, scope.row.isTop)"
          />
        </template>
      </el-table-column>
      <el-table-column label="查看" width="80" align="center">
        <template #default="scope">
          <el-button
            :icon="Search"
            type="success"
            circle
            @click="handleSeeClick(scope.row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="审核" width="280" align="center">
        <template #default="scope">
          <el-button
            type="success"
            @click="handleAuditClick(scope.row.id, PASSAUDIT)"
          >
            审核通过
          </el-button>
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

    <el-dialog v-model="articleContentVisible" title="文章内容">
      <template #default>
        <h1 class="title">{{ articleConent.title }}</h1>
        <h2 class="summary">{{ articleConent.summary }}</h2>
        <img class="article-thumbnail" :src="articleConent.thumbnail" alt="" />
        <MD :content="articleConent.content"></MD>
      </template>
    </el-dialog>
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
import {
  getarticleAuditApi,
  getArticleAuditListApi,
  getarticleContentApi,
  getarticleRecommendAPi
} from '@/api/article'
import type { type } from 'os'
import { ElForm, ElMessage } from 'element-plus'
import MD from '@/components/common/MD.vue'
import { result } from 'lodash'

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
  currentPage: 1,
  pageSize: 10,
  audit: 1
})

const articleAuditList = ref([])
const total = ref(0)

const getArticleAuditList = async () => {
  const result = await getArticleAuditListApi(queryParams)
  articleAuditList.value = result.data.rows
  total.value = result.data.total
  // console.log(result)
}

getArticleAuditList()

const fromRef = ref<InstanceType<typeof ElForm>>(null)

const handleSearch = () => {
  getArticleAuditList()
}

const handleReset = () => {
  fromRef.value.resetFields()
  getArticleAuditList()
}

//一页显示数量改变
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  getArticleAuditList()
}

//当前页改变
const handleCurrentChange = (val: number) => {
  queryParams.currentPage = val
  getArticleAuditList()
}

//推荐操作
const handleRecommedClick = async (id: number, isTop: string) => {
  // console.log(id, isTop)
  const result: any = await getarticleRecommendAPi(id, isTop)
  if (result.code === 200 && isTop === '1') {
    ElMessage({
      type: 'success',
      message: '推荐成功！'
    })
  } else {
    ElMessage({
      type: 'success',
      message: '已取消推荐'
    })
  }
}

//审核操作
const handleAuditClick = async (id: number, audit: number) => {
  // console.log(audit)

  const result: any = await getarticleAuditApi(id, audit)
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
  getArticleAuditList()
}

const articleConent = ref(null)
//查看操作
const handleSeeClick = async (id: number) => {
  const result: any = await getarticleContentApi(id)
  articleConent.value = result.data
  articleContentVisible.value = true
  // console.log(result)
}

//文章操作
const articleContentVisible = ref(false)
</script>

<style scoped lang="scss">
.ArticleAudit {
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;

  .el-pagination {
    margin-top: 10px;
  }
  .title {
    font-size: 28px;
    color: black;
    font-weight: bolder;
    margin-top: 0px;
  }
  .summary {
    font-size: 18px;
  }

  .el-table {
    max-height: 800px;
    overflow-y: auto;
  }

  .article-thumbnail {
    width: 100%;
  }
}
</style>

<template>
  <div class="allArticle">
    <el-form :model="form">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="关键词">
            <el-input
              placeholder="请输入标题内容"
              v-model="form.title"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="文章状态">
            <el-select v-model="form.status" placeholder="请选择文章状态">
              <el-option label="已发布" :value="0" />
              <el-option label="草稿箱" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="分类目录">
            <el-select
              v-model="form.categoryId"
              placeholder="请选择"
              filterable
            >
              <template v-for="item in categoryList" :key="item.id">
                <el-option :label="item.name" :value="item.id" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="标签目录">
            <el-select v-model="form.spanId" placeholder="请选择" filterable>
              <template v-for="item in tagList" :key="item.id">
                <el-option :label="item.name" :value="item.id" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :icon="Search" @click="queryAll"
            >查询</el-button
          >
          <el-button :icon="RefreshLeft" @click="reset">重置</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-button :icon="Plus" type="primary" plain @click="toWrite()">
          添加
        </el-button>
        <!-- <el-button :icon="Delete" type="danger" plain>回收站</el-button> -->
      </el-row>

      <el-row style="margin-top: 20px">
        <el-table
          :data="articleList"
          height="100%"
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column prop="thumbnail" label="封面" width="130px">
            <template #default="scope">
              <img class="thumbnai" :src="scope.row.thumbnail" alt="" />
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            :show-overflow-tooltip="true"
          />

          <el-table-column label="状态" width="100">
            <template #default="scope">
              <span v-if="scope.row.status === '1'">
                <i class="point_cg"></i>
                草稿箱
              </span>
              <span
                v-else-if="scope.row.status === '0' && scope.row.audit === 0"
              >
                <i class="point_fb"></i>
                已发布
              </span>
              <span
                v-else-if="scope.row.status === '0' && scope.row.audit === 1"
              >
                <i class="point_await"></i>
                待审核
              </span>
              <span
                v-else-if="scope.row.status === '0' && scope.row.audit === 2"
              >
                <i class="point_field"></i>
                审核失败
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="categoryName" label="分类" width="150px">
            <template #default="scope">
              <el-tag>{{ scope.row.categoryName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="标签">
            <template #default="scope">
              <template v-for="item in scope.row.tags" :key="item.id">
                <el-tag class="tagSpan">{{ item.name }}</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="commentCount" label="评论" width="100px">
            <template #default="scope">
              <el-badge :value="scope.row.commentCount" class="item" />
            </template>
          </el-table-column>
          <el-table-column prop="viewCount" label="访问" width="100px">
            <template #default="scope">
              <el-badge
                :value="scope.row.viewCount"
                class="item"
                type="primary"
                :max="99999"
              />
            </template>
          </el-table-column>
          <!-- <el-table-column prop="createTime" label="发布时间" /> -->
          <el-table-column
            align="center"
            label="操作"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-button
                size="small"
                type="primary"
                text
                icon="Edit"
                @click="handleEdit(scope.$index, scope.row)"
                >修改</el-button
              >
              <el-button
                size="small"
                type="danger"
                text
                icon="Delete"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row>
        <div class="pagination-block">
          <el-pagination
            :currentPage="pageinfo.currentPage"
            :page-size="pageinfo.pageSize"
            :page-sizes="[7, 14, 21, 28]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="allArticleView">
import { reactive, ref } from 'vue'
import {
  Plus,
  Delete,
  Search,
  Download,
  RefreshLeft
} from '@element-plus/icons-vue'
import { queryArticleList, deleteArticle } from '@/api/article'
import { getAllCategoryList } from '@/api/category'
import { getAllTagList } from '@/api/tag'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { log } from 'console'

let articleList = ref([])

let pageinfo = reactive({
  currentPage: 1,
  pageSize: 7
})

let router = useRouter()
let categoryList = ref<Array<{ id: number; name: string }>>([])
let tagList = ref<Array<{ id: number; name: string }>>([])
let total = ref(0)
let loading = ref(false)
const form = reactive<{
  title: string
  status: '0' | '1' | ''
  categoryId: number
  spanId: number
}>({
  title: '',
  status: '',
  categoryId: null,
  spanId: null
})

const queryAll = async () => {
  //查询文章
  loading.value = true
  const res = await queryArticleList(form, pageinfo)
  articleList.value = res.data.rows
  total.value = res.data.total
  loading.value = false
}

const getAllCategories = async () => {
  const res = await getAllCategoryList()
  categoryList.value = res.data
}

const getAllTags = async () => {
  const res = await getAllTagList()
  tagList.value = res.data
}

const reset = () => {
  ;(form.title = ''),
    (form.status = ''),
    (form.categoryId = null),
    (form.spanId = null)
  queryAll()
}

getAllCategories()
getAllTags()
//开始执行一次获取全部文章
queryAll()

//编辑
let handleEdit = (index: any, row: any) => {
  router.push({
    name: 'write',
    query: {
      aid: row.id
    }
  })
}

//删除
let handleDelete = async (index: any, row: any) => {
  console.log(row.id, '3434')

  await deleteArticle(row.id)

  ElMessage({
    showClose: true,
    message: '删除成功',
    type: 'success'
  })
  queryAll() //更新文章
}

//一页显示数量改变
const handleSizeChange = (val: number) => {
  pageinfo.pageSize = val
  queryAll()
}

//当前页改变
const handleCurrentChange = (val: number) => {
  pageinfo.currentPage = val
  queryAll()
}

const toWrite = () => {
  router.push({
    name: 'write'
  })
}
</script>

<style scoped lang="less">
.allArticle {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}

.pagination-block {
  margin-top: 15px;
}

.point_cg {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background-color: #faad14;
  display: inline-block;
  margin-right: 8px;
  position: relative;
  top: -2px;
}

.point_fb {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background-color: #52c41a;
  display: inline-block;
  margin-right: 8px;
  position: relative;
  top: -2px;
}

.point_field {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background-color: red;
  display: inline-block;
  margin-right: 8px;
  position: relative;
  top: -2px;
}

.point_await {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background-color: #4093ff;
  display: inline-block;
  margin-right: 8px;
  position: relative;
  top: -2px;
}

.tagSpan {
  margin-right: 5px;
}

.thumbnai {
  width: 100px;
  height: 60px;
}
</style>

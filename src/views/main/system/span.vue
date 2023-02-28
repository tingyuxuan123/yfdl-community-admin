<template>
  <div class="span">
    <el-form :model="queryParams">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="分类名">
            <el-input
              placeholder="请输入标签名"
              v-model="queryParams.name"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="5">
            <el-form-item label="状态">
              <el-select v-model="queryParams.status" placeholder="请选择">
                <el-option label="正常" value="0" />
                <el-option label="禁用" value="1" />
              </el-select>
            </el-form-item>
          </el-col> -->
        <el-col :span="8">
          <el-button
            type="primary"
            :icon="Search"
            @click="queryCategoryListByParams"
            >搜索</el-button
          >
          <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-button :icon="Plus" type="primary" plain @click="handleAdd"
          >添加</el-button
        >
        <!-- <el-button :icon="Delete" type="danger" plain>删除</el-button> -->
        <!-- <el-button :icon="Download" type="warning" plain>导出</el-button> -->
      </el-row>

      <el-row style="margin-top: 20px">
        <el-table :data="categoryList" style="width: 100%" v-loading="loading">
          <el-table-column align="center" type="selection" width="100" />
          <el-table-column align="center" type="index" label="id" width="100" />
          <el-table-column align="center" prop="articleCount" label="图标">
            <template #default="scope">
              <img :src="scope.row.spanIcon" class="icon" alt="" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="标签名" />
          <el-table-column align="center" prop="remark" label="备注" />
          <el-table-column align="center" prop="articleCount" label="文章篇数">
            <template #default="scope">
              <el-badge
                :value="scope.row.articleCount"
                class="item"
                type="primary"
              />
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" prop="status" label="状态" >
          <template #default="scope">
              <el-switch v-model="scope.row.status" @change="(val:string)=>{updateStatusByUserId(val,scope.row)}" active-value="0" inactive-value="1"/>
          </template>
        </el-table-column>          -->
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
                @click="handleUpdate(scope.row)"
                >修改</el-button
              >
              <el-button
                size="small"
                type="danger"
                text
                icon="Delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row>
        <div class="pagination-block">
          <el-pagination
            :currentPage="queryParams.currentPage"
            :page-size="queryParams.pageSize"
            :page-sizes="[8, 16, 24, 32]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageInfo.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-row>
    </el-form>

    <el-dialog v-model="ViewVisible" :title="title" style="width: 600px">
      <el-form :model="form">
        <el-form-item label="标签名" label-width="60px">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="图标" label-width="60px">
          <el-upload
            :file-list="spanIconList"
            :limit="1"
            name="img"
            :http-request="handleUpload"
            :auto-upload="true"
            list-type="picture-card"
            :on-exceed="onExceed"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" label-width="60px">
          <el-input v-model="form.remark" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ViewVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="category">
import { reactive, ref } from 'vue'
import {
  Plus,
  Delete,
  Search,
  Download,
  RefreshLeft
} from '@element-plus/icons-vue'
import { getAllTagDetailList, insertTag, updateTag, deleteTag } from '@/api/tag'
import {
  ElBadge,
  ElButton,
  ElCol,
  ElDialog,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElMessage,
  ElPagination,
  ElRow,
  ElTable,
  ElTableColumn,
  ElUpload,
  UploadFiles
} from 'element-plus'
import { uploadImg } from '@/api/upload'

type QueryParams = {
  name?: string | undefined
  currentPage: number | undefined
  pageSize: number | undefined
  status?: string | undefined
}

type Form = {
  id?: number
  name: string
  spanIcon: string
  remark: string
  articleNum?: number
  description: string
  status?: string | undefined
}

let queryParams = reactive<QueryParams>({
  currentPage: 1,
  pageSize: 8
})

let form = reactive<Form>({
  id: undefined,
  name: undefined,
  spanIcon: undefined,
  remark: undefined,
  description: undefined,
  status: undefined
  // articleNum:undefined
})

let categoryList = ref<Array<Form>>([])

let loading = ref(false)
let title = ref('')
let ViewVisible = ref(false)
let pageInfo = reactive({
  total: 0
})

//编辑
let handleUpdate = (row: any) => {
  form.id = row.id
  form.name = row.name
  form.description = row.description
  form.spanIcon = row.spanIcon
  spanIconList.value = [
    {
      uid: 1,
      name: '缩略图',
      url: row.spanIcon,
      status: 'success'
    }
  ]
  ViewVisible.value = true
}

//删除
let handleDelete = async (row: any) => {
  await deleteTag(row.id)
  ElMessage({
    showClose: true,
    message: '删除成功',
    type: 'success'
  })

  queryCategoryListByParams()
}

let handleSubmit = async () => {
  // console.log(form);
  if (form.id) {
    //id 存在添加，反之修改
    const res = await updateTag(form)

    ElMessage({
      showClose: true,
      message: '修改成功',
      type: 'success'
    })
  } else {
    const res = await insertTag(form)
    ElMessage({
      showClose: true,
      message: '添加成功',
      type: 'success'
    })
  }

  resetForm()

  queryCategoryListByParams()

  ViewVisible.value = false
}

let handleReset = () => {
  queryParams.name = undefined
  queryParams.status = undefined
  queryCategoryListByParams()
}

let resetForm = () => {
  form.id = undefined
  form.name = undefined
  form.description = undefined
  form.status = '0'
}

//一页显示数量改变
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  queryCategoryListByParams()
}

//当前页改变
const handleCurrentChange = (val: number) => {
  queryParams.currentPage = val
  queryCategoryListByParams()
}

let handleAdd = () => {
  title.value = '添加分类'
  resetForm()
  ViewVisible.value = true
}

const queryCategoryListByParams = async () => {
  const res = await getAllTagDetailList(queryParams)
  categoryList.value = res.data.rows
  pageInfo.total = res.data.total
}

queryCategoryListByParams()

//改变状态
const updateStatusByUserId = async (status: string, row: any) => {
  const res = await updateTag({ id: row.id, status })
  ElMessage({
    showClose: true,
    message: '状态改变成功',
    type: 'success'
  })
}

/**
 *图片相关
 */

let spanIconList = ref<UploadFiles>([])

//图片上传
const handleUpload = async (img: any) => {
  const res: Record<string, any> = await uploadImg(img.file)

  if (res.code == 200) {
    form.spanIcon = res.data
  } else {
    ElMessage({
      showClose: true,
      message: '图片选择失败，请重新选择',
      type: 'warning'
    })
  }
}

//超过限制
const onExceed = () => {
  ElMessage({
    showClose: true,
    message: '图片个数超过限制！',
    type: 'warning'
  })
}
</script>

<style scoped lang="less">
.span {
  background: #fff;
  width: 100%;

  padding: 15px;
  box-sizing: border-box;
}

.pagination-block {
  margin-top: 15px;
}

.el-table {
  min-height: calc(100% - 100px);
}

.icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
}
</style>

<template>
  <div class="category">
    <el-form :model="form">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="分类名">
            <el-input placeholder="请输入分类名" v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option label="正常" :value="0" />
              <el-option label="禁用" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :icon="Search">搜索</el-button>
          <el-button :icon="RefreshLeft">重置</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-button
          :icon="Plus"
          type="primary"
          plain
          @click="addViewVisible = !addViewVisible"
          >添加</el-button
        >
        <el-button :icon="Delete" type="danger" plain>删除</el-button>
        <!-- <el-button :icon="Download" type="warning" plain>导出</el-button> -->
      </el-row>

      <el-row style="margin-top: 20px">
        <el-table :data="categoryList" height="250" style="width: 100%">
          <el-table-column type="selection" width="100" />
          <el-table-column type="index" label="id" width="100" />
          <el-table-column prop="date" label="分类名" />
          <el-table-column prop="name" label="描述" />
          <el-table-column prop="name" label="文章篇数" />
          <el-table-column prop="address" label="状态" type="radio" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row>
        <div class="pagination-block">
          <el-pagination
            :currentPage="1"
            :page-size="10"
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-row>
    </el-form>

    <el-dialog v-model="addViewVisible" title="添加分类" style="width: 600px">
      <el-form :model="form">
        <el-form-item label="分类名" label-width="60px">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" label-width="60px">
          <el-input v-model="form.name" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addViewVisible = false">取消</el-button>
          <el-button type="primary" @click="addCategory">添加</el-button>
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
import { getAllCategoryDetailList } from '@/api/category'

let form = reactive<{
  status: '0' | '1' | ''
  name: string
}>({
  status: '',
  name: ''
})

let categoryList = reactive<
  Array<{ id: number; name: string; description: string; status: '0' | '1' }>
>([])

let addViewVisible = ref(false)

//编辑
let handleEdit = (index: any, row: any) => {}

//删除
let handleDelete = (index: any, row: any) => {}

//一页显示数量改变
const handleSizeChange = (val: number) => {
  // console.log(`${val} items per page`)
}

//当前页改变
const handleCurrentChange = (val: number) => {
  //console.log(`current page: ${val}`)
}

//添加分类
const addCategory = () => {}

const queryAllCategoryDetailList = async () => {
  const res = await getAllCategoryDetailList()
  // console.log(res);
}

// queryAllCategoryDetailList();
</script>

<style scoped lang="less">
.category {
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
}

.pagination-block {
  margin-top: 15px;
}
</style>

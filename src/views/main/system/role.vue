<template>
  <div class="role">
    <el-form :model="queryParams">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="角色名称">
            <el-input
              placeholder="请输入角色名"
              v-model="queryParams.roleName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择">
              <el-option label="正常" :value="0" />
              <el-option label="禁用" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :icon="Search" @click="handleSearch"
            >搜索</el-button
          >
          <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-button :icon="Plus" type="primary" plain @click="handleAdd"
          >添加</el-button
        >
        <el-button :icon="Delete" type="danger" plain @click="handleDelete"
          >删除</el-button
        >
        <!-- <el-button :icon="Download" type="warning" plain>导出</el-button> -->
      </el-row>

      <el-row style="margin-top: 20px">
        <el-table
          :data="roleList"
          height="250"
          style="width: 100%"
          v-loading="loading"
          row-key="id"
        >
          <el-table-column type="selection" width="100" />
          <el-table-column
            align="center"
            prop="id"
            label="角色编号"
            width="100"
          />
          <el-table-column align="center" prop="roleName" label="角色名称" />
          <el-table-column align="center" prop="roleKey" label="权限字符" />
          <el-table-column align="center" prop="roleSort" label="显示顺序" />
          <el-table-column align="center" prop="status" label="状态">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                @change="(val:string)=>{updateStatusByUserId(val,scope.row)}"
                active-value="0"
                inactive-value="1"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" />
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

              <el-popconfirm
                title="是否确认删除"
                @confirm="handleDelete(scope.row)"
              >
                <template #reference>
                  <el-button size="small" type="primary" text icon="Delete"
                    >删除</el-button
                  >
                </template>
              </el-popconfirm>
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
            :total="pageInfo.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-row>
    </el-form>

    <el-dialog v-model="ViewVisible" :title="title" style="width: 520px">
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="80px">
          <el-input v-model="form.roleName" />
        </el-form-item>
        <el-form-item label="权限字符" label-width="80px">
          <el-input v-model="form.roleKey" />
        </el-form-item>

        <el-form-item label="显示排序" label-width="80px">
          <el-input-number
            v-model="form.roleSort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="状态" label-width="80px">
          <el-radio-group v-model="form.status">
            <el-radio :key="'0'" :label="'0'">正常</el-radio>
            <el-radio :key="'1'" :label="'1'">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限" label-width="80px">
          <el-tree-select
            v-model="form.roleMenu"
            :data="menuOptions"
            multiple
            :render-after-expand="false"
            :check-strictly="true"
            show-checkbox
          />
        </el-form-item>
        <el-form-item label="备注" label-width="80px">
          <el-input v-model="form.remark" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ViewVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="role">
import {
  Plus,
  Delete,
  Search,
  Download,
  RefreshLeft
} from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { getRoleList, insertRole, updateRole, deleteRole } from '@/api/role'
import { getRouters } from '@/api/user'
import { ElMessage } from 'element-plus'

let queryParams = ref<Record<string, any>>({
  currentPage: 1,
  pageSize: 10
}) //查询条件
let ViewVisible = ref(false)
let roleList = ref<{ [key: string]: any }[]>([])
let loading = ref(false)
let pageInfo = reactive({
  total: 0
})
let title = ref('')

let form = reactive({
  id: undefined,
  roleName: undefined,
  roleKey: undefined,
  roleSort: 0,
  status: '0',
  roleMenu: [],
  remark: undefined
})

let resetForm = () => {
  form.id = undefined
  form.roleName = undefined
  form.roleKey = undefined
  form.roleSort = 0
  form.status = '0'
  form.roleMenu = []
  form.remark = undefined
}

//编辑
let handleUpdate = (row: any) => {
  title.value = '修改角色'
  form.roleName = row.roleName
  form.roleKey = row.roleKey
  form.roleSort = row.roleSort
  form.status = row.status
  form.roleMenu = row.roleMenu
  form.remark = row.remark
  form.id = row.id
  ViewVisible.value = true
}

let menuOptions = ref<Array<Record<string, any>>>([])
//删除
let handleDelete = async (row: any) => {
  const res = await deleteRole(row.id)
  ElMessage({
    showClose: true,
    message: '删除成功',
    type: 'success'
  })
  getroleList()
}

let handleAdd = () => {
  title.value = '添加角色'
  resetForm()
  ViewVisible.value = true
}

const handleSearch = () => {
  getroleList()
}

const handleReset = () => {
  queryParams.value.roleName = undefined
  queryParams.value.status = undefined
  getroleList()
}

const getroleList = async () => {
  //获取角色列表
  loading.value = true
  const res = await getRoleList(queryParams.value)
  pageInfo.total = res.data.total
  roleList.value = res.data.rows
  //console.log(res);

  loading.value = false
}

getroleList()

const getRouterList = async () => {
  loading.value = true
  const res: any = await getRouters()
  let menuList = res.data.menus
  loading.value = false

  getTreeselect(menuList)
}

getRouterList()

/** 查询菜单下拉树结构 */
const getTreeselect = (menuList) => {
  let menu = { value: 0, label: '主类目', children: [] }

  if (menuList.length > 0) {
    menu.children = getTree(menuList)
  }

  menuOptions.value.push(...menu.children)
}

const getTree = (children: Array<Record<string, any>>) => {
  let reChildren = []
  children.forEach((item: Record<string, any>, index: number) => {
    let child
    if (item.children.length == 0) {
      child = { value: item.id, label: item.menuName }
    } else {
      child = {
        value: item.id,
        label: item.menuName,
        children: getTree(item.children)
      }
    }
    reChildren.push(child)
  })

  return reChildren
}

//一页显示数量改变
const handleSizeChange = (val: number) => {
  // console.log(`${val} items per page`)
}

//当前页改变
const handleCurrentChange = (val: number) => {
  // console.log(`current page: ${val}`)
}

//提交
const submit = async () => {
  // console.log(form);
  if (form.id) {
    //id 存在添加，反之修改
    const res = await updateRole(form)
    ElMessage({
      showClose: true,
      message: '修改成功',
      type: 'success'
    })
  } else {
    const res = await insertRole(form)
    ElMessage({
      showClose: true,
      message: '添加成功',
      type: 'success'
    })
  }

  getroleList()
  resetForm()
  ViewVisible.value = false
}

//改变状态
const updateStatusByUserId = async (status: string, row: any) => {
  const res = await updateRole({ id: row.id, status })
  ElMessage({
    showClose: true,
    message: '状态改变成功',
    type: 'success'
  })

  // console.log(status,row);
}
</script>

<style scoped lang="less">
.role {
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
}
</style>

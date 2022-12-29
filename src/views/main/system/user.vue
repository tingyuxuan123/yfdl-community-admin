<template>
  <div class="user">
    <el-form :model="queryParams">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="用户名称">
            <el-input
              placeholder="请输入用户名称"
              v-model="queryParams.userName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="手机号码">
            <el-input
              placeholder="请输入手机号码"
              v-model="queryParams.phonenumber"
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
        <!-- <el-button :icon="Delete" type="danger" plain>删除</el-button> -->
        <!-- <el-button :icon="Download" type="warning" plain>导出</el-button> -->
      </el-row>

      <el-row style="margin-top: 20px">
        <el-table
          :data="userList"
          max-height="400"
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
          <el-table-column align="center" prop="userName" label="角色名称" />
          <el-table-column align="center" prop="nickName" label="用户昵称" />
          <el-table-column align="center" prop="phonenumber" label="手机号码" />
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
              <!-- <el-button
                      size="small"
                      type="primary"
                      text
                      icon="Delete"
                      @click="handleDelete(scope.row)"
                    >删除</el-button> -->
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

    <el-dialog v-model="ViewVisible" :title="title" style="width: 600px">
      <el-form :model="form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="用户昵称" label-width="80px">
              <el-input v-model="form.nickName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号码" label-width="80px">
              <el-input v-model="form.phonenumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" label-width="80px">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名称" label-width="80px">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色权限" label-width="80px">
              <el-select v-model="form.roleId" placeholder="请选择">
                <el-option
                  v-for="role in roleList"
                  :label="role.roleName"
                  :value="role.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
      <el-form-item label="用户密码" label-width="80px"> 
          <el-input v-model="form.password"></el-input>  
      </el-form-item>
    </el-col> -->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户性别" label-width="80px">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option label="男" value="0" />
                <el-option label="女" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" label-width="80px">
              <el-radio-group v-model="form.status">
                <el-radio :key="'0'" :label="'0'">正常</el-radio>
                <el-radio :key="'1'" :label="'1'">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- <el-col :span="12">
      <el-form-item label="角色权限" label-width="80px"> 
        <el-select v-model="form.roleId" placeholder="请选择">
          <el-option v-for="role in roleList" :label="role.roleName" :value="role.id" />
       
        </el-select>
      </el-form-item>
    </el-col> -->
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ViewVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
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
import { nextTick, reactive, ref } from 'vue'
import { getUserList, updateUserInfo, insertUser } from '@/api/user'
import { roleListBySelect } from '@/api/role'
import { ElMessage } from 'element-plus'

let queryParams = ref<Record<string, any>>({
  currentPage: 1,
  pageSize: 10
}) //查询条件
let ViewVisible = ref(false)
let userList = ref<{ [key: string]: any }[]>([])
let roleList = ref<{ [key: string]: any }[]>([])
let loading = ref(false)
let pageInfo = reactive({
  total: 0
})

let title = ref('')

let form = reactive({
  id: undefined,
  userName: undefined,
  nickName: undefined,
  email: undefined,
  phonenumber: undefined,
  sex: '0',
  status: '0',
  roleId: undefined
})

//编辑

let handleUpdate = (row: any) => {
  console.log(row)

  title.value = '修改用户信息'
  form.id = row.id
  form.userName = row.userName
  form.nickName = row.nickName
  form.email = row.email
  form.status = row.status
  form.phonenumber = row.phonenumber
  form.roleId = row.roleId
  form.sex = row.sex

  ViewVisible.value = true
}

//删除
let handleDelete = (row: any) => {}

let handleAdd = () => {
  title.value = '添加角色'
  resetForm()
  ViewVisible.value = true
}

const resetForm = () => {
  ;(form.id = undefined),
    (form.userName = undefined),
    (form.nickName = undefined),
    (form.email = undefined),
    (form.phonenumber = undefined),
    (form.sex = '0'),
    (form.status = '0'),
    (form.roleId = undefined)
}

const handleSearch = () => {
  getuserList()
}

const handleReset = () => {
  queryParams.value.phonenumber = undefined
  queryParams.value.userName = undefined
  queryParams.value.status = undefined
  getuserList()
}

const getuserList = async () => {
  //获取角色列表
  loading.value = true
  const res = await getUserList(queryParams.value)

  pageInfo.total = res.data.total
  userList.value = res.data.rows

  loading.value = false
}

getuserList()

//一页显示数量改变
const handleSizeChange = (val: number) => {
  // console.log(`${val} items per page`)
}

//当前页改变
const handleCurrentChange = (val: number) => {
  // console.log(`current page: ${val}`)
}

const getRoleListbySelect = async () => {
  const res: any = await roleListBySelect()
  roleList.value = res.data
}
getRoleListbySelect()

//提交
const submit = async () => {
  // console.log(form);
  if (form.id) {
    //id 存在添加，反之修改
    const res = await updateUserInfo(form)

    ElMessage({
      showClose: true,
      message: '修改成功',
      type: 'success'
    })
  } else {
    const res = await insertUser(form)
    ElMessage({
      showClose: true,
      message: '添加成功',
      type: 'success'
    })
  }

  resetForm()

  getuserList()

  ViewVisible.value = false
}

//改变状态
const updateStatusByUserId = async (status: string, row: any) => {
  const res = await updateUserInfo({ id: row.id, status })
  ElMessage({
    showClose: true,
    message: '状态改变成功',
    type: 'success'
  })
}
</script>

<style scoped lang="less">
.user {
  background: #fff;
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
}
</style>

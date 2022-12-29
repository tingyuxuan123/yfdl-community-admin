<template>
  <div class="menu">
    <el-form :model="queryParams">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="菜单名称">
            <el-input
              placeholder="请输入菜单名"
              v-model="queryParams.menuName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="状态">
            <el-select v-model="queryParams.visible" placeholder="请选择">
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
        <el-button :icon="Plus" type="primary" plain @click="handleAdd"
          >新增</el-button
        >
        <!-- <el-button :icon="Delete" type="danger" plain>删除</el-button> -->
        <!-- <el-button :icon="Download" type="warning" plain>导出</el-button> -->
      </el-row>

      <el-row style="margin-top: 20px">
        <el-table
          :data="menuList"
          style="width: 100%"
          v-loading="loading"
          row-key="id"
          :default-expand-all="false"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column
            prop="menuName"
            label="菜单名称"
            :show-overflow-tooltip="true"
            width="160"
          />
          <el-table-column prop="icon" label="图标" width="100">
            <template #default="scope">
              <svg-icon :icon-class="scope.row.icon" />
            </template>
          </el-table-column>
          <el-table-column prop="orderNum" label="排序" width="60" />
          <el-table-column
            prop="perms"
            label="权限标识"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="component"
            label="组件路径"
            :show-overflow-tooltip="true"
          />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-tag v-if="scope.row.status == 0" type="success">正常</el-tag>
              <el-tag v-if="scope.row.status == 1" type="danger">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
            <template #default="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" class-name="small-padding fixed-width">
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
                type="primary"
                text
                icon="Plus"
                @click="handleAdd(scope.row)"
                >新增</el-button
              >
              <el-button
                size="small"
                type="primary"
                text
                icon="Delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="open" width="680px" append-to-body>
      <el-form :model="form" label-width="100px" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <el-tree-select
                v-model="form.parentId"
                :data="menuOptions"
                :render-after-expand="false"
                :show-count="true"
                placeholder="选择上级菜单"
                :check-strictly="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'F'" label="菜单图标">
              <el-select
                v-model="form.icon"
                placeholder="图标"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="(item, index) in icons"
                  :key="index"
                  :value="item.name"
                >
                  <svg-icon :icon-class="item.name" />
                  <span style="margin-left: 5px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.menuType == 'C'"
              prop="name"
              label="路由名称"
            >
              <el-input v-model="form.name" placeholder="请输入路由名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.menuType != 'F' && form.menuType != 'M'"
              prop="path"
              label="路由地址"
            >
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="form.menuType == 'M'"
              prop="path"
              label="路由地址"
            >
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType == 'C'" :span="12">
            <el-form-item prop="component" label="组件路径">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'M'" label="权限字符">
              <el-input
                v-model="form.perms"
                placeholder="请输入权限标识"
                maxlength="100"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="显示状态">
              <el-radio-group v-model="form.visible">
                <el-radio :key="'0'" :label="'0'">显示</el-radio>
                <el-radio :key="'1'" :label="'1'">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="菜单状态">
              <el-radio-group v-model="form.status">
                <el-radio :key="'0'" :label="'0'">正常</el-radio>
                <el-radio :key="'1'" :label="'1'">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { Plus, Delete, Search, RefreshLeft } from '@element-plus/icons-vue'
import { getRouters } from '@/api/user'
import { insertMenu, updateMenu, deleteMenu } from '@/api/menu'
import { ElMessage } from 'element-plus'
import { useRoutesStore } from '@/stores/routesStore'

let queryParams = ref<Record<string, any>>({}) //查询条件

let menuOptions = ref<Array<Record<string, any>>>([])
let routesStore = useRoutesStore()

let form = reactive<Record<string, any>>({
  id: undefined,
  parentId: 0,
  menuName: undefined,
  icon: undefined,
  menuType: 'M',
  orderNum: undefined,
  isCache: '0',
  visible: '0',
  status: '0',
  name: undefined
}) //添加表单

let menuList = ref<Array<Record<string, any>>>([]) //表格数据
let open = ref(false) //是否显示弹出层
let loading = ref(true)
let title = ref('')
let rules = ref({
  menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
  path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '路由名称不能为空', trigger: 'blur' }]
})
let icons = ref<{ [key: string]: any }[]>([])

//编辑修改
let handleUpdate = (row: any) => {
  title.value = '修改菜单'
  form.parentId = row.parentId
  form.menuName = row.menuName
  form.menuType = row.menuType
  form.icon = row.icon
  form.orderNum = row.orderNum
  form.visible = row.visible
  form.status = row.status
  form.path = row.path
  form.component = row.component
  form.perms = row.perms
  form.id = row.id
  form.name = row.name
  open.value = true
}

let getIcons = () => {
  const modulesFiles = import.meta.glob('@/assets/icons/svg/*.svg')

  const arr = Object.keys(modulesFiles).map((i) => {
    let fileName = i.replace(/(.*\/)*([^.]+).*/gi, '$2') //获取文件名

    return { name: fileName, url: i }
  })

  return arr
}

icons.value = getIcons()

//删除
let handleDelete = async (row: any) => {
  const res = await deleteMenu(row.id)
  ElMessage({
    showClose: true,
    message: '删除成功!',
    type: 'success'
  })

  getRouterList()
}

// 表单重置
let reset = () => {
  form.parentId = 0
  form.menuName = undefined
  form.menuType = 'M'
  form.icon = undefined
  form.orderNum = undefined
  form.visible = '0'
  form.status = '0'
  form.path = undefined
  form.component = undefined
  form.perms = undefined
  form.id = undefined
  form.name = undefined
}
//刷新界面
const getRouterList = async () => {
  loading.value = true
  const res: any = await getRouters()
  menuList.value = res.data.menus
  loading.value = false

  getTreeselect()
}

getRouterList()

/** 查询菜单下拉树结构 */
const getTreeselect = () => {
  let menu = { value: 0, label: '主类目', children: [] }

  if (menuList.value.length > 0) {
    menu.children = getTree(menuList.value)
  }

  menuOptions.value.push(menu)
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

//取消按钮
const cancel = () => {
  open.value = false
  reset()
}

const handleAdd = (row: any) => {
  reset()
  if (row != null && row.id) {
    form.parentId = row.id
  } else {
    form.parentId = 0
  }
  open.value = true
  title.value = '添加菜单'
}

//提交
const submitForm = async () => {
  // console.log(form.id);

  if (form.id) {
    //更新
    await updateMenu(form)

    ElMessage({
      showClose: true,
      message: '更新成功!',
      type: 'success'
    })
  } else {
    await insertMenu(form)

    ElMessage({
      showClose: true,
      message: '添加成功!',
      type: 'success'
    })
    //添加
  }

  getRouterList()
  //更新次菜单
  // routesStore.GenerateRoutes()
}
</script>

<style scoped lang="less">
.menu {
  background-color: #fff;
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>

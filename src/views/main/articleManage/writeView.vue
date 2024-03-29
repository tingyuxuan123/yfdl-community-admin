<template>
  <div class="write">
    <div class="write_top">
      <el-form ref="form" :model="article" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文章标题" prop="title">
              <el-input
                v-model="article.title"
                placeholder="请输入文章标题"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分类">
              <el-select v-model="article.categoryId" placeholder="请选择">
                <el-option
                  v-for="category in categoryList"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签">
              <el-select v-model="article.tags" placeholder="请选择" multiple>
                <el-option
                  v-for="tag in tagList"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文章摘要">
              <el-input v-model="article.summary" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="允许评论">
              <el-radio-group v-model="article.isComment">
                <el-radio :key="'0'" :label="'0'">停用</el-radio>
                <el-radio :key="'1'" :label="'1'">正常</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否发布">
              <el-radio-group v-model="article.status">
                <el-radio :key="'0'" :label="'0'">发布</el-radio>
                <el-radio :key="'1'" :label="'1'">草稿</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" />

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="缩略图">
              <el-upload
                :file-list="thumbnails"
                :limit="1"
                name="img"
                :http-request="handleUpload"
                :auto-upload="true"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-exceed="onExceed"
              >
                <el-icon>
                  <Plus />
                </el-icon>
              </el-upload>

              <el-dialog v-model="dialogVisible">
                <img
                  w-full
                  style="width: 100%"
                  :src="dialogImageUrl"
                  alt="Preview Image"
                />
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="HandleRoundImg"
              >随机缩略图</el-button
            >
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="default" @click="handleSubmit">{{
                aId ? '更新' : '发布'
              }}</el-button>
            </el-form-item>
            <el-form-item> </el-form-item>
          </el-col>
        </el-row>
        <el-row> </el-row>
      </el-form>
    </div>
    <mavon-editor
      ref="md"
      v-model="article.content"
      @imgAdd="addImg"
      class="editor"
    />
  </div>
</template>

<script lang="ts" setup name="writeView">
import { reactive, ref, watchEffect, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { queryArticleInfo, updateArticle, insertArticle } from '@/api/article'
import { getAllCategoryList } from '@/api/category'
import { getAllTagList } from '@/api/tag'
import { uploadImg } from '@/api/upload'
import { ElMessage, UploadFile, UploadFiles } from 'element-plus'
import { getRoundImg } from '@/api/img'

const route = useRoute()

//上传文章
interface articleInfo {
  title: string
  content: string
  summary: string
  categoryId: string
  thumbnail: string
  isTop: '0' | '1' //0否 1是
  status: '0' | '1' // 0发布 1 草稿
  isComment: '0' | '1' // 0否 1 是
  tags: []
}

let article = reactive<articleInfo>({
  title: null,
  content: null,
  summary: null,
  categoryId: null,
  thumbnail: null,
  isTop: '0',
  status: '1',
  isComment: '1',
  tags: []
})

let md = ref(null)

//分类列表

let categoryList = ref<Array<{ id: number; name: string }>>([])

//标签列表
let tagList = ref<Array<{ id: number; name: string }>>([])

//文章id 有说明是更新 ，没有说明是发布
let aId = ref(null)

// let thumbnails = ref<Array<Record<string, any>>>([])
let thumbnails = ref<UploadFiles>([])

if (route.query && route.query.aid) {
  aId.value = route.query.aid

  queryArticleInfo(aId.value).then((res) => {
    const data = res.data
    article.title = data.title
    article.thumbnail = data.thumbnail
    article.content = data.content
    article.isTop = data.isTop
    article.isComment = data.isComment
    article.summary = data.summary
    article.categoryId = data.categoryId
    article.status = data.status
    article.tags = data.tags.map((tag) => {
      return tag.id
    })

    // thumbnails.value.push({ name: '缩略图', url: data.thumbnail })
    thumbnails.value.push({
      uid: 1,
      name: '缩略图',
      url: data.thumbnail,
      status: 'success'
    })
  })
}

const getAllCategories = async () => {
  const res = await getAllCategoryList()
  categoryList.value = res.data
}
getAllCategories()

const getAllTags = async () => {
  const res = await getAllTagList()
  tagList.value = res.data
}
getAllTags()

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file: UploadFile) => {
  //移除
  //console.log(article.thumbnail)
}

const handlePictureCardPreview = (file: UploadFile) => {
  //查看图片
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = (file: UploadFile) => {
  //文件下载
  window.open(file.url)
}

watch(
  () => route.query,
  () => {
    //("aid又值", aId.value);
  },
  { deep: true }
)

//保存或更新
const handleSubmit = async () => {
  //对提交的数据进行校验
  let isPass = beforeSubmit()
  if (!isPass) return
  if (aId.value != null) {
    //为更新

    let res: any = await updateArticle(aId.value, article)

    if (res.code == 200) {
      ElMessage({
        showClose: true,
        message: '更新成功！',
        type: 'success'
      })
    } else {
      ElMessage({
        showClose: true,
        message: '更新失败！请重试',
        type: 'warning'
      })
    }
    // console.log(res);
  } else {
    //添加

    if (article.summary == '' || article.summary == null) {
      //不写摘要默认填充内容
      article.summary = md.value.d_render.replace(
        /(?<=<pre>)[\s\S]*?(?=<\/pre>)/gi,
        ''
      )
      article.summary = article.summary.replace(/<[^>]+>/g, '')
      article.summary = article.summary.replace(/\s/g, '')
      article.summary = article.summary.slice(0, 80)
    }

    let res: any = await insertArticle(article)

    if (res.code == 200) {
      ElMessage({
        showClose: true,
        message: '添加成功！',
        type: 'success'
      })
    } else {
      ElMessage({
        showClose: true,
        message: '添加失败！请重试',
        type: 'warning'
      })
    }
  }
}

const beforeSubmit = () => {
  let message = null

  if (article.title == '' || article.title == null) {
    message = '标题不能为空'
  } else if (article.categoryId == null) {
    message = '分类不能为空'
  } else if (article.tags.length <= 0) {
    message = '标签不能为空'
  } else if (article.content == null || article.content == '') {
    message = '内容不能为空'
  }

  if (message != null) {
    ElMessage({
      showClose: true,
      message,
      type: 'warning'
    })
    return false
  } else {
    return true
  }
}

//
const addImg = async (pos: any, file: any) => {
  // console.log(pos,file);
  const res = await uploadImg(file)

  md.value.$img2Url(pos, res.data)
}

//图片上传
const handleUpload = async (img: any) => {
  const res: Record<string, any> = await uploadImg(img.file)

  if (res.code == 200) {
    article.thumbnail = res.data
  } else {
    ElMessage({
      showClose: true,
      message: '图片选择失败，请重新选择',
      type: 'warning'
    })
  }
}

//随机图片
const HandleRoundImg = async () => {
  const result = await getRoundImg()
  article.thumbnail = result.data.img

  thumbnails.value = [
    {
      uid: 1,
      name: '缩略图',
      url: result.data.img,
      status: 'success'
    }
  ]
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
.write {
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 12px;
}

.el-col .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.editor {
  width: 100%;
  height: calc(100vh - 420px) !important;
}
</style>

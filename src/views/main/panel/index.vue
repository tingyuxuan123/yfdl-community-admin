<template>
  <div class="panel">
    <div class="panel-header">
      <div class="one">
        <div class="header-left">
          <img :src="userStore.userInfo.avatar" alt="" />
        </div>
        <div class="header-right">
          <h1>
            {{ getTimeState() }}，<span>{{ userStore.userInfo.nickName }}</span
            >！
          </h1>
          <p>昨夜西风凋碧树，独上高楼，望尽天涯路。 —— 晏殊</p>
        </div>
      </div>
      <div class="two">
        <h1>{{ dayjs(new Date()).format('YYYY-MM-DD') }}</h1>
        <p>IP地址：{{ ip }}</p>
      </div>
    </div>
    <div class="top">
      <div class="articleNum">
        <block title="文章" :count="userArticle.articleCount">
          <template #icon>
            <el-icon color="#1890ff"><Plus /></el-icon>
          </template>
        </block>
      </div>
      <div>
        <block title="点赞" :count="userArticle.likeCount">
          <template #icon>
            <el-icon color="#1890ff"><Operation /></el-icon>
          </template>
        </block>
      </div>
      <div>
        <block title="阅读量" :count="userArticle.readCount">
          <template #icon>
            <el-tooltip content="阅读量258次" placement="top">
              <el-icon color="#8c8c8c"><WarningFilled /></el-icon>
            </el-tooltip>
          </template>
        </block>
      </div>
      <div>
        <block title="建立天数" :count="dateDiff(userArticle.createTime)">
          <template #icon>
            <el-tooltip content="建立天数368天" placement="top">
              <el-icon color="#8c8c8c"><WarningFilled /></el-icon>
            </el-tooltip>
          </template>
        </block>
      </div>
    </div>
    <div class="tu">
      <div class="chart" ref="chart"></div>
    </div>
  </div>
</template>

<script lang="ts" setup name="panel">
import { reactive, ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import gsap from 'gsap'
import { useUserStore } from '@/stores/userStore'
import { userArticleInfo } from '@/api/user'
import { articleInfoByTag } from '@/api/tag'
import Block from './components/block.vue'
import dayjs from 'dayjs'

const userStore = useUserStore()

const ip = computed(() => {
  return sessionStorage.getItem('ip')
})

const userArticle = reactive({
  articleCount: 0,
  likeCount: 0,
  readCount: 0,
  createTime: new Date()
})

const getUserArticleInfo = async () => {
  const res = await userArticleInfo()
  userArticle.articleCount = res.data.articleCount
  userArticle.likeCount = res.data.likeCount
  userArticle.readCount = res.data.readCount
  userArticle.createTime = res.data.createTime
}

getUserArticleInfo()

//获取时间差
const dateDiff = (sDate2: any) => {
  const sDate1 = new Date().getTime()
  sDate2 = new Date(sDate2).getTime()

  let iDays = (sDate1 - sDate2) / 1000 / 60 / 60 / 24 //把相差的毫秒数转换为天数
  return iDays //返回相差天数
}

const getTimeState = () => {
  // 获取当前时间
  let timeNow = new Date()
  // 获取当前小时
  let hours = timeNow.getHours()
  // 设置默认文字
  let state = ``
  // 判断当前时间段
  if (hours >= 0 && hours <= 9) {
    state = `早上好`
  } else if (hours > 9 && hours <= 13) {
    state = `中午好`
  } else if (hours > 13 && hours <= 17) {
    state = `下午好`
  } else if (hours > 17 && hours <= 23) {
    state = `晚上好`
  }
  return state
}

const articleInfoByTagList = ref([])

const getArticleInfoByTag = async (myChart: echarts.ECharts) => {
  const res = await articleInfoByTag()
  articleInfoByTagList.value = res.data
  articleInfoByTagList.value = articleInfoByTagList.value.map((item: any) => {
    return {
      id: item.tagId,
      name: item.tagName,
      value: item.count
    }
  })

  // 绘制图表
  myChart.setOption({
    title: {
      text: '文章概括'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        data: articleInfoByTagList.value,
        itemStyle: {
          normal: {
            label: {
              show: true, //显示
              formatter: '{b} ({d}%)' //b:名称；c：值；d：所占百分比
            },
            labelLine: {
              show: true //显示
            }
          }
        }
      }
    ]
  })

  // console.log(articleInfoByTagList.value)
}

//使用echars
const chart = ref(null)

onMounted(() => {
  let myChart = echarts.init(chart.value)

  getArticleInfoByTag(myChart)
})
</script>

<style scoped lang="less">
.panel {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;

  .panel-header {
    display: flex;
    margin-bottom: 20px;
    .one {
      flex: 9;
      background-color: #fff;

      margin-right: 20px;
      display: flex;
      padding: 20px;
      img {
        width: 100px;
        height: 100px;
      }

      .header-right {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 20px;
        h1 {
          font-size: 30px;
          font-weight: bolder;
          margin: 0px;

          span {
            color: #1890ff;
          }
        }
        p {
          margin: 0px;
          font-size: 18px;
        }
      }
    }
    .two {
      flex: 3;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      h1 {
        font-size: 28px;
        font-weight: bolder;
        margin: 0px;
      }

      p {
        font-size: 16px;
        margin-top: 15px;
      }
    }
  }

  .top {
    display: flex;
    div {
      flex: 1;
      background-color: #fff;
      height: 120px;
    }
    .articleNum ~ div {
      margin-left: 16px;
    }
  }

  .tu {
    margin-top: 20px;
    width: 75%;
    height: 400px;
    background-color: #fff;
    .chart {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

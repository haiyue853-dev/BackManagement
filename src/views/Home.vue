<script setup>
import { ref, getCurrentInstance, onMounted, onUnmounted, computed } from 'vue'
import { useAllDataStore } from '@/stores'
import * as echarts from 'echarts'

const { proxy } = getCurrentInstance()
const store = useAllDataStore()
const userInfo = computed(() => store.state.userInfo || {})

const tableData = ref([])
const countData = ref([])
const orderChartRef = ref(null)
const userChartRef = ref(null)
const pieChartRef = ref(null)

const tableLabel = {
  name: '商品名称',
  todayBuy: '今日购买',
  monthBuy: '本月购买',
  totalBuy: '总购买量'
}

const avatarUrl = computed(
  () => new URL(`../assets/images/${userInfo.value.avatar || 'user'}.png`, import.meta.url).href
)

let resizeObserver = null
let chartInstances = []

function disposeCharts() {
  chartInstances.forEach((chart) => chart.dispose())
  chartInstances = []

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}

function watchChartsResize() {
  disposeObserverOnly()

  resizeObserver = new ResizeObserver(() => {
    chartInstances.forEach((chart) => chart.resize())
  })

  ;[orderChartRef.value, userChartRef.value, pieChartRef.value]
    .filter(Boolean)
    .forEach((el) => resizeObserver.observe(el))
}

function disposeObserverOnly() {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}

function buildOrderOptions(orderData) {
  return {
    tooltip: { trigger: 'axis' },
    legend: {},
    grid: { left: '12%', right: '6%', bottom: '12%' },
    xAxis: {
      type: 'category',
      data: orderData.date,
      axisLine: {
        lineStyle: { color: '#17b3a3' }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: { color: '#17b3a3' }
      }
    },
    color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
    series: Object.keys(orderData.data[0] || {}).map((key) => ({
      name: key,
      data: orderData.data.map((item) => item[key]),
      type: 'line'
    }))
  }
}

function buildUserOptions(userData) {
  return {
    tooltip: { trigger: 'axis' },
    legend: {},
    grid: { left: '12%', right: '6%', bottom: '12%' },
    xAxis: {
      type: 'category',
      data: userData.map((item) => item.date)
    },
    yAxis: {
      type: 'value'
    },
    color: ['#5ab1ef', '#ffb980'],
    series: [
      {
        name: '新增用户',
        data: userData.map((item) => item.new),
        type: 'bar'
      },
      {
        name: '活跃用户',
        data: userData.map((item) => item.active),
        type: 'bar'
      }
    ]
  }
}

function buildPieOptions(videoData) {
  return {
    tooltip: { trigger: 'item' },
    legend: {},
    color: ['#0f78f4', '#dd536b', '#9462e5', '#a6a6a6', '#e1bb22', '#39c362', '#3ed1cf'],
    series: [
      {
        type: 'pie',
        data: videoData
      }
    ]
  }
}

function initCharts(orderData, userData, videoData) {
  disposeCharts()

  if (orderChartRef.value) {
    const orderChart = echarts.init(orderChartRef.value)
    orderChart.setOption(buildOrderOptions(orderData))
    chartInstances.push(orderChart)
  }

  if (userChartRef.value) {
    const userChart = echarts.init(userChartRef.value)
    userChart.setOption(buildUserOptions(userData))
    chartInstances.push(userChart)
  }

  if (pieChartRef.value) {
    const pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption(buildPieOptions(videoData))
    chartInstances.push(pieChart)
  }

  watchChartsResize()
}

async function getTableData() {
  const data = await proxy.$api.getTableData()
  tableData.value = data.tableData
}

async function getCountData() {
  const data = await proxy.$api.getCountData()
  countData.value = data
}

async function getChartData() {
  const { orderData, userData, videoData } = await proxy.$api.getChartData()
  initCharts(orderData, userData, videoData)
}

onMounted(async () => {
  await Promise.all([getTableData(), getCountData(), getChartData()])
})

onUnmounted(() => {
  disposeCharts()
})
</script>

<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img :src="avatarUrl" class="user" />
          <div class="user-info">
            <p class="user-info-admin">{{ userInfo.username || '未登录用户' }}</p>
            <p class="user-info-p">{{ userInfo.role || '未设置角色' }}</p>
            <p class="user-signature">{{ userInfo.signature || '欢迎来到后台管理系统' }}</p>
          </div>
        </div>
        <div class="login-info">
          <p>最近登录时间：<span>{{ userInfo.lastLoginTime || '暂无记录' }}</span></p>
          <p>最近登录城市：<span>{{ userInfo.lastLoginCity || '未知' }}</span></p>
        </div>
      </el-card>

      <el-card shadow="hover" class="user-table">
        <el-table :data="tableData">
          <el-table-column
            v-for="(val, key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          />
        </el-table>
      </el-card>
    </el-col>

    <el-col :span="16" style="margin-top: 20px">
      <div class="num">
        <el-card
          v-for="item in countData"
          :key="item.name"
          :body-style="{ display: 'flex', padding: 0 }"
        >
          <component
            :is="item.icon"
            class="icons"
            :style="{ background: item.color }"
          />
          <div class="detail">
            <p class="num">{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>

      <el-card class="top-echart">
        <div ref="orderChartRef" style="height: 280px"></div>
      </el-card>

      <div class="graph">
        <el-card>
          <div ref="userChartRef" style="height: 240px"></div>
        </el-card>
        <el-card>
          <div ref="pieChartRef" style="height: 240px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
.home {
  height: 100%;

  .user {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 20px;
    }

    .user-info {
      p {
        line-height: 40px;
      }
    }

    .user-info-p {
      color: #999;
    }

    .user-info-admin {
      font-size: 40px;
    }
  }

  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;

      span {
        color: #171e1a;
        margin-left: 20px;
      }
    }
  }

  .user-table {
    margin-top: 20px;
  }

  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .el-card {
      width: 30%;
      margin-bottom: 20px;
      overflow: hidden;
    }

    .icons {
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }

    .detail {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 80px;
      overflow: hidden;

      .num {
        font-size: 30px;
        margin-bottom: 10px;
      }

      .txt {
        font-size: 15px;
        text-align: center;
        color: #999;
      }
    }
  }

  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .el-card {
      width: 49%;
      overflow: hidden;
    }
  }
}
</style>

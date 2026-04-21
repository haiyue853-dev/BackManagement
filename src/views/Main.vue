<script setup>
import CommonAside from '@/components/commonAside.vue'
import CommonHeader from '@/components/commonHeader.vue'
</script>

<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <common-aside />
      <el-container>
        <el-header class="el-header">
          <common-header />
        </el-header>
        <el-main class="right-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="less">
.common-layout,
.lay-container {
  height: 100vh;
}

.el-header {
  background-color: #535353;
  color: #fff;
}
</style>

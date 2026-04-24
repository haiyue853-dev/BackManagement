<template>
  <div class="tags">
    <el-tag
      v-for="(tag, index) in tags"
      :key="tag.name"
      :closeable="tag.name !== 'home'"
      :effect="route.name === tag.name ? 'dark' : 'light'"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const tags = ref([
  {
    path: '/home',
    name: 'home',
    label: '首页',
    icon: 'home',
  },
])
const route = useRoute()
</script>

<style lang="less" scoped>
.tags {
  margin: 20px 0 0 20px;
}
.el-tag {
  margin-right: 10px;
}
</style>

<template>
  <div class="tags">
    <el-tag
      v-for="(tag, index) in tags"
      :key="tag.name"
      :closable="tag.name !== 'home'"
      :effect="route.name === tag.name ? 'dark' : 'plain'"
      @click="handleMenu(tag)"
      @close="handleClose(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores'
const store = useAllDataStore()
const tags = computed(() => store.state.tags)
const router = useRouter()
const route = useRoute()
const handleMenu = (tag) => {
  router.push(tag.name)
  store.selectMenu(tag)
}
const handleClose = (tag, index) => {
  // 1. 先记录当前要关闭的标签名，用于后续判断
  const closedTagName = tag.name

  // 2. 从 store 中移除标签
  store.removeTag(tag, index)

  // 3. 如果关闭的不是当前激活的标签，直接返回，无需跳转
  if (closedTagName !== route.name) return

  // 4. 获取更新后的标签列表
  const remainingTags = tags.value // computed 会自动更新

  // 5. 如果还有剩余标签，进行跳转
  if (remainingTags.length > 0) {
    let nextTag

    // 策略：优先跳转到后一个，如果没有后一个，则跳转到前一个
    // 注意：因为当前标签已被移除，原来的 index 位置现在坐着原来的 "下一个" 标签
    if (index < remainingTags.length) {
      nextTag = remainingTags[index]
    } else {
      // 如果 index 越界（说明删的是最后一个），则取新的最后一个
      nextTag = remainingTags[remainingTags.length - 1]
    }

    // 6. 更新选中状态并跳转路由
    store.selectMenu(nextTag)
    router.push({ name: nextTag.name })
  } else {
    // 7. 如果没有剩余标签（例如只剩home且home不可关，或者全关了），默认跳回首页
    router.push({ name: 'home' })
  }
}
</script>

<style lang="less" scoped>
.tags {
  margin: 20px 0 0 20px;
}
.el-tag {
  margin-right: 10px;
}
</style>

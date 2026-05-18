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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores'

const store = useAllDataStore()
const router = useRouter()
const route = useRoute()

const tags = computed(() => store.state.tags)

function handleMenu(tag) {
  router.push({ path: tag.path })
  store.selectMenu(tag)
}

function handleClose(tag, index) {
  const closedTagName = tag.name
  store.removeTag(tag)

  if (closedTagName !== route.name) return

  const remainingTags = tags.value

  if (remainingTags.length > 0) {
    const nextTag =
      index < remainingTags.length
        ? remainingTags[index]
        : remainingTags[remainingTags.length - 1]

    store.selectMenu(nextTag)
    router.push({ path: nextTag.path })
    return
  }

  router.push({ name: 'home' })
}
</script>

<style scoped lang="less">
.tags {
  margin: 20px 0 0 20px;
}

.el-tag {
  margin-right: 10px;
}
</style>

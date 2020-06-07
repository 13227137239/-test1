<template>
  <div>
    <el-row>
      <el-button type="danger" @click="tuichu">危险按钮</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    tuichu() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
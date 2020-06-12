<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card >
      <el-table :data="rightList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="330"></el-table-column>
        <el-table-column prop="path" label="路径" width="330"></el-table-column>
        <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level == 0">一级权限</el-tag>
                <el-tag type="success" v-else-if="scope.row.level==1">二级权限</el-tag>
                <el-tag type="danger" v-else>三级权限</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
    data(){
        return{
        rightList:[]
        }
    },
    created(){
    this.getRight()
    },
    methods:{
       async getRight(){
       const {data:src} = await this.$http.get('/rights/list')
       if(src.meta.status !=200) return this.$message.err('获取权限列表失败')
       this.rightList = src.data
       console.log(src)
        }
        
    }
    
}
</script>
<style lang="less" scoped>
</style>
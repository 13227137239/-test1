<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      <tree-table
        class="treeTable"
        border
        :show-index="true"
        :expand-type="false"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
      >
        <template slot="isok" slot-scope="scope">
          <i v-if="!scope.row.cat_deleted" class="el-icon-success" style="color:lightgreen"></i>
          <i v-else class="el-icon-error" style="color:red"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="redact1(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="Delete1(scope.row)">删除</el-button>
        </template>
      </tree-table>
    </el-card>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 4, 8, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 分类弹出框 -->
    <el-dialog title="添加分类" :visible.sync="fenleiVisible" width="50%" @close="close1">
      <el-form
        ref="addCateformRef"
        label-width="95px"
        :model="addCateform"
        :rules="addCateformRules"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- c层级选择器       options代表数据来源  props代表数据规则  v-model把选中的值存起来 -->
          <el-cascader
            @change="parentCatChanged"
            :options="parentCateList"
            v-model="selectedKeys"
            clearable
            :props="cascaderProps"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel1">取 消</el-button>
        <el-button type="primary" @click="submit1">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑分类" :visible.sync="bianjiVisible" width="50%" @close="close2">
      <el-form
        ref="bianjiCateformRef"
        label-width="95px"
        :model="bianjiCateform"
        :rules="bianjiformRules"
      >
        <el-form-item label="分类名称：" prop="bianji_name">
          <el-input v-model="bianjiCateform.bianji_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel2">取 消</el-button>
        <el-button type="primary" @click="submit3">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 4
      },
      //商品数据
      catelist: [],
      //总数据数
      total: 0,
      //指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //定义为模板列
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      fenleiVisible: false,
      //包含了添加的分类的信息
      addCateform: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0 //默认一级分类
      },
      addCateformRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      bianjiformRules: {
        bianji_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      //所有的二级分类信息
      parentCateList: [],
      // 层级多选定义的规则
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      //存放父级id的数组
      selectedKeys: [],
      bianjiVisible: false,

      bianjiCateform: {
        bianji_name: ''
      },
      bianjiId: ''
    }
  },
  methods: {
    async getCateList() {
      const { data: src } = await this.$http.get('/categories', {
        params: this.queryInfo
      })
      if (src.meta.status != 200) return this.$message.error('获取商品列表失败')
      this.catelist = src.data.result
      this.total = src.data.total
    },
    //每页显示条数改变
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    //当前页数改变
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    showAddCateDialog() {
      this.fenleiVisible = true
      this.getparentCateKist()
    },
    async getparentCateKist() {
      const { data: res } = await this.$http.get('/categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status != 200) return this.$message.error('获取分类信息失败')
      this.parentCateList = res.data
    },
    parentCatChanged() {
      // console.log(this.selectedKeys)
      this.addCateform.cat_pid =
        this.selectedKeys[this.selectedKeys.length - 1] ||
        this.addCateform.cat_pid
      this.addCateform.cat_level = this.selectedKeys.length
    },
    //关闭添加对话框
    cancel1() {
      this.$refs.addCateformRef.resetFields()
      this.selectedKeys = []
      this.addCateform.cat_level = 0
      this.addCateform.cat_pid = 0
      this.fenleiVisible = false
    },
    //取消分类对话框
    close1() {
      this.$refs.addCateformRef.resetFields()
      this.selectedKeys = []
      this.addCateform.cat_level = 0
      this.addCateform.cat_pid = 0
    },
    //分类对话框的提交
    submit1() {
      this.$refs.addCateformRef.validate(async val => {
        if (!val) return this.$message.error('请填写分类名称')
        else {
          const { data: src } = await this.$http.post(
            '/categories',
            this.addCateform
          )
          if (src.meta.status != 201) return this.$message.error('添加分类失败')
          this.$message.success('添加分类成功')
          this.addCateform.cat_level = 0
          this.addCateform.cat_pid = 0
          this.getCateList()
          this.fenleiVisible = false
        }
      })
    },
    //编辑函数
    redact1(val) {
      this.bianjiVisible = true
      this.bianjiId = val.cat_id
      console.log(val)
    },
    close2() {
      this.$refs.bianjiCateformRef.resetFields()
    },
    cancel2() {
      this.$refs.bianjiCateformRef.resetFields()
      this.bianjiVisible = false
    },
    async submit3() {
      const { data: src } = await this.$http.put(
        '/categories/' + this.bianjiId,
        {
          cat_name: this.bianjiCateform.bianji_name
        }
      )
      if (src.meta.status != 200) return this.$message.error('修改失败')
      this.$message.success('修改成功')
      this.getCateList()
      this.bianjiVisible = false
      console.log(this.bianjiCateform)
    },
    //删除函数
    //
    //

    Delete1(val) {
      console.log(val)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: src } = await this.$http.delete(
            '/categories/' + val.cat_id
          )
          if (src.meta.status != 200) return this.$message.error('删除失败')
          this.getCateList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created() {
    this.getCateList()
  }
}
</script>


<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
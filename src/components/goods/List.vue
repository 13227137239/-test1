<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="40">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="qingkong">
            <el-button slot="append" icon="el-icon-search" @click="sousuo"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addgoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="100">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>

        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="bianji(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="Delete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[4,6,8,15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 编辑弹出框 -->
    <el-dialog title="提示" :visible.sync="bianjidialogVisible" width="50%" @close="guanbi">
      <el-form :model="bianjiForm" :rules="bianjirules" ref="bianjiruleForm" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="bianjiForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="bianjiForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number" type="number">
          <el-input v-model="bianjiForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight" type="number">
          <el-input v-model="bianjiForm.goods_weight"></el-input>
        </el-form-item>
        <span >
          <el-button @click="bianjiqvxiao">取 消</el-button>
          <el-button type="primary" @click="biaojitijiao">确 定</el-button>
        </span>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //用于获取列表提交的数据
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      //得到的商品列表
      tableData: [],
      total: 0,
      //控制编辑弹出框
      bianjidialogVisible: false,
      //编辑提交数据
      bianjiForm: {
        good_cat:'',
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
      },
        //编辑弹出框规则
        bianjirules: {
          goods_name: [
            {
              required: true,
              message: '请输入商品名称',
              trigger: 'blur'
            }
          ],
          goods_price: [
            {
              required: true,
              message: '请输入商品价格',
              trigger: 'blur'
            }
          ],
          goods_number: [
            {
              required: true,
              message: '请输入商品数量',
              trigger: 'blur'
            }
          ],
          goods_weight: [
            {
              required: true,
              message: '请输入商品重量',
              trigger: 'blur'
            }
          ]
        },
        //要修改的id
        bianjiaId:0
      }
    
  },
  methods: {
    //获取商品列表的函数
    async getGoodsList() {
      const { data: src } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (src.meta.status != 200) return this.$message.error('获取商品列表失败')
      this.tableData = src.data.goods
      this.total = src.data.total
      console.log(src)
    },
    //分页控制显示商品条数
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    //分页控制当前在哪一页
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    //搜索按钮
    sousuo() {
      this.getGoodsList()
    },
    //清空按钮
    qingkong() {
      this.getGoodsList()
    },
    //添加商品
    addgoods() {
      this.$router.push('/goods/add')
    },
    //删除商品
    Delete(val) {
      console.log(val.goods_id)
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: src } = await this.$http.delete(
            '/goods/' + val.goods_id
          )
          console.log(src)
          if (src.meta.status != 200) return this.$message.error('删除失败')
          this.getGoodsList()
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
    },
    //编辑商品按钮
    async bianji(val) {
      const { data: src } = await this.$http.get('/goods/' + val.goods_id)
      
      if (src.meta.status != 200) return this.$message.error('获取商品信息失败')
     console.log(src)
      this.bianjiaId = src.data.goods_id
      this.bianjiForm.goods_name = src.data.goods_name
      this.bianjiForm.goods_price = src.data.goods_price
      this.bianjiForm.goods_number = src.data.goods_number
      this.bianjiForm.goods_weight = src.data.goods_weight
      this.bianjiForm.goods_cat = src.data.goods_cat
      this.bianjidialogVisible = true
    },
    //编辑弹出框取消
    bianjiqvxiao() {
      this.$refs.bianjiruleForm.resetFields()
       this.bianjidialogVisible=false
    },
    //编辑弹出框确认
   async biaojitijiao() {
console.log(this.bianjiForm)
console.log(this.bianjiaId)
    const {data:src} = await this.$http.put("/goods/"+this.bianjiaId,this.bianjiForm)
    console.log(src)
  if(src.meta.status !=200) return this.$message.error("修改失败")
  this.$message.success("修改成功")
  this.getGoodsList()
  this.bianjidialogVisible = false
  console.log(this.bianjiForm)
    },
    //编辑弹出框关闭
    guanbi() {
       this.$refs.bianjiruleForm.resetFields()
      
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>
<style lang="less" scoped>
.el-table {
  font-size: 11px;
}
.el-button {
  margin-top: 0 !important;
  margin-left: 2px;
  margin-right: 2px;
}
</style>
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="40">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="qingkong">
            <el-button slot="append" icon="el-icon-search" @click="sousuo"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="380"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="80">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.order_pay == 0" type= 'warning'>未付款</el-tag>
                <el-tag v-else type:='success'>已付款</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80"></el-table-column>
        <el-table-column prop="update_time" label="下单时间" width="180">
            <template slot-scope="scope">
                {{scope.row.update_time | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template>
               <el-button type="primary" icon="el-icon-edit" size="small" @click="alter"></el-button>
                <el-button type="success" icon="el-icon-location" size="small" @click="showpress"></el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 4, 8, 12]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 修改弹出框 -->
    <el-dialog
  title="修改地址"
  :visible.sync="dialogVisible"
  width="50%"
  @close="addressdialogclose"
  >
  <el-form :model="addressForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="省市区/县" prop="address1">
  <el-cascader :options="CityData" v-model="addressForm.address1" ></el-cascader>
  </el-form-item>
  <el-form-item label="详细地址" prop="address2">
    <el-input v-model="addressForm.address2"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cencel">取 消</el-button>
    <el-button type="primary" @click="xiugaidizhi">确 定</el-button>
  </span>
</el-dialog>
<!-- 物流信息对话框 -->
<el-dialog
  title="物流信息"
  :visible.sync="dialogVisible2"
  width="50%"
  @close="addressdialogclose2"
  >
  <el-timeline reverse>
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.ftime">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
  </div>
</template>
<script>
import CityData from './citydata.js'

export default {
  data() {
    return {
      //订单请求数据
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      //表格数据
      tableData: [],
      //总数据数量
      total:4,
      //编辑弹出框的显示
      dialogVisible:false,
      //地址修改弹出框的值
      addressForm:{
address1:[],
address2:''
      },
      //地址修改弹出框的规则
      rules:{
        address1:[{
            required:'true',
            message:'请选择省市区/县',
            trigger:"blur"
        }],
        address2:[{
            required:'true',
            message:'请填写详细地址',
            trigger:"blur"
        }]  
      },
      //省市区数据
      CityData,
      //控制物流查看对话框
      dialogVisible2:false,
      //物流信息
      activities:[]


    }
  },
  methods: {
    //获取订单数据函数
    async getOrdersList() {
      const { data: src } = await this.$http.get('/orders', {
        params: this.queryInfo
      })
      console.log(src)
      if (src.meta.status != 200) return this.$message.error('获取订单列表失败')
      this.tableData = src.data.goods
      this.total = src.data.total
    },
    //清空搜索栏
    qingkong() {
        this.getOrdersList()
    },
    //搜索事件
    sousuo() {
        console.log(this.queryInfo)
        this.getOrdersList()
    },
    //一页应有多少数据
    handleSizeChange(val){
        this.queryInfo.pagesize = val
this.getOrdersList()
},
//分页控制第几页
handleCurrentChange(val){
    this.queryInfo.pagenum = val
    this.getOrdersList()
},
//修改地址
alter(){
this.dialogVisible = true
},
//修改弹出框取消
cencel(){
  this.$refs.ruleForm.resetFields()
    this.dialogVisible = false
},
//修改弹出框提交
xiugaidizhi(){},
//弹出框关闭
addressdialogclose(){
  this.$refs.ruleForm.resetFields()
},
//查看物流进度按钮
async showpress(){
  const {data : src} = await this.$http.get("/kuaidi/1106975712662")
  if(src.meta.status != 200) return this.$message.error("获取物流信息失败")
  console.log(src)
this.activities = src.data
  this.dialogVisible2=true
  
},
//物流进度关闭事件
addressdialogclose2(){},
  },
  created() {
    this.getOrdersList()
  }
}
</script>
<style lang="less" scoped>

</style>
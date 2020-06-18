<template>
    <div>
         <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
           <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
    </div>
</template>
<script>
//   <!-- 引入 echarts.js -->
import echarts from 'echarts'
import _ from 'lodash'
  
export default {
    data(){
        return{
            //需要合并的数据
options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
        }
    },
    methods:{},
  //dom渲染完成时的钩子函数
  async  mounted(){
var myChart = echarts.init(document.getElementById('main'));
    const {data:src} = await this.$http.get("/reports/type/1")
    console.log(src)
    if(src.meta.status!=200) return this.$message.error("获取数据报表失败")
 
    const result = _.merge(src.data,this.options)

        myChart.setOption(result);
    }
    
}
</script>
<style lang="less" scoped>

</style>
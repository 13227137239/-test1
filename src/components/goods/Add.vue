<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 提示信息 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="+activeIndex" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs   用form表单包裹 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs :tab-position="'left'" style="height: aotu;" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- 层级选择器 -->
            商品分类：
                  <el-cascader
            @change="parentCatChanged"
            :options="parentCateList"
            v-model="selectedKeys"
            clearable
            :props="cascaderProps"
            :show-all-levels="false"
          ></el-cascader>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
     <el-checkbox :label="item1" v-for="(item1,index) in item.attr_vals" :key="index" border></el-checkbox>
  </el-checkbox-group>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item,index) in onlyTableData" :key="index">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
<!-- 上传图片 -->
            <el-upload
  action="http://127.0.0.1:8888/api/private/v1/upload"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  list-type="picture"
  :headers="headerObj"
  :on-success='handleSuccess'>
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览弹出框 -->
    <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="50%"
  >
<img :src="imgsrc"  class="imgclass" />
</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: '0',
      //发送的数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat:'',
        pics:[],
        //商品描述
        goods_introduce:"",
        attrs:[]
      },
      addFormRules: {
        goods_name: [
              {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          },
          {
              min:1,
              max:40,
              message:'长度不符合要求',
              trigger:"blur"
          }
        ],
        goods_price: [
            {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
              {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
              {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ]
      },
      //商品分类数据
      parentCateList:[],
      //层级选择器规则
       cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover',
        
      },
      //层级选择器选的的数据
      selectedKeys:[],
      //获取到的当前分类的商品动态属性
      manyTableData:[],
      //获取到的当前分类静态属性
      onlyTableData:[],
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      //控制对话框出现关闭
      dialogVisible:false,
      //img的src地址
      imgsrc:''
    }
  },
  methods: {
    //   获取商品分类信息
   async getCateList(){
        const { data: res } = await this.$http.get('/categories', {
        params: {
          type: 3
        }
      })
      if (res.meta.status != 200) return this.$message.error('获取分类信息失败')
      this.parentCateList = res.data
    },
    //层级选择器选中时，转化后得出goods_cats
    parentCatChanged(){
 let bbb = this.selectedKeys.join(",")
this.addForm.goods_cat = bbb
        // console.log(this.addForm.goods_cat)
        console.log(this.selectedKeys)
       
    },
    //标签页发生切换后的事件
    beforeTabLeave(activeName,oldActiveName){
      if(oldActiveName=='0'&&!this.addForm.goods_cat){
        this.$message.error("请先选择商品分类！")
        return false
      }
    },
    //tab被点击的事件  //获取了商品属性
   async tabClicked(){
   console.log(this.activeIndex)  
   //获取动态属性
   if(this.activeIndex === '1'){
   const {data:src} = await this.$http.get("categories/"+this.selectedKeys[2]+"/attributes",{
       params:{
         sel:'many'
       }
     })
     if(src.meta.status !=200) return this.$message.error("获取属性失败")
     src.data.forEach(item=>{
    item.attr_vals = item.attr_vals.length === 0?[]: item.attr_vals.split(" ")
     })
     this.manyTableData = src.data
     console.log(src)
   } 
  // 获取动态属性
   if(this.activeIndex === '2'){
   const {data:src} = await this.$http.get("categories/"+this.selectedKeys[2]+"/attributes",{
       params:{
         sel:'only'
       }
     })
     if(src.meta.status !=200) return this.$message.error("获取属性失败")
     this.onlyTableData = src.data
     console.log(src)
   } 
   console.log(this.onlyTableData)
    },
    //点击预览图片的事件
    handlePreview(file){
      console.log(file)
      this.dialogVisible = true
      this.imgsrc = file.response.data.url
    },
    //关闭预览图片事件
    handleRemove(file, fileList){
      let i=0
     this.addForm.pics.forEach(item=>{
       if(item.pic == file.response.data.tmp_path){
         console.log(i)
         this.addForm.pics.splice(i,1)
       }
       i++
     })
console.log(this.addForm)
    },
    //图片上传成功事件
    handleSuccess(res){
      const picinfo = {pic:res.data.tmp_path}
      this.addForm.pics.push(picinfo)
console.log(this.addForm)
    },
    //添加商品事件
   async add(){
      this.$refs.addFormRef.validate(vaild=>{
        if(!vaild) return this.$message.error("信息填写未符合标准")
      })
      //处理动态参数
      this.manyTableData.forEach(item=>{
        const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
        this.addForm.attrs.push(newInfo)
      })
      this.onlyTableData.forEach(item=>{
        const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
        this.addForm.attrs.push(newInfo)
      })
      const {data:src} =  await this.$http.post("/goods/",this.addForm)
       console.log(src)
      if(src.meta.status !=201) return this.$message.error("添加商品失败")
      this.$message.success("添加商品成功")
      this.$router.push("/goods")
     
      console.log(this.addForm)
      console.log(this.manyTableData)
      console.log(this.onlyTableData)
    }
  },
  created() {
      this.getCateList()
  }
}
</script>
<style lang="less" scoped>
.el-steps {
  margin: 15px 0px;
}
.el-checkbox{
  margin: 5px 10px;
}

.imgclass{
 height: 100%;
 width: 100%;
.ql-editor{
  min-height: 500px;
}

}


</style>
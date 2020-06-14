<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数!" type="warning" show-icon></el-alert>
      <span>选择商品分类：</span>
      <el-cascader
        :options="CateList"
        :show-all-levels="false"
        :props="Cateprops"
        v-model="CateKey"
        @change="Catechange"
        clearable
      ></el-cascader>
      <!-- tab栏--------------------------------------------------------- -->

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="btnboolean" @click="Catebtn">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="mantTabData" border style="width: 100%">
            <!-- 展开行-- -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  @close="dtag(scope.row,index)"
                
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="$event.target.blur"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!--  -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="480"></el-table-column>
            <el-table-column prop="name" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="xgxianshi(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="shanchu1(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="btnboolean" @click="Catebtn">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTabData" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="480"></el-table-column>
            <el-table-column prop="name" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="xgxianshi(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="shanchu1(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog @close="Cateclose" :title="'修改'+Catetitle" :visible.sync="Catedialognow" width="40%">
      <el-form label-width="120px" :rules="CateFormRules" :model="CateForm" ref="CateFromRef">
        <el-form-item :label="Catetitle+'名称'" prop="attr_name">
          <el-input v-model="CateForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit3">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      @close="xiugaiclose"
      :title="'修改'+xiugaititle"
      :visible.sync="xgdialognow"
      width="40%"
    >
      <el-form label-width="120px" :rules="xgFormRules" :model="xgForm" ref="xgFromRef">
        <el-form-item :label="xiugaititle+'名称'" prop="xgname">
          <el-input v-model="xgForm.xgname"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel2">取 消</el-button>
        <el-button type="primary" @click="submit4">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      CateList: [], //全部参数数据，用来渲染层级选择器
      Cateprops: {
        //层级选择器规则
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      CateKey: [], //层级选择器选中的数据数组
      activeName: 'many', //当前tab状态（动态还是静态）
      btnboolean: true, //添加按钮是否可选
      mantTabData: [], //静态属性数据
      onlyTabData: [], //动态属性数据
      Catetitle: '', //添加对话框标题
      Catedialognow: false, //控制添加对话框显示
      CateForm: {
        attr_name: '' //添加对话框中输入框数据
      },
      //添加对话框中输入框规则
      CateFormRules: {
        attr_name: [
          { required: true, message: '该行不能为空', trigger: 'blur' }
        ]
      },
      //控制修改对话框显示
      xgdialognow: false,
      //修改对话框规则
      xgFormRules: {
        xgname: [
          {
            required: true,
            message: '该行不能为空',
            trigger: 'blur'
          }
        ]
      },
      //修改对话框中数据
      xgForm: {
        xgname: ''
      },
      //当前选中的属性id
      attr_id: '',
      //控制添加tag的小input
      inputVisible:false,
      //小input里的值
      inputValue:''
    }
  },
  methods: {
    //获取层级分类的数据
    async getCateList() {
      const { data: src } = await this.$http.get('/categories', {
        params: {
          type: 3
        }
      })
      if (src.meta.status != 200) return this.$message.error('获取商品分类失败')
      this.CateList = src.data
    },
    //层级切换事件
    Catechange() {
      if (this.CateKey.length == 3) {
        this.getParamsData()
        this.btnboolean = false
      } else {
        this.btnboolean = true
      }
    },
    //tab点击切换事件
    handleClick() {
      this.getParamsData()
    },
    //获取参数数据
    async getParamsData() {
      const { data: src } = await this.$http.get(
        'categories/' + this.cateId + '/attributes',
        { params: { sel: this.activeName } }
      )
      if (src.meta.status != 200) return this.$message.error('未获取到参数')
      if (this.activeName === 'many') {
        this.mantTabData = src.data
      } else {
        this.onlyTabData = src.data
      }
      src.data.forEach(item => {
        item.attr_vals = item.attr_vals.split(' ')
      })
      console.log(src.data)
    },
    Catebtn() {
      if (this.activeName === 'many') {
        this.Catetitle = '动态参数'
      } else {
        this.Catetitle = '静态属性'
      }
      this.Catedialognow = true
    },
    //关闭添加动态框事件
    Cateclose() {
      this.$refs.CateFromRef.resetFields()
    },
    //取消修改动态库事件
    cancel() {
      this.Catedialognow = false
      this.$refs.CateFromRef.resetFields()
    },
    //修改修改动态库事件
    submit3() {
      this.$refs.CateFromRef.validate(async vaild => {
        if (!vaild) return this.$message.error('添加失败')
        else {
          const { data: src } = await this.$http.post(
            'categories/' + this.cateId + '/attributes/',
            {
              attr_name: this.CateForm.attr_name,
              attr_sel: this.activeName
            }
          )
          if (src.meta.status != 201) return this.$message.error('添加失败')
          this.$message.success('添加成功')
          this.getParamsData()
          this.Catedialognow = false
        }
      })
    },
    //关闭编辑对话框事件
    xiugaiclose() {
      this.$refs.xgFromRef.resetFields()
    },
    //修改按钮点击事件
    xgxianshi(src) {
      this.attr_id = src.attr_id
      this.xgForm.xgname = src.attr_name
      this.xgdialognow = true
    },
    //修改对话框取消事件
    cancel2() {
      this.$refs.xgFromRef.resetFields()
      this.xgdialognow = false
    },
    //修改对话框提交事件
    submit4() {
      this.$refs.xgFromRef.validate(async val => {
        if (!val) return this.$message.error('修改失败')
        else {
          const { data: src } = await this.$http.put(
            'categories/' + this.cateId + '/attributes/' + this.attr_id,
            {
              attr_name: this.xgForm.xgname,
              attr_sel: this.activeName
            }
          )
          if (src.meta.status != 200) return this.$message.error('修改失败')
          this.$message.success('修改成功')
          this.getParamsData()
          this.xgdialognow = false
        }
      })
    },
    //删除按钮事件
    shanchu1(val) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: src } = await this.$http.delete(
            '/categories/' + this.cateId + '/attributes/' + val.attr_id
          )

          if (src.meta.status != 200) return this.$message.error('删除失败')
          this.getParamsData()
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
    //删除tag事件
    async dtag(val, index) {
      val.attr_vals.splice(index, 1)
      console.log(val.attr_vals.join(' '))
      const { data: src } = await this.$http.put(
        'categories/' + this.cateId + '/attributes/' + val.attr_id,
        {
          attr_name: val.attr_name,
          attr_sel: this.activeName,
          attr_vals: val.attr_vals.join(' ')
        }
      )
      if (src.meta.status != 200) this.$message.error('删除失败')
      this.$message.success('删除成功')
    },
    //点击开启小input
    showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //回车添加属性或者失去焦点添加属性
     async handleInputConfirm(val){
       this.inputVisible = false
      val.attr_vals.push(this.inputValue)
       this.inputValue = ''
      const { data: src } = await this.$http.put(
        'categories/' + this.cateId + '/attributes/' + val.attr_id,
        {
          attr_name: val.attr_name,
          attr_sel: this.activeName,
          attr_vals: val.attr_vals.join(' ')
        }
      )

      if (src.meta.status != 200) this.$message.error('添加失败')
      this.$message.success('添加成功')
      
      },
      //

  },
  computed: {
    //获取选中的第三级id
    cateId() {
      if (this.CateKey.length == 3) {
        return this.CateKey[2]
      }
      return null
    },
    //给修改对话框改标题
    xiugaititle() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },

  created() {
    this.getCateList()
  }
}
</script>
<style lang="less" scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-tag {
  margin: 10px 10px;
}
.el-input{
  width: 180px;
}
</style>
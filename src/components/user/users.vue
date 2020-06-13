<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-d-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="qingkong">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="160"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 利用作用域插槽获取数据 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-tooltip
                class="item"
                effect="dark"
                content="修改"
                placement="top"
                :enterable="false"
              >
                <el-button @click="showEditDialog(scope.row)" icon="el-icon-edit" circle></el-button>
              </el-tooltip>
              <!-- 修改用户信息 -->
              

              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button icon="el-icon-delete" circle @click="Delete(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="设置"
                placement="top"
                :enterable="false"
              >
              <!-- 权限设置 -->
                <el-button icon="el-icon-setting" circle @click="quanxian(scope.row)"></el-button>   
              </el-tooltip>
            </el-row>
            <!-- 修改用户弹出框 -->
            <el-dialog
                @close="showDialogClosed"
                title="修改用户"
                :visible.sync="showDialogVisible"
                width="40%"
              >goo
                <el-form
                  label-width="80px"
                  :rules="showFormRules"
                  :model="showForm"
                  ref="showFromRef"
                >
                  <el-form-item label="用户名" >
                    <el-input v-model="showForm.username" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="用户邮箱" prop="email">
                    <el-input v-model="showForm.email"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="showForm.mobile"></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="cancel2">取 消</el-button>
                  <el-button type="primary" @click="submit2()">确 定</el-button>
                </span>
              </el-dialog>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 9]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog @close="addDialogClosed" title="添加用户" :visible.sync="addDialogVisible" width="40%">
      <el-form label-width="80px" :rules="addFormRules" :model="addForm" ref="addFromRef">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 权限分配对话框 -->
    <el-dialog :visible.sync="fenpeiDialogVisible" width="40%" title="设置权限" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{quanxianForm.userName}} </p>
        <p>当前的角色：{{quanxianForm.roleName}}</p>
        <p> 选择角色： <el-select v-model="rolehh" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select></p>
      </div>
   
   

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel3">取 消</el-button>
        <el-button type="primary" @click="submit3">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[34578]\d{9}$$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }
    return {
      fenpeiDialogVisible:false,
      showDialogVisible: false,
      showForm: {
        id:'',
        username:'',
        email:"",
        mobile:''
      },
      showFormRules: {
        email: [
          {
            type: 'email',
            message: '请填写格式正确的邮箱地址',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            validator: checkPhone,
            message: '请输入正确的电话号码',
            trigger: 'blur'
          }
        ]
      },
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 9
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          {
            min: 4,
            max: 10,
            message: '长度在 4 到 10 个字符',
            trigger: 'blur'
          },
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          {
            min: 6,
            max: 10,
            message: '长度在 6 到 10 个字符',
            trigger: 'blur'
          },
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          {
            type: 'email',
            message: '请填写格式正确的邮箱地址',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            validator: checkPhone,
            message: '请输入正确的电话号码',
            trigger: 'blur'
          }
        ]
      },
      //用户的数据
      quanxianForm:{
        nameId:"",
        rolesId:"",
        userName:'',
        roleName:''
      },
      //所有角色的数据
      rolesList:[],
      rolehh:''


    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        //把queryinfo传过去
        params: this.queryInfo
      })
      if (res.meta.status != 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      //xx每页
      this.queryInfo.pagesize = newSize
      this.getUserList()
      // console.log(newSize);
    },
    handleCurrentChange(newCurrent) {
      //页码
      this.queryInfo.pagenum = newCurrent
      this.getUserList()
    },
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
        '/users/' + userinfo.id + '/state/' + userinfo.mg_state
      )
      if (res.meta.status != 200) return this.$message.error('状态修改失败')
      this.$message.success('状态修改成功')
    },
    qingkong() {
      this.getUserList()
    },
    cancel() {
      this.$refs.addFromRef.resetFields()
      this.addDialogVisible = false
    },
    submit() {
      this.$refs.addFromRef.validate(async vaild => {
        if (!vaild) return
        else {
          const { data: res } = await this.$http.post('/users', this.addForm)
          console.log(res)
          if (res.meta.status != 201) return this.$message.error('添加失败')
          this.addDialogVisible = false
          this.$message.success('添加成功')
          this.getUserList()
        }
      })
    },

    addDialogClosed() {
      this.$refs.addFromRef.resetFields()
    },
    Delete(val) {
  this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          const res = await this.$http.delete('users/' + val.id)
      if (res.status != 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getUserList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

      
    },
    // 弹出修改对话框
    showEditDialog(val) {
      // console.log(val)                   
      this.showDialogVisible = true
      this.showForm.username  = val.username
      this.showForm.id = val.id      //保存用户id-------------------------------------
    },
    cancel2(){
      this.$refs.showFromRef.resetFields()
      this.showDialogVisible = false
    },
    showDialogClosed(){
       this.$refs.showFromRef.resetFields()
      this.showDialogVisible = false
    },

    setRoleDialogClosed(){
      this.rolehh =""
    },
   submit2(){
    this.$refs.showFromRef.validate(async vaild =>{
if(!vaild) return
else{
   const res = await this.$http.put("/users/"+this.showForm.id,{
       email:this.showForm.email,
       mobile:this.showForm.mobile
     });
     this.showDialogVisible =false
     if(res.status!=200) return this.$message.error('修改失败')
     this.$message.success('修改成功')
     this.getUserList();
     console.log(res)
}

    }) 
    },
    // 打开权限分配对话框
  async  quanxian(val){
      console.log(val)
      //用户名
      this.quanxianForm.userName = val.username
      //角色名
      this.quanxianForm.roleName = val.role_name
      //用户id
  this.quanxianForm.nameId = val.id
  const {data:src} =await this.$http.get("/roles")      
  if(src.meta.status !=200) return this.$message.error("角色列表获取失败")
    this.rolesList = src.data
    console.log(src)
      this.fenpeiDialogVisible = true
    },
// 权限对话框取消
cancel3(){
  this.rolehh=""
  this.fenpeiDialogVisible = false
},
// 权限对话框提交
   async submit3(){
     if(!this.rolehh) return this.$message.error("请选择要修改的角色");
      const {data:src} = await this.$http.put("/users/"+ this.quanxianForm.nameId+"/role",{rid:this.rolehh})
      console.log(src)
      if(src.meta.status !=200) return this.$message.error("修改角色失败");
      this.$message.success("修改角色成功");
      this.fenpeiDialogVisible = false
      this.getUserList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
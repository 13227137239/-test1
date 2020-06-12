<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" style="width: 100%" border>
        <el-table-column type="expand">
          <!-- 下拉框=------------------------------------------------ -->
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1==0?'bdtop':'bdbottom' ,'col1']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5" > 
                    <el-tag closable  @close="dtag({id1:scope.row,id2:item1.id})">{{item1.authName}} </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="19">
                <!-- 二级权限------------------------------------------ -->
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="['',item1.children.length==1&&i2==0||item1.children.length-1==i2?'':'bdbottom','col1' ]"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable @close="dtag({id1:scope.row,id2:item2.id})">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    
                      <!-- 三级权限0---------------------------------------------------- -->
                      <el-tag
                        :key="item3.id"
                        v-for="(item3) in item2.children"
                        closable
                        @close="dtag({id1:scope.row,id2:item3.id})"
                      >{{item3.authName}}</el-tag>
                    
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre></pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="120px"></el-table-column>
        <el-table-column label="名称" prop="roleName" width="180px"></el-table-column>
        <el-table-column label="描述" prop="roleDesc" width="300px"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="medium"
              @click="compileid(scope.row)"
            >编辑</el-button>
            <el-button
              type="success"
              icon="el-icon-delete"
              size="medium"
              @click="DeleteR(scope.row)"
            >删除</el-button>
            <el-button type="warning" icon="el-icon-s-check" size="medium" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框------------------------------------------------------------- -->
    <el-dialog @close="showDialogClosed" title="添加角色" :visible.sync="addDialogVisible" width="40%">
      <el-form label-width="80px" :rules="roleFormRules" :model="rolesForm" ref="showFromRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel2">取 消</el-button>
        <el-button type="primary" @click="submit2()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 ---------------------------------------------------------- -->
    <el-dialog @close="compile" title="编辑角色" :visible.sync="compilenow" width="40%">
      <el-form label-width="80px" :rules="roleFormRules" :model="comForm" ref="comFromRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="comForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="comForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel3">取 消</el-button>
        <el-button type="primary" @click="submit3()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框---------------------------------------------------------------- -->
      <el-dialog @close="roles1" title="分配权限" :visible.sync="rolesnow" width="40%">
        <!-- s树== -->
        <el-tree :data="rightList" :props="rightprops" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys"  ref="treeRef"></el-tree>
       <span slot="footer" class="dialog-footer">
        <el-button @click="rrlloo">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],   //角色信息       
      rightList:[],    //所有权限信息
      addDialogVisible: false,
      rolesForm: {
        roleName: '',
        roleDesc: ''
      },
      //判断规则-----------------------------------------------
      roleFormRules: {
        roleName: [
          {
            message: '请填写角色名',
            required: true,
            trigger: 'blur'
          },
          {
            min: 2,
            max: 8,
            message: '长度控制在2到8个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            min: 2,
            max: 9,
            message: '长度控制在2到9个字符',
            trigger: 'blur'
          }
        ]
      },
      compilenow: false,
      comForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      //分配权限对话框的显示与隐藏
     rolesnow:false,
     rightprops:{
        children: 'children',
          label: 'authName'
     },
     defkeys:[],    //已有权限多选框
     keyid :""
    }
  },
  methods: {
    // 获取整个页面信息
    async getRoles() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status != 200) return this.$message.error('获取角色失败')
      this.rolesList = res.data
    },
    show() {
      this.showDialogVisible = true
    },
    cancel2() {
      this.$refs.showFromRef.resetFields()
      this.addDialogVisible = false
    },
    submit2() {
      this.$refs.showFromRef.validate(async val => {
        if (!val) return this.$message.error('添加角色失败')
        const { data: src } = await this.$http.post('roles', this.rolesForm)
        if (src.meta.status != 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
        this.addDialogVisible = false
        this.getRoles()
      })
    },
    showDialogClosed() {
      this.$refs.showFromRef.resetFields()
    },
    compile() {
      this.$refs.comFromRef.resetFields()
    },
    cancel3() {
      this.$refs.comFromRef.resetFields()
      this.compilenow = false
    },
    submit3() {
      this.$refs.comFromRef.validate(async val => {
        if (!val) return this.$message.error('修改角色失败')
        const { data: res } = await this.$http.put(
          '/roles/' + this.comForm.id,
          {
            roleName: this.comForm.roleName,
            roleDesc: this.comForm.roleDesc
          }
        )
        if (res.meta.status != 200)
          return this.$message.error('修改角色信息失败')
        this.$message.success('修改成功')
        this.compilenow = false
        this.getRoles()
      })
    },
    compileid(val) {
      this.compilenow = true
      this.comForm.id = val.id
    },
    //删除角色---------------------------------------------------------
    DeleteR(val) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + val.id)
          if (res.meta.status != 200) return this.$message.error('删除失败')
          this.getRoles()
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
    // 删除权限------------------------------------------------------------
     dtag(val){  //val = {id1:角色，id2:权限id}
     console.log(val)
    this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + val.id1.id+'/rights/'+val.id2)
          if (res.meta.status != 200) return this.$message.error('删除失败')
          // this.getRoles() ------------------------会重新渲染整个界面，体验不好
          val.id1.children = res.data // 直接改变角色信息，这样就不会渲染整个界面
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
    // 分配权限弹框--------------------------------------------------------
   async  showSetRightDialog(val){
     console.log(val)
 this.keyid = val.id
//  console.log(this.keyid)
//获取权限数据
this.defkeys = [] 
       const {data:src} = await this.$http.get('/rights/tree')
       if(src.meta.status !=200) return this.$message.err('获取权限列表失败')
       this.rightList = src.data
      for(let i=0;i<val.children.length;i++){
        let arr1 = [];
        arr1 = val.children
        for(let j=0;j<arr1.length;j++){
          let arr2 = []
          arr2 = arr1[j].children  
          for(let m=0;m<arr2.length;m++){
            let arr3=[]
            arr3=arr2[m].children
       for(let n=0;n<arr3.length;n++){
         this.defkeys.push(arr3[n].id)
       }
         
          }
        }
      }
      this.rolesnow=true
    },
    roles1(){
      this.defkeys = []  //清空数组
    },
    rrlloo(){
      this.defkeys=[]
      this.rolesnow =false
    },
    //分配权限事件
    async allotRights(){
     let keys = []
     keys =  this.$refs.treeRef.getCheckedKeys()
     keys = keys.concat(this.$refs.treeRef.getHalfCheckedKeys())
     let idStr = keys.join(',')
     const {data:src} =await this.$http.post("roles/"+this.keyid+"/rights",{rids:idStr})
     if(src.meta.status !=200) return this.$message.error("修改权限失败");
     this.$message.success("修改权限成功");
     this.getRoles()
     this.rolesnow =false
    }
    

  },
  created() {
    this.getRoles()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.col1{
  display: flex;
  align-items: center;
}
</style>
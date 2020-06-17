<template>
  <el-container>
    <el-header height="70px">
      <img src="../assets/12.jpg" alt />
      后台管理系统？
      <el-button type="danger" @click="tuichu">退出登录</el-button>
    </el-header>

    <el-container>
      <el-aside :width="isCollapse ?'64px':'200px'">
        <!-- 侧边栏 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#34495e"
          text-color="#ecf0f1"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active ="activePath"
        >
          <el-submenu :index="item.id+''" v-for="(item) in menulist" :key="item.id">
            <template slot="title">
              <i :class="icoObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+subItem.path+''" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path+'')">
              <i class="el-icon-menu"></i>
              {{subItem.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  data() {
    return {
      activePath:'',
      isCollapse: false,
      menulist: [],
      icoObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-box',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-receiving'
      }
    }
  },
  methods: {
    saveNavState(activePath){
window.sessionStorage.setItem('activePath',activePath) 
this.activePath = activePath
    },
    tuichu() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
     
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.el-button {
  height: 40px;
}
.el-container:nth-child(1) {
  height: 100%;
  position: relative;
}
.el-header {
  background-color: #1abc9c;
  height: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 35px;
  letter-spacing: 5px;
  color: aliceblue;
  font-family: '宋体', '苹方', '微软雅黑';
  padding-left: 60px;
  font-weight: 900;
}
.el-aside {
  background-color: #34495e;
}
.el-main {
  background-color: #f5f6fa;
  position: relative;
}
.el-footer {
  background-color: #34495e;
}
img {
  height: 50px;
  width: 50px;
  border-radius: 25px;
  position: absolute;
  left: 5px;
}
.toggle-button {
  text-align: center;
  line-height: 30px;
  background-color: #2c3e50;
  font-size: 14px;
  color: whitesmoke;
  letter-spacing: 2px;
  cursor: pointer;
}
.el-aside {
  .el-menu {
    border-right: none;
  }
}
</style>
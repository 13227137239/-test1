<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/11.jpg" />
      </div>
      <el-form ref="loginFormRef" :model="form" :rules="rules">
        <!--账号 -->
        <el-form-item class="input" prop="username">
          <el-input v-model="form.username" placeholder="账号" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item class="input" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="密码"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 点击按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" class="btn1" @click="login">登录</el-button>
          <el-button class="btn1" @click="resetLoginForm('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          {
            min: 4,
            max: 10,
            message: "长度在 4 到 10 个字符",
            trigger: "blur"
          },
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        password: [{ min: 6, max: 10 , message: "长度在 6 到 10 个字符",trigger: "blur"},
        { required: true, message: "请输入密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetLoginForm(loginFormRef) {
      // console.log(this);
      // console.log(this.$refs[loginFormRef]);
      // this.$refs[loginFormRef].resetFields();
      this.$data.form.password = "";
      this.$data.form.username = "";
    },
    login() {
  
      this.$refs.loginFormRef.validate( async vaild => {
        if(!vaild) return
        else{
      const {data:res} =  await this.$http.post('/login',{
          username:this.$data.form.username,
          password:this.$data.form.password
        })
        if(res.meta.status !== 200){
          this.$message.error('密码或用户名错误')
          this.form.username=""
          this.form.password=""
        }else{
          this.$message.success('登录成功');
          window.sessionStorage.setItem('token',res.data.token)
          this.$router.push('/home');
        }
      console.log(res)
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  // background-color: cadetblue;
  background: url("../assets/10.png");
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  height: 320px;
  width: 540px;
  background-color: azure;
  border: 1px solid #999999;
  border-radius: 25px;
  position: relative;
}
.avatar_box {
  width: 120px;
  height: 120px;
  border-radius: 75px;
  background-color: aqua;
  overflow: hidden;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: -50px;
  border: 1px solid #eee;
}
img {
  width: 120px;
  height: 120px;
}
.input {
  position: relative;
  width: 360px;
  height: 40px;
  top: 100px;
  left: 50%;
  transform: translate(-50%, 0);
}
.input:nth-child(2) {
  margin-top: 40px;
}
.btns {
  position: absolute;
  top: 250px;
  left: 50%;
  transform: translate(-50%, 0);
}
.btn1 {
  width: 120px;
  height: 40px;
  font-size: 20px;
  line-height: 15px;
}
.btn1:nth-child(1) {
  margin-right: 20px;
}
.btn:nth-child(2) {
  margin-left: 20px;
}
</style>

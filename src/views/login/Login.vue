<template>
  <div class="login-container">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="login-form"
    >
      <el-form-item
        label="用户名"
        prop="username"
      >
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          v-model="form.password"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item
        style="display :flex; alignItems : center;
        justifyContent : center;"
      >
        <el-button
          type="primary"
          @click="login"
        >
          登录
        </el-button>
        <el-button @click="showDrawer">
          显示
        </el-button>
      </el-form-item>
    </el-form>

    <el-drawer
      title="可选用户名"
      :visible.sync="isVisible"
      :direction="direction"
    >
      <el-card class="box-card">
        <p>管理员</p>
        <p>username:  admin</p>
        <p>password: 随意</p>
      </el-card>

      <el-card class="box-card">
        <p>部门员工</p>
        <p>username:  employee</p>
        <p>password: 随意</p>
      </el-card>

      <el-card class="box-card">
        <p>游客</p>
        <p>username:  visitor</p>
        <p>password: 随意</p>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import { login as loginReq } from '@/request/login.js';
import { setStorage } from '@/common/utils.js';

export default {
   data (){
      return {
         form:{
            username:'',
            password:''
         },
         rules:{
            username: [
               { required: true, message: '请输入用户名', trigger: 'blur' },
            ],
            password: [
               { required: true, message: '请输入密码', trigger: 'blur' },
            ],
         },
         direction: 'rtl',
         isVisible:false
      };
   },
   methods:{
      login (){
         this.$refs.formRef.validate(async (valid) => {
            if (valid) {
               const result = await loginReq(this.form);

               setStorage('vue-admin-user',result);

               this.$router.push({
                  path:'/admin'
               });
            } else {

               return false;
            }
         });
      },
      showDrawer (){
         this.isVisible = true;
      }
   }
};
</script>

<style lang='scss' scoped>
    .login-form{

        width : 500px;

    }

    .login-container{
        display : flex;
        align-items : center;
        justify-content : center;
        height : 100vh;
    }

    .box-card {
      width : 280px;
      margin :20px auto 0 auto;
    }

    /deep/ .el-drawer > header > span:focus {
      outline-color : white;
    }
    /deep/ .el-drawer > header > button:focus {
      outline-color : white;
    }
    /deep/ .el-drawer > header > button:hover {
      color : rgb(64, 158, 255);
    }
</style>

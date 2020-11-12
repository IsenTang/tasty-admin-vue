<template>
  <el-container style="height : 100vh;">
    <!-- 侧边栏 -->
    <el-aside
      width="200px"
      class="sider"
    >
      <div>
        <div class="logo">
          <img
            src="@/assets/logo.png"
            alt="logo"
            class="logo-image"
          />
        </div>
        <el-menu>
          <el-menu-item
            index="1"
            @click="link('/admin/restaurant')"
          >
            <template slot="title">
              <em
                class="el-icon-fork-spoon"
              ></em>餐馆
            </template>
          </el-menu-item>

          <el-menu-item
            index="2"
            @click="link('/admin/menu')"
          >
            <template slot="title">
              <em
                class="el-icon-food"
              ></em>菜单
            </template>
          </el-menu-item>

          <el-menu-item
            v-if="checkPermission()"
            index="2"
            @click="link('/admin/order')"
          >
            <template slot="title">
              <em
                class="el-icon-s-order"
              ></em>订单
            </template>
          </el-menu-item>
        </el-menu>
      </div>
      <!-- <el-footer> -->
      <el-button
        class="logout-btn"
        @click="logout"
      >
        登出
      </el-button>
      <!-- </el-footer> -->
    </el-aside>

    <el-container>
      <!--  头部 -->
      <el-header />

      <!-- 面包屑 -->
      <div class="breadcrumb-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="(item,index) in routes"
            :key="index"
          >
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import _ from 'lodash';
import { getStorage,setStorage } from '@/common/utils.js';

export default {

   computed :{
      routes (){

         return _(this.$route.path)
            .split('/')
            .drop()
            .value();
      }
   },
   methods:{

      //  跳转
      link (url){
         if (this.$route.path !== url)this.$router.push(url);
      },
      checkPermission (){

         const role = _.get(getStorage('vue-admin-user'),'role','');

         const accessArray = [ 'admin','employee' ];

         return  _.includes(accessArray,role);
      },
      logout (){
         setStorage('vue-admin-user',null);
         this.$router.push('/login');
      }
   }
};
</script>

<style type='scss' scoped>

    .el-aside{
        border-right : solid 1px #e6e6e6;
    }

    .el-menu{
        border-right : none;
    }

    .el-header{
        height : 60px;
        border-bottom : 1px solid #e6e6e6;
    }
    .breadcrumb-container{
        margin-top :30px;
        margin-left :30px;
    }

    .logo{
        display : flex;
        align-items : center;
        justify-content : center;
        height : 120px;
    }

    .logo-image{
        height : 60px;
        /* filter :invert(100%) sepia(0%) saturate(5338%) hue-rotate(117deg) brightness(110%) contrast(101%) */
    }

    .sider{
      display : flex;
      flex-direction : column;
      justify-content : space-between;
    }

    .logout-btn{
      width :100px;
      margin :0 auto 50px auto;
      /* margin-bottom :50px; */
    }
</style>

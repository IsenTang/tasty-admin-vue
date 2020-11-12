<template>
  <el-card class="box-card">
    纽约时间:{{ time }}
  </el-card>
</template>

<script>
import moment from 'moment-timezone';

export default {
   data (){
      return {
         time: moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss ddd')
      };
   },
   mounted (){
      this.timer = setInterval(()=>{
         this.time = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss ddd');
      },1000);
   },
   destroyed (){
      if(this.timer){

         clearInterval(this.timer);
      }
   }
};
</script>

<style>
    .box-card{
        margin-top :20px;
        margin-bottom :20px;
    }
</style>

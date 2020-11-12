<template>
  <div>
    <!-- 前端分页 -->
    <el-table
      v-loading="loading"
      :data="restaurants.slice((currentPage - 1) * pageSize,
                               currentPage * pageSize)"
      style="width : 100%"
    >
      <el-table-column
        label="名称"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name['zh-CN'] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="地址"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.address.formatted }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="地址"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.tags"
            :key="item"
            style="marginLeft :5px;"
          >
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="$permission()"
            @click="handleOperate(scope.row)"
          >
            操作
          </el-button>
        </template>
      </el-table-column>

      <el-table-column
        label="关闭状态"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isClosed"
            :disabled="$permission()"
            @change="(v)=>{changed(v,scope.row._id)}"
          />
        </template>
      </el-table-column>
    </el-table>

    <div class="restaurant-pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="restaurants.length"
        :current-page="currentPage"
        :page-size="10"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <RestaurantModal
      :is-visible="isVisible"
      :restaurant="selectRestaurant"
      :close="closeModal"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import _ from 'lodash';

import RestaurantModal from '@/views/restaurant/component/RestaurantModal';

export default {
   components:{
      RestaurantModal,
   },
   data (){

      return{
         currentPage:1,
         pageSize:10,
         selectRestaurant:{},
         isVisible:false
      };
   },
   computed:{
      ...mapState({
         restaurants: state=>state.restaurant.restaurants,
         loading: state=>state.loading,
      })
   },
   created (){
      // 加载餐馆
      this.loadRestaurants();
   },
   methods:{

      ...mapActions([
         'loadRestaurants','updateRestaurant'
      ]),
      handleCurrentChange (v){

         this.currentPage = v;
      },
      handleOperate (v){

         // 传递状态
         this.selectRestaurant = _.cloneDeep(v);
         this.isVisible = true;
      },
      closeModal (){

         // 重制父类状态
         this.isVisible = false;
      },
      changed (v,id){
         let closed = v ? { closed:true } : null;

         const data = {
            id,
            data:{ closed }
         };
         this.updateRestaurant(data);
      }
   }

};
</script>

<style lang='scss' scoped>

.restaurant-pagination{
   display : flex;
   flex-direction : row-reverse;
   margin-top :20px;
}
</style>

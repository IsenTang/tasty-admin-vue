<template>
  <div>
    <el-select
      v-model="restaurant"
      filterable
      placeholder="请选择"
      @change="selectRestaurant"
    >
      <el-option
        v-for="item in names"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>

    <el-table
      v-loading="loading"
      :data="foods"
      style="width : 100%;marginTop :20px"
    >
      <el-table-column>
        <template slot="header">
          <div class="menu-name-header">
            <span>名称</span>
            <input
              ref="inputRef"
              v-model="keyword"
              placeholder="输入关键字搜索"
              class="el-input__inner "
              style="width :200px;height :28px;lineHeight :28px"
              @keyup.enter="renderTable"
            />
          </div>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.name['zh-CN'] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="价格"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.price | formatPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="状态"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.available"
            :disabled="$permission()"
            @change="(v)=>{changeStatus(v,scope.row._id)}"
          />
        </template>
      </el-table-column>
    </el-table>

    <div class="menu-pagination">
      <el-pagination
        layout="prev,pager,next,sizes"
        :total="count"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import py from 'pinyin';
import _ from 'lodash';

export default {
   data (){
      return {
         restaurant:'',
         names:[],
         currentPage:1,
         pageSize:10,
         keyword:'',
         restaurantId:'',
         search:'',

      };
   },
   computed:{
      ...mapState({
         restaurantNames: state=>state.menu.restaurantNames,
         foods: state=>state.menu.foods,
         count:state=>state.menu.count,
         loading: state=>state.loading,
      })
   },
   watch:{
      restaurantNames (val) {
         this.names = val;
      },
   },
   created (){
      this.loadRestaurantNames();
   },
   destroyed (){
      this.leaveMenu();
   },
   methods:{
      ...mapActions([ 'loadRestaurantNames','loadFood','updateFood','leaveMenu' ]),
      restaurantFilter (input){

         this.names = _.filter(this.restaurantNames,(item)=>{

            const name = item.name;
            /* 中文 */
            if(name.indexOf(input) !== - 1){
               return true;
            }

            /* 拼音 */
            const pyArr = py(name, {
               style: py.STYLE_NORMAL // 设置拼音风格设置为普通风格（不带声调），
            }).flat();

            const pyStr = pyArr.join('');

            if(pyStr.indexOf(input) !== - 1){
               return true;
            }

            return false;
         });
      },
      selectRestaurant (v){

         this.restaurantId = v;

         //  特殊处理，可能是因为vue嵌套过深，导致错误，拿出ref，对dom直接操作，原因未知。
         this.$refs.inputRef.value = '';
         this.keyword = '';
         this.renderTable();
      },
      handlePageChange (v){
         this.currentPage = v;
         this.renderTable();
      },
      handleSizeChange (v){
         this.pageSize = v;
         this.currentPage = 1;
         this.renderTable();
      },
      renderTable (){

         this.loadFood({ id:this.restaurantId,page:this.currentPage,limit:this.pageSize,keyword:this.keyword });
      },

      /*
       * 更新食物状态
      */
      changeStatus (available,id){

         this.updateFood({
            id,
            data:{
               available
            },
            searchData:{
               id:this.restaurantId,
               page:this.currentPage,
               limit:this.pageSize,
               keyword:this.keyword
            }
         });
      },

   },

};
</script>

<style lang='scss' scoped>
   .menu-pagination{
      display : flex;
      flex-direction : row-reverse;
      margin-top :20px;
   }
   .menu-name-header{
      display :flex;
      justify-content : space-between
   }
</style>

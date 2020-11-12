import _ from 'lodash';
import * as types from '@/store/mutation-types';
import { getRestaurant } from '@/request/restaurant';
import { loadFoodsByPage, updateFood as updateFoodReq } from '@/request/menu';

const actions = {

   /*
    * 加载餐馆
   */
   async loadRestaurantNames ({ commit }){

      try {
         commit(types.SHOW_LOADING);

         const result = await getRestaurant();

         /* 仅获取餐馆中文名，和id */
         const restaurantNames = _.map(result.list,(item)=>{

            return {
               id:item._id,
               name:item.name['zh-CN']
            };
         });

         commit(types.LOAD_RESTAURANT_NAMES,{ names: restaurantNames });

      } catch (error) {

         this._vm.$message.error(error.message);

      }finally{

         commit(types.HIDE_LOADING);
      }
   },

   /*
    * 加载食物
   */
   async loadFood ({ commit },{ id,page,limit,keyword }){

      try {

         commit(types.SHOW_LOADING);

         /* 加载食物 */
         const result = await loadFoodsByPage({ id,page,limit,keyword });

         commit(types.LOAD_FOOD,{
            foods:result.list,
            count:result.count
         });

      } catch (error) {
         this._vm.$message.error(error.message);
      }finally{
         commit(types.HIDE_LOADING);
      }
   },

   /*
    * 更新食物
   */
   async updateFood ({ commit,dispatch },{ id,data,searchData }){

      try {
         commit(types.SHOW_LOADING);

         await updateFoodReq({
            id,
            data
         });

      } catch (error) {
         this._vm.$message.error(error.message);

      }finally{

         // 重新加载食物，按页码，limit，keyword等等
         await dispatch('loadFood',{ ...searchData });
         commit(types.HIDE_LOADING);
      }
   },

   async leaveMenu ({ commit }){

      commit(types.LOAD_FOOD,{
         foods:[],
         count:0
      });
   }

};

export default actions;
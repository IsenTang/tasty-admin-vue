import _ from 'lodash';
import * as types from '@/store/mutation-types';
import { getRestaurant,getTags, updateRestaurantInfo } from '@/request/restaurant';

const actions = {

   /*
    * 加载餐馆
   */
   async loadRestaurants ({ commit }){

      try {
         commit(types.SHOW_LOADING);

         const result = await getRestaurant();

         /* 重构数据，加入isClosed */
         const list =  _.map(result.list,(item)=>{

            item.isClosed = !_.isEmpty(item.closed );

            return item;
         });

         commit(types.LOAD_RESTAURANT,{ restaurants: list });

         const { list : tags } = await getTags();
         commit(types.LOAD_TAGS,{ tags });

      } catch (error) {

         this._vm.$message.error(error.message);

      }finally{

         commit(types.HIDE_LOADING);
      }
   },
   /*
    * 更新餐馆
   */
   async updateRestaurant ({ commit,dispatch },data){

      try {
         commit(types.SHOW_LOADING);

         await updateRestaurantInfo(data);

      } catch (error) {
         this._vm.$message.error(error.message);
      }finally{
         // 重新发送请求，获取最新数据
         await dispatch('loadRestaurants');
         commit(types.HIDE_LOADING);
      }
   }
};

export default actions;
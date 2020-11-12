import * as types from '@/store/mutation-types';

const mutations = {

   /* 加载饭店 */
   [types.LOAD_RESTAURANT_NAMES] (state,payload){
      state.restaurantNames = payload.names;
   },
   [types.LOAD_FOOD] (state,payload){
      state.foods = payload.foods;
      state.count = payload.count;
   }
};

export default mutations;
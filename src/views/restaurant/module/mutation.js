import * as types from '@/store/mutation-types';

const mutations = {

   /* 加载饭店 */
   [types.LOAD_RESTAURANT] (state,payload){
      state.restaurants = payload.restaurants;
   },
   [types.LOAD_TAGS] (state,payload){
      state.tags = payload.tags;
   }
};

export default mutations;
import * as types from '@/store/mutation-types';

const mutations = {

   /* 加载饭店 */
   [types.LOAD_ORDERS] (state,payload){
      state.list = payload.list;
   }
};

export default mutations;
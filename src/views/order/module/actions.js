import * as types from '@/store/mutation-types';
import { loadOrder } from '@/request/order';

const actions = {

   /*
    * 加载餐馆
   */
   async loadOrders ({ commit },data){

      try {
         const result = await loadOrder(data);

         commit(types.LOAD_ORDERS,result);

      } catch (error) {

         this._vm.$message.error(error.message);
      }
   },

};

export default actions;
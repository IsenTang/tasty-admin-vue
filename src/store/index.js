import Vue from 'vue';
import Vuex from 'vuex';
import * as types from '@/store/mutation-types';

Vue.use(Vuex);

/* views */
import restaurant from '@/views/restaurant/module';
import menu from '@/views/menu/module';
import order from '@/views/order/module';

export default new Vuex.Store({
   state: {
      loading:false
   },
   mutations: {
      [types.SHOW_LOADING] (state){
         state.loading = true;
      },
      [types.HIDE_LOADING] (state){
         state.loading = false;
      }
   },
   actions: {
   },
   modules: {
      restaurant,
      menu,
      order
   }
});

import 'moment/locale/zh-cn';
import Vue from 'vue';
import ECharts from 'vue-echarts';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element.js';
import '@/filter';

import { useLocale,permission } from '@/common/utils';

useLocale('zh-cn');
Vue.component('v-chart', ECharts);

Vue.config.productionTip = false;

Vue.prototype.$permission = permission;

new Vue({
   router,
   store,
   render: h => h(App)
}).$mount('#app');

import Vue from 'vue';
import _ from 'lodash';
import VueRouter from 'vue-router';
import { getStorage } from '@/common/utils';

Vue.use(VueRouter);

const routes = [
   {
      path:'/login',
      name:'login',
      component:()=>import('../views/login/Login.vue'),
      beforeEnter:(to,from,next)=>{

         /* 如果登录,直接跳转到restaurant页面 */
         if(!_.isEmpty(_.get(getStorage('vue-admin-user'),'role'))){
            next({
               path:'/admin/restaurant'
            });
         }else{
            next();
         }
      }
   },
   {
      path: '/admin',
      name: 'admin',
      component: () => import(/* webpackChunkName: "admin" */ '../views/layout/Layout.vue'),
      redirect: '/admin/restaurant',
      children:[
         {
            path:'restaurant',
            name:'restaurant',
            component : ()=> import(/* webpackChunkName: "restaurant" */ '../views/restaurant/Restaurant.vue')
         },
         {
            path:'menu',
            name:'menu',
            component : ()=> import(/* webpackChunkName: "menu" */ '../views/menu/Menu.vue')
         },
         {
            path:'order',
            name:'order',
            component : ()=> import(/* webpackChunkName: "order" */ '../views/order/Order.vue'),
            beforeEnter:(to,from,next)=>{

               const role = _.get(getStorage('vue-admin-user'),'role','');

               const accessArray = [ 'admin','employee' ];

               // 如果允许
               if(_.includes(accessArray,role)){
                  next();
               }else{
                  next({
                     path:'/admin/restaurant'
                  });
               }
            }
         },
         {
            path:'*',
            name:'404',
            component : ()=> import(/* webpackChunkName: "admin404" */ '../views/404/Error404.vue')
         },
      ]
   },{
      path:'*',
      redirect:'/admin/restaurant'
   }
];

const router = new VueRouter({
   mode: 'history',
   base: process.env.BASE_URL,
   routes
});

/* 登录态检测 */
router.beforeEach((to,from,next)=>{

   const path = to.path;

   if(_.startsWith(path,'/admin')){
      const role = _.get(getStorage('vue-admin-user'),'role',null);

      if(role){
         next();
      }else{

         next({
            path:'/login'
         });
      }
   }
   next();
});

export default router;

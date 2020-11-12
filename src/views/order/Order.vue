<template>
  <div>
    <el-date-picker
      v-model="date"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      @change="change"
    >
    </el-date-picker>

    <div class="chart-container">
      <v-chart :options="orderOption" />
    </div>

    <div class="chart-container">
      <v-chart :options="peopleOption" />
    </div>
  </div>
</template>

<script>
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import moment from 'moment';
import _ from 'lodash';
import 'echarts/lib/component/polar';
import { mapActions, mapState } from 'vuex';

export default {
   data () {

      return {
         pickerOptions: {
            shortcuts: [ {
               text: '最近一周',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [ start, end ]);
               }
            }, {
               text: '最近一个月',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [ start, end ]);
               }
            }, {
               text: '最近三个月',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [ start, end ]);
               }
            } ]
         },
         date:[],
         orderOption:{
            title:{
               text: '订单量'
            },
            xAxis: {
               type: 'category',
               data: []
            },
            yAxis: {
               type: 'value'
            },
         },
         peopleOption:{
            title:{
               text: '订单人群'
            },
            xAxis: {
               type: 'category',
               data: []
            },
            yAxis: {
               type: 'value'
            },
         }
      };
   },
   computed:{
      ...mapState({
         list:state=>state.order.list
      }),
   },
   watch:{
      list (v){

         this.setPeopleOption(v);
         this.setOrderOption(v);
      }
   },
   methods:{
      ...mapActions([ 'loadOrders' ]),
      change (v){
         let [ start , end ] = v;

         this.loadOrders({
            start:start.toISOString(),
            end:end.toISOString()
         });
      },
      setPeopleOption (list){
         let data = _(list).groupBy((item)=>{

            if(item.user){
               return item.user.username;
            }
         }).value();

         const userCount = _.map(data,(v,k)=>{

            return {
               name:k,
               value :v.length
            };
         });

         this.peopleOption = {
            ...this.pickerOptions,
            series: [  {
               data:userCount,
               type:'pie',
               radius:'50%',
               label:{
                  show:true,
                  formatter:'{b} : {c} ({d}%)'
               }
            } ]
         };
      },
      setOrderOption (list){
         const formatStr = 'YYYY-MM-DD';
         let data = _(list).groupBy((item)=>{
            return moment(item.createdAt).format(formatStr);
         }).value();

         // x轴时间坐标
         const [ start , end ] = this.date;

         const range = moment.range(start, end).snapTo('day').by('days');

         const date = Array.from(range).map(m => m.format(formatStr));

         // 每天订单量 线框图
         const count = _.map(date,(d)=>{

            return data[d] ? data[d].length : 0;
         });

         // 每天订单量 饼图
         const dayCount = _.map(date,(d)=>{

            return {
               name:d,
               value :data[d] ? data[d].length : 0
            };
         });

         this.orderOption =  {
            title:{
               text: '订单量'
            },
            xAxis: {
               type: 'category',
               data: date,
            },
            yAxis: {
               type: 'value'
            },
            grid:{ right:'50%' },
            series: [ {
               data: count,
               type: 'line',
               label: {
                  normal: {
                     show: true,
                     position: 'top',
                     textStyle: {
                        color: 'white'
                     }
                  }
               }
            } ,{
               data:dayCount,
               type:'pie',
               radius:'50%',
               center:[ '75%','50%' ],
               label:{
                  show:true,
                  formatter:'{b} : {c} ({d}%)'
               }
            } ]
         };
      }
   },

};
</script>

<style lang='scss'>

.chart-container{
   width : 100%;
   height : 300px;
   margin-top :50px;
}

.echarts {
  width : 100%;
  height : 100%;
}
</style>

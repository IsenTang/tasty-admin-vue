<template>
  <el-dialog
    :title="name"
    :visible.sync="isShow"
    width="500px"
    :before-close="close"
  >
    <!-- 名字 -->
    <el-input
      v-model="langName"
      placeholder="请输入内容"
      class="input-with-select"
      @change="changeName"
    >
      <el-select
        slot="prepend"
        v-model="lang"
        placeholder="请选择"
        @change="changeLange"
      >
        <el-option
          value="zh-CN"
          label="中文"
        />

        <el-option
          value="en-US"
          label="英文"
        />
      </el-select>
    </el-input>

    <!-- tags -->
    <div class="restaurant-tags-container">
      <el-select
        v-model="tagValue"
        placeholder="请选择"
        @change="addTag"
      >
        <el-option

          v-for="item in allTags"
          :key="item"
          :value="item"
          :label="item"
        />
      </el-select>

      <div class="restaurant-own-tags">
        <el-tag
          v-for="item in tags"
          :key="item.key"
          :type="item.type"
          closable
          @close="removeTag(item.tag)"
        >
          {{ item.tag }}
        </el-tag>
      </div>
    </div>

    <!-- time -->
    <Clock />

    <div
      v-for="(item,index) in hours"
      :key="item.key"
    >
      <span>
        {{ item.day }}
      </span>
      <el-time-picker
        v-model="item.time"
        is-range
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围"
        class="test"
        @change="(v)=>{changeHour(v,index)}"
      >
      </el-time-picker>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="close">取 消</el-button>
      <el-button
        type="primary"
        @click="confirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { mapState, mapActions } from 'vuex';

/* components */
import Clock from '@/views/restaurant/component/Clock';

export default {
   components:{
      Clock
   },
   props:{
      isVisible:{
         type:Boolean,
         required:true
      },
      restaurant:{
         type:Object,
         required:true
      },
      close:{
         type:Function,
         required:true
      }
   },
   data (){

      return {
         isShow : false,
         lang:'zh-CN',
         langName:'',
         tagValue:'',
         hours:[],
         tags:[],
         updatedHours:[],
         updatedName:{},
      };
   },
   computed:{
      ...mapState({
         allTags: state=>state.restaurant.tags,
      }),
      name (){

         return _.get(this.restaurant,'name[zh-CN]','');
      }
   },
   watch: {
      isVisible (val) {
         this.isShow = val;
      },
      restaurant (v){

         this.langName = _.get(v,'name[zh-CN]','');

         this.tags = _.map(_.get(v,'tags',[]),(item)=>{

            return {
               key:uuidv4(),
               tag:item,
               type:this.getRandomColor()
            };
         });

         const hours = _.get(v,'hours',[]);
         const weekday = [ '星期一','星期二','星期三','星期四','星期五','星期六','星期日' ];
         this.hours = _(weekday)
            .map((item,index)=>{
               return {
                  key:uuidv4(),
                  day:item,
                  time:[
                     moment().startOf('day').add(_.get(hours[index],'start',0), 'minutes').toDate(),
                     moment().startOf('day').add(_.get(hours[index],'end',0), 'minutes').toDate()
                  ]

               };
            }).value();

         this.updatedHours = hours;
         this.updatedName = _.get(v,'name',{});
      }
   },
   methods:{
      ...mapActions([ 'updateRestaurant' ]),
      confirm (){

         const data = {
            id:this.restaurant._id,
            data:{
               name:this.updatedName,
               hours:this.updatedHours,
               tags:this.handleTag()
            }
         };
         this.updateRestaurant(data);

         this.$props.close();
      },
      changeLange (v){

         this.lang = v;

         this.langName = _.get(this.$props.restaurant,`name[${v}]`);
      },
      changeName (v){
         this.updatedName[this.lang] = v;
      },
      getRandomColor (){

         const colors = [ 'success','warning','danger','info' ];

         return colors[_.random(colors.length)];
      },
      addTag (v){

         /* 如果不存在，则加入tag，如果存在则无视 */
         if(!_.includes(this.tags.map((i)=>{

            return i.tag;
         }),v)){
            this.tags.push({
               key:uuidv4(),
               tag:v,
               type:this.getRandomColor()
            });
         }
      },
      removeTag (v){

         this.tags = _.filter(this.tags,(item)=>{

            return item.tag !== v;
         });

      },
      handleTag (){
         return _.map(this.tags,(item)=>{

            return item.tag;
         });
      },
      changeHour (v,index){

         const start = this.getMinute(v[0]);
         const end = this.getMinute(v[1]);

         this.updatedHours[index].start = start;
         this.updatedHours[index].end = end;

      },
      getMinute (time){

         return moment(time).hours() * 60 + moment(time).minute();
      }
   },
};
</script>

<style lang='scss' scoped>
   /deep/ .el-select .el-input {
      width : 100px;
   }

  .input-with-select .el-input-group__prepend {
    background-color : #fff;
  }

  .restaurant-tags-container{
     display : flex;
     margin-top :20px;
  }

  .restaurant-own-tags{
     width :70%;
     margin-left :20px;
  }

  .el-tag + .el-tag {
    margin-top :5px;
    margin-left : 10px;
  }
</style>

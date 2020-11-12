import mutations from './mutation';
import actions from './actions';

const login =  {
   state:{
      restaurants:[],
      loading:false,
      isVisible:false,
      selectRestaurant:{},
      tags:[]
   },
   mutations,
   actions
};

export default login;
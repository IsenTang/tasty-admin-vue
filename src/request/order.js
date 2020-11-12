import request from '@/common/request';
import config from '@/common/config';

/*
 * 分页加载食物
*/
export async function loadOrder ({ start,end }){

   const result = await request({
      url:     `${config.host}/order?start=${start}&end=${end}`,
      method:  'get'
   });

   return result;
}

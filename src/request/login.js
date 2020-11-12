import request from '@/common/request';
import config from '@/common/config';

/*
 * 分页加载食物
*/
export async function login (data){

   const result = await request({
      url:     `${config.host}/admin/login`,
      method:  'post',
      data
   });

   return result;
}


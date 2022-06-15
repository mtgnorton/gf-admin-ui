import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  // return new Promise(resolve => {
  //   resolve(JSON.parse('{"code":0,"message":"","data":{"front_routes":[{"alwaysShow":true,"component":"layout","hidden":false,"meta":{"title":"系统管理","icon":""},"name":"System","path":"system","redirect":"redirect_no","children":[{"component":"system/menu/index","hidden":false,"meta":{"title":"菜单列表","icon":"tree-table"},"name":"Menu","path":"/"}]}]},"redirect":""}'))
  // })
  return request({
    url: '/routes',
    method: 'get'
  })
}

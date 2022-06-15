import request from '@/utils/request'

// 查询岗位列表
export function listOperationLog(query) {
  return request({
    url: '/operation-log-list',
    method: 'get',
    params: query
  })
}

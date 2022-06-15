import request from '@/utils/request'

// 查询参数列表
export function listConfig(query) {
  return request({
    url: '/config-list',
    method: 'get',
    params: query
  })
}

export function updateConfig(module, mapping) {
  return request({
    url: '/config-update',
    method: 'put',
    params: {
      'module': module,
      'key_value_map': mapping
    }
  })
}


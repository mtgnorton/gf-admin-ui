import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/menu-list', method: 'get', params: query
  })
}

// 查询菜单详细
export function getMenu(Id) {
  return request({
    url: `/menu-info`, method: 'get', params: {
      id: Id
    }
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/menu-store', method: 'post', data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: `/menu-update`, method: 'put', data: data
  })
}

// 删除菜单
export function delMenu(Id) {
  return request({
    url: `/menu-destroy`, method: 'delete', params: {
      id: Id
    }

  })
}

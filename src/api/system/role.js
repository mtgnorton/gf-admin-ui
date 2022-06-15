import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/role-list',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId = 0) {
  return request({
    url: '/role-info',
    method: 'get',
    params: {
      id: roleId
    }
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/role-store',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/role-update',
    method: 'put',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(ids) {
  return request({
    url: '/role-destroy',
    method: 'delete',
    params: {
      ids: ids
    }
  })
}

// 导出角色
export function exportRole(query) {
  return request({
    url: '/system/role/export',
    method: 'get',
    params: query
  })
}

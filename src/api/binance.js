import request from '@/utils/request'

// 查询用户地址列表
export function listUserAddress(query) {
  return request({
    url: '/binance-user-address-list', method: 'get', params: query
  })
}

// 查询归集列表
export function listCollect(query) {
  return request({
    url: '/binance-collect-list', method: 'get', params: query
  })
}

// 更新归集列表
export function updateCollect(query) {
  return request({
    url: '/binance-collect-update', method: 'put', params: query
  })
}

// 删除归集列表
export function destroyCollect(query) {
  return request({
    url: '/binance-collect-destroy', method: 'delete', params: query
  })
}

// 查询提现列表
export function listWithdraw(query) {
  return request({
    url: '/binance-withdraw-list', method: 'get', params: query
  })
}

// 更新提现列表
export function updateWithdraw(query) {
  return request({
    url: '/binance-withdraw-update', method: 'put', params: query
  })
}

export function destroyWithdraw(query) {
  return request({
    url: '/binance-withdraw-destroy', method: 'delete', params: query
  })
}

// 查询队列列表
export function listQueueTask(query) {
  return request({
    url: '/binance-queue-task-list', method: 'get', params: query
  })
}

export function updateQueueTask(query) {
  return request({
    url: '/binance-queue-task-update', method: 'put', params: query
  })
}

export function destroyQueueTask(query) {
  return request({
    url: '/binance-queue-task-destroy', method: 'delete', params: query
  })
}

// 查询通知列表
export function listNotify(query) {
  return request({
    url: '/binance-notify-list', method: 'get', params: query
  })
}

export function updateNotify(query) {
  return request({
    url: '/binance-notify-update', method: 'put', params: query
  })
}

export function destroyNotify(query) {
  return request({
    url: '/binance-notify-destroy', method: 'delete', params: query
  })
}

// 查询合约列表
export function listContract(query) {
  return request({
    url: '/binance-contract-list', method: 'get', params: query
  })
}

// 新增合约
export function storeContract(query) {
  return request({
    url: '/binance-contract-store', method: 'post', params: query
  })
}

// 更新合约
export function updateContract(query) {
  return request({
    url: '/binance-contract-update', method: 'put', params: query
  })
}

// 合约信息
export function infoContract(query) {
  return request({
    url: '/binance-contract-info', method: 'get', params: query
  })
}

// 合约删除
export function destroyContract(query) {
  return request({
    url: '/binance-contract-destroy', method: 'delete', params: query
  })
}

// 丢失区块列表
export function listLoseBlock(query) {
  return request({
    url: '/binance-lose-block-list', method: 'get', params: query
  })
}

// 新增区块
export function storeLoseBlock(query) {
  return request({
    url: '/binance-lose-block-store', method: 'post', params: query
  })
}

// 删除区块
export function destroyLoseBlock(query) {
  return request({
    url: '/binance-lose-block-destroy', method: 'delete', params: query
  })
}

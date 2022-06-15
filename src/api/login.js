import request from '@/utils/request'

// 登录方法
export function login(username, password, code, captcha_id) {
  const data = {
    username,
    password,
    code,
    captcha_id
  }

  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}

export function loginInfo() {
  return request({
    url: '/login-info',
    method: 'get',
    data: {}
  })
}

// 获取用户详细信息
export function getLoggedInfo() {
  return request({
    url: '/administrator-get-logged-info',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captcha-get',
    method: 'get'
  })
}

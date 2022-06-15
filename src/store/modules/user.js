import { login, logout, getLoggedInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      console.log(userInfo)

      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const captcha_id = userInfo.captcha_id
      return new Promise((resolve, reject) => {
        login(username, password,code,captcha_id).then(res => {

          console.log(res)

          if (res.code != 0) {

            console.log(3333)

            reject(res)
          } else {
            setToken(res.data.Token)
            commit('SET_TOKEN', res.Token)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetLoggedInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getLoggedInfo(state.token).then(res => {
          console.log(res, 33333)

          const user = res.data
          const avatar = user.avatar == '' ? require('@/assets/image/profile.jpg') : user.avatar
          if (user.roles && user.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', user.roles)
            commit('SET_PERMISSIONS', user.menus)
          } else {
            commit('SET_ROLES', [])
          }
          commit('SET_NAME', user.username)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user

import request from '@/utils/request'

/**
 * 用户认证相关 API
 */

// 第三方授权登录
export const thirdPartyLogin = (code) => {
  return request({
    url: '/api/auth/callback',
    method: 'get',
    params: { code }
  })
}

// 退出登录
export const logout = () => {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}

import axios from 'axios'
import { baseURL, timeout } from '@/config'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: baseURL,
  timeout: timeout,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 sessionStorage 获取 token
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data

    // 根据业务需求处理响应
    // 假设后端返回格式为 { code: number, data: any, message: string }
    if (res.code !== undefined && res.code !== 200) {
      ElMessage.error(res.message || '请求失败')

      // 401 未授权，跳转到登录页
      if (res.code === 401) {
        sessionStorage.clear()
        window.location.href = '/#/login'
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  (error) => {
    console.error('响应错误:', error)

    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 400:
          ElMessage.error(data.message || '请求参数错误')
          break
        case 401:
          ElMessage.error('未授权，请重新登录')
          sessionStorage.clear()
          window.location.href = '/#/login'
          break
        case 403:
          ElMessage.error('拒绝访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(data.message || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查网络连接')
    } else {
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

export default request

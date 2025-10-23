import axios from 'axios'
import { baseURL, timeout } from '@/config'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: baseURL,
  timeout: timeout,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 存储正在进行的请求
const pendingRequests = new Map()

/**
 * 生成请求的唯一标识
 * @param {Object} config - axios 请求配置
 * @returns {string} 请求的唯一标识
 */
const generateRequestKey = (config) => {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/**
 * 添加请求到 pending 中
 * @param {Object} config - axios 请求配置
 */
const addPendingRequest = (config) => {
  const requestKey = generateRequestKey(config)

  if (pendingRequests.has(requestKey)) {
    // 如果已存在相同请求，取消当前请求
    config.cancelToken = new axios.CancelToken((cancel) => {
      cancel(`重复请求: ${requestKey}`)
    })
  } else {
    // 添加到 pending 请求中
    config.cancelToken = new axios.CancelToken((cancel) => {
      pendingRequests.set(requestKey, cancel)
    })
  }
}

/**
 * 从 pending 中移除请求
 * @param {Object} config - axios 请求配置
 */
const removePendingRequest = (config) => {
  const requestKey = generateRequestKey(config)

  if (pendingRequests.has(requestKey)) {
    pendingRequests.delete(requestKey)
  }
}

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加请求拦截,避免重复请求
    addPendingRequest(config)

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
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 请求完成,从 pending 中移除
    removePendingRequest(response.config)

    // 直接返回 response.data，因为后端返回的数据中没有 code 包装
    return response.data
  },
  (error) => {
    // 请求失败,从 pending 中移除
    if (error.config) {
      removePendingRequest(error.config)
    }

    // 如果是取消请求的错误,不显示错误提示
    if (axios.isCancel(error)) {
      // 静默处理取消的请求，不输出到控制台
      return Promise.reject(error)
    }

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
  },
)

export default request

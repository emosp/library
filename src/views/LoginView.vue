<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <img src="@/assets/icon.svg" alt="Emos Logo" class="logo-icon" />
          <span class="title">Emos 视频资源管理服务</span>
        </div>
      </template>

      <div class="login-content">
        <div class="avatar-container">
          <img src="@/assets/avatar.png" alt="用户头像" class="avatar" />
        </div>

        <div class="welcome-text">
          <h3>欢迎使用 Emos 视频资源管理服务</h3>
          <p>点击下方按钮进行 Emos 授权登录</p>
        </div>

        <el-button
          type="primary"
          size="large"
          class="login-btn"
          :loading="loading"
          @click="handleThirdPartyLogin"
        >
          Emos 授权登录
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { baseURL } from '@/config'

const route = useRoute()
const loading = ref(false)

// UUID 固定值
const UUID = '5fa042dc-cfa2-469d-b972-461c9643e08a'
const APP_NAME = 'Emos 视频资源管理服务'

// 检查是否从第三方授权回调返回
onMounted(() => {
  // 优先从 route.query 获取参数(hash 路由模式)
  let { token, username } = route.query

  // 如果 route.query 中没有,尝试从 window.location.search 获取(参数在 hash 前)
  if (!token || !username) {
    const urlParams = new URLSearchParams(window.location.search)
    token = urlParams.get('token')
    username = urlParams.get('username')
  }

  if (token && username) {
    // 存储用户信息到 sessionStorage
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('username', username)
    sessionStorage.setItem('isLoggedIn', 'true')

    ElMessage.success('登录成功')

    // 清理 URL 参数并跳转到视频列表页
    // 使用 window.location.hash 跳转以清除 search 参数
    window.location.href = window.location.origin + window.location.pathname + '#/videos'
  }
})

const handleThirdPartyLogin = () => {
  loading.value = true

  // 获取当前地址栏 URL
  const currentUrl = window.location.href

  // 构建三方认证链接
  const authUrl = `${baseURL}api/link?uuid=${UUID}&name=${encodeURIComponent(APP_NAME)}&url=${encodeURIComponent(currentUrl)}`

  // 跳转到三方认证页面
  window.location.href = authUrl
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #4cbfaa 0%, #2a9d8f 100%);
}

.login-card {
  width: 400px;
  border-radius: 10px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.logo-icon {
  width: 32px;
  height: 32px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.avatar-container {
  margin-bottom: 30px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.welcome-text {
  text-align: center;
  margin-bottom: 30px;
}

.welcome-text h3 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 500;
}

.welcome-text p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.login-btn {
  width: 200px;
  height: 45px;
  font-size: 16px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

:deep(.el-card__header) {
  padding: 30px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
}

:deep(.el-card__body) {
  padding: 30px;
}

/* 移动端适配 (小于 768px) */
@media screen and (max-width: 768px) {
  .login-container {
    padding: 20px;
    height: auto;
    min-height: 100vh;
    align-items: flex-start;
    padding-top: 10vh;
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
  }

  .card-header {
    gap: 8px;
  }

  .logo-icon {
    width: 28px;
    height: 28px;
  }

  .title {
    font-size: 20px;
    text-align: center;
    line-height: 1.3;
  }

  .login-content {
    padding: 15px 0;
  }

  .avatar-container {
    margin-bottom: 25px;
  }

  .avatar {
    width: 70px;
    height: 70px;
    border-width: 3px;
  }

  .welcome-text {
    margin-bottom: 25px;
    padding: 0 10px;
  }

  .welcome-text h3 {
    font-size: 16px;
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .welcome-text p {
    font-size: 13px;
    line-height: 1.4;
  }

  .login-btn {
    width: 100%;
    max-width: 280px;
    height: 42px;
    font-size: 15px;
  }

  :deep(.el-card__header) {
    padding: 20px 15px;
  }

  :deep(.el-card__body) {
    padding: 20px 15px;
  }
}

/* 超小屏幕 (小于 480px) */
@media screen and (max-width: 480px) {
  .login-container {
    padding: 15px;
    padding-top: 8vh;
  }

  .title {
    font-size: 18px;
  }

  .avatar {
    width: 60px;
    height: 60px;
    border-width: 2px;
  }

  .welcome-text h3 {
    font-size: 15px;
  }

  .welcome-text p {
    font-size: 12px;
  }

  .login-btn {
    height: 40px;
    font-size: 14px;
  }

  :deep(.el-card__header) {
    padding: 15px 12px;
  }

  :deep(.el-card__body) {
    padding: 15px 12px;
  }
}
</style>

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
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

// 检查是否从第三方授权回调返回
onMounted(() => {
  const { token, username } = route.query

  if (token && username) {
    // 存储用户信息到 sessionStorage
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('username', username)
    sessionStorage.setItem('isLoggedIn', 'true')

    ElMessage.success('登录成功')

    // 清理 URL 参数
    router.replace('/videos')
  }
})

const handleThirdPartyLogin = () => {
  loading.value = true

  // 模拟跳转到第三方授权页面
  // 实际项目中这里应该跳转到真实的第三方授权 URL
  setTimeout(() => {
    loading.value = false

    // 模拟第三方授权回调
    // 在实际项目中，这一步由第三方授权服务器完成
    const mockToken = 'mock_token_' + Date.now()
    const mockUsername = 'test_user'

    // 模拟重定向回来并携带 token 和 username
    router.push({
      path: '/login',
      query: {
        token: mockToken,
        username: mockUsername,
      },
    })

    // 实际项目中的跳转逻辑应该是：
    // window.location.href = 'https://third-party-auth.com/oauth/authorize?client_id=xxx&redirect_uri=xxx&response_type=code'
  }, 1000)
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
</style>

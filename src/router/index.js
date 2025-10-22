import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/videos',
      name: 'videos',
      component: () => import('@/views/videos/VideosView.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ],
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn')

  // 如果需要登录且未登录，跳转到登录页
  if (to.meta.requiresAuth && !isLoggedIn) {
    ElMessage.warning('请先登录')
    next('/login')
  }
  // 如果已登录且访问登录页，跳转到视频管理页
  else if (to.path === '/login' && isLoggedIn) {
    next('/videos')
  }
  else {
    next()
  }
})

export default router

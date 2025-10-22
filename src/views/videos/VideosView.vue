<template>
  <div class="videos-container">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <img src="@/assets/icon.svg" alt="视频管理图标" class="header-icon" />
          <span class="title">视频资源管理</span>

          <!-- 用户信息区域 -->
          <div class="user-info">
            <img src="@/assets/avatar.png" alt="用户头像" class="user-avatar" />
            <span class="username">{{ username }}</span>
          </div>

          <el-button type="danger" plain size="small" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </template>

      <!-- 查询表单 -->
      <el-form :model="queryForm" :inline="true" label-width="80px">
        <el-form-item label="媒体库">
          <el-select
            v-model="queryForm.library"
            placeholder="请选择媒体库"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in libraryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="类型">
          <el-select
            v-model="queryForm.type"
            placeholder="请选择类型"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="item in VIDEO_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="是否包含已删除视频" label-width="160">
          <el-select v-model="queryForm.withDelete" placeholder="请选择" style="width: 150px">
            <el-option
              v-for="item in WITH_DELETE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="queryForm.searchValue"
            :placeholder="searchPlaceholder"
            clearable
            style="width: 300px"
          >
            <template #prepend>
              <el-select v-model="queryForm.searchType" style="width: 120px">
                <el-option
                  v-for="item in SEARCH_TYPE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table :data="tableData" stripe border v-loading="loading" style="width: 100%">
        <el-table-column prop="video_id" label="视频ID" width="90" align="center" />

        <el-table-column prop="library_name" label="所属媒体库" width="120" align="center">
        </el-table-column>

        <el-table-column
          prop="video_title"
          label="视频名称"
          min-width="200"
          show-overflow-tooltip
        />

        <el-table-column prop="video_type" label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.video_type)">
              {{ getTypeName(row.video_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="is_delete" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="getDeleteStatusTagType(row.is_delete)">
              {{ getDeleteStatusName(row.is_delete) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="video_date_air" label="上映时间" width="120" align="center" />

        <el-table-column prop="tmdb_id" label="TMDB ID" width="100" align="center" />

        <el-table-column
          prop="video_description"
          label="简介"
          min-width="250"
          :show-overflow-tooltip="{
            popperClass: 'description-tooltip',
          }"
        />

        <el-table-column label="操作" width="280" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleChangeLibrary(row)">
              <el-icon><Folder /></el-icon>
              修改媒体库
            </el-button>
            <el-button type="warning" size="small" link @click="handleChangeImage(row)">
              <el-icon><Picture /></el-icon>
              修改封面
            </el-button>
            <el-button
              v-if="!row.is_delete"
              type="danger"
              size="small"
              link
              @click="handleDelete(row)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
            <el-button v-else type="success" size="small" link @click="handleRecover(row)">
              <el-icon><RefreshLeft /></el-icon>
              恢复
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 修改媒体库对话框 -->
    <ChangeLibraryDialog
      v-model="changeLibraryDialogVisible"
      :video-info="changeLibraryVideoInfo"
      :library-list="libraryList"
      @submit="handleChangeLibrarySubmit"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { Search, RefreshLeft, Delete, SwitchButton, Folder, Picture } from '@element-plus/icons-vue'
import {
  VIDEO_TYPE_OPTIONS,
  SEARCH_TYPE_OPTIONS,
  SEARCH_TYPE,
  VIDEO_TYPE_LABEL,
  VIDEO_TYPE_TAG,
  WITH_DELETE,
  WITH_DELETE_OPTIONS,
  SEARCH_TYPE_PLACEHOLDER,
  DELETE_STATUS_LABEL,
  DELETE_STATUS_TAG,
} from '@/constants'
import {
  getVideoList,
  deleteVideo,
  recoverVideo,
  changeVideoLibrary,
  changeLibraryImage,
  getLibraryList,
} from '@/api/video'

// 异步加载 Dialog 组件
const ChangeLibraryDialog = defineAsyncComponent(() => import('./ChangeLibraryDialog.vue'))

const router = useRouter()
const loading = ref(false)
const loadingCount = ref(0) // 请求计数器
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 用户信息
const username = ref(sessionStorage.getItem('username') || '未知用户')

// 媒体库列表
const libraryList = ref([])

// 修改媒体库 Dialog
const changeLibraryDialogVisible = ref(false)
const changeLibraryVideoInfo = ref({
  videoId: '',
  videoTitle: '',
  currentLibraryId: '',
  currentLibraryName: '',
})

// 查询表单
const queryForm = reactive({
  library: '', // 对应 library_id
  type: '', // 对应 type
  searchType: SEARCH_TYPE.NAME, // 搜索类型：id, name, tmdbId
  searchValue: '', // 搜索值
  withDelete: WITH_DELETE.NO, // 是否包含已删除的视频，0:否 1:是
})

// 计算搜索框的占位符
const searchPlaceholder = computed(() => {
  return SEARCH_TYPE_PLACEHOLDER[queryForm.searchType] || '请输入搜索内容'
})

const tableData = ref([])

// 获取类型名称
const getTypeName = (type) => {
  return VIDEO_TYPE_LABEL[type] || type
}

// 获取类型标签类型
const getTypeTagType = (type) => {
  return VIDEO_TYPE_TAG[type] || 'info'
}

// 获取删除状态名称
const getDeleteStatusName = (isDelete) => {
  return DELETE_STATUS_LABEL[isDelete] || '未知'
}

// 获取删除状态标签类型
const getDeleteStatusTagType = (isDelete) => {
  return DELETE_STATUS_TAG[isDelete] || 'info'
}

// 查询数据
const handleQuery = async () => {
  loadingCount.value++
  loading.value = true

  try {
    // 构建API请求参数
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      with_delete: queryForm.withDelete,
    }

    // 媒体库ID
    if (queryForm.library) {
      params.library_id = queryForm.library
    }

    // 视频类型
    if (queryForm.type) {
      params.type = queryForm.type
    }

    // 根据搜索类型映射搜索值
    if (queryForm.searchValue) {
      switch (queryForm.searchType) {
        case SEARCH_TYPE.ID:
          params.video_id = queryForm.searchValue
          break
        case SEARCH_TYPE.NAME:
          params.title = queryForm.searchValue
          break
        case SEARCH_TYPE.TMDB_ID:
          params.tmdb_id = queryForm.searchValue
          break
      }
    }

    // 调用API
    const response = await getVideoList(params)

    // 实际格式需要根据后端API调整
    if (response.items) {
      tableData.value = response.items || []
      total.value = response.total || 0
      ElMessage.success('查询成功')
    }
  } catch (error) {
    // 如果是取消请求的错误,不处理
    if (error && error.message && error.message.includes('重复请求')) {
      return
    }
    console.error('查询失败:', error)
    ElMessage.error(error.message || '查询失败')
  } finally {
    loadingCount.value--
    // 只有当所有请求都完成时才关闭 loading
    if (loadingCount.value <= 0) {
      loadingCount.value = 0
      loading.value = false
    }
  }
}

// 重置表单
const handleReset = () => {
  queryForm.library = ''
  queryForm.type = ''
  queryForm.searchType = SEARCH_TYPE.NAME
  queryForm.searchValue = ''
  queryForm.withDelete = WITH_DELETE.NO
  handleQuery()
}

// 修改媒体库
const handleChangeLibrary = (row) => {
  // 设置视频信息
  changeLibraryVideoInfo.value = {
    videoId: row.video_id,
    videoTitle: row.video_title,
    currentLibraryId: row.library_id,
    currentLibraryName: row.library_name,
  }

  // 打开对话框
  changeLibraryDialogVisible.value = true
}

// 提交修改媒体库
const handleChangeLibrarySubmit = async (data) => {
  try {
    await changeVideoLibrary(data.videoId, data.libraryId)
    ElMessage.success('修改成功')
    handleQuery()
  } catch (error) {
    console.error('修改失败:', error)
    ElMessage.error(error.message || '修改失败')
  }
}

// 修改封面
const handleChangeImage = async (row) => {
  ElMessageBox.prompt('请输入新的封面图片URL', '修改封面', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入图片URL',
    inputPattern: /^https?:\/\/.+/,
    inputErrorMessage: '请输入有效的URL地址',
  })
    .then(async ({ value }) => {
      try {
        await changeLibraryImage({
          video_id: row.video_id,
          image_url: value,
        })
        ElMessage.success('修改成功')
        handleQuery()
      } catch (error) {
        console.error('修改失败:', error)
        ElMessage.error(error.message || '修改失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}

// 删除
const handleDelete = async (row) => {
  ElMessageBox.confirm(`确定要删除 "${row.video_title}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteVideo(row.video_id)
        ElMessage.success('删除成功')
        handleQuery()
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error(error.message || '删除失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 恢复删除
const handleRecover = async (row) => {
  ElMessageBox.confirm(`确定要恢复 "${row.video_title}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info',
  })
    .then(async () => {
      try {
        await recoverVideo(row.video_id)
        ElMessage.success('恢复成功')
        handleQuery()
      } catch (error) {
        console.error('恢复失败:', error)
        ElMessage.error(error.message || '恢复失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消恢复')
    })
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  handleQuery()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  handleQuery()
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 清除 sessionStorage 中的所有登录信息
      sessionStorage.clear()
      ElMessage.success('退出成功')
      router.push('/login')
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}

// 获取媒体库列表
const fetchLibraryList = async () => {
  loadingCount.value++
  loading.value = true

  try {
    const response = await getLibraryList()
    libraryList.value = response || []
  } catch (error) {
    // 如果是取消请求的错误,不处理
    if (error && error.message && error.message.includes('重复请求')) {
      return
    }
    console.error('获取媒体库列表失败:', error)
    ElMessage.error('获取媒体库列表失败')
  } finally {
    loadingCount.value--
    // 只有当所有请求都完成时才关闭 loading
    if (loadingCount.value <= 0) {
      loadingCount.value = 0
      loading.value = false
    }
  }
}

// 组件挂载时加载数据
onMounted(async () => {
  // 检查登录状态
  const isLoggedIn = sessionStorage.getItem('isLoggedIn')
  if (!isLoggedIn) {
    router.push('/login')
    return
  }

  // 先获取媒体库列表,再加载视频列表
  await fetchLibraryList()

  // 加载视频列表
  handleQuery()
})
</script>

<style scoped>
.videos-container {
  padding: 20px;
  background: linear-gradient(135deg, #4cbfaa 0%, #2a9d8f 100%);
  min-height: 100vh;
}

.header-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.header-icon {
  width: 24px;
  height: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  margin-right: 16px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #409eff;
}

.username {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.table-card {
  background-color: #ffffff;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-form--inline .el-form-item) {
  margin-bottom: 15px;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  background-color: #fafafa;
  font-weight: 600;
}

:deep(.el-dialog__body) {
  padding: 20px 30px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>

<style>
/* 简介 tooltip 样式 - 需要使用全局样式 */
.description-tooltip {
  max-width: 400px;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}
</style>

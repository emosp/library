<template>
  <div class="videos-container" v-loading="pageLoading" element-loading-text="加载中...">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <img src="@/assets/icon.svg" alt="视频管理图标" class="header-icon" />
          <span class="title">视频资源管理服务</span>
          <el-button type="primary" @click="handleChangeLibraryImage">
            <el-icon><Picture /></el-icon>
            修改媒体库封面
          </el-button>
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
            filterable
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

        <el-form-item>
          <el-radio-group v-model="queryForm.type">
            <el-radio v-for="item in VIDEO_TYPE_OPTIONS" :key="item.value" :value="item.value">{{
              item.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-switch
            v-model="queryForm.withDelete"
            active-text="包含已删除视频"
            inactive-text="不包含已删除视频"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="queryForm.searchValue"
            :placeholder="searchPlaceholder"
            clearable
            style="width: 300px"
            @keyup.enter="handleQuery"
          >
            <template #prepend>
              <el-select v-model="queryForm.searchType" style="width: 110px">
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
    <el-card>
      <!-- PC端表格 -->
      <el-table
        :data="tableData"
        stripe
        border
        v-loading="loading"
        empty-text="暂无数据"
        class="pc-table"
      >
        <el-table-column prop="item_id" label="视频ID" width="90" align="center" />

        <el-table-column prop="library_name" label="所属媒体库" width="120" align="center">
        </el-table-column>

        <el-table-column
          prop="video_title"
          label="视频名称"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column label="封面" prop="video_image_cover" width="120" align="center">
          <template #default="{ row }">
            <el-image
              :src="row.video_image_cover"
              fit="cover"
              style="width: 80px; height: 120px"
              :preview-src-list="[row.video_image_cover]"
              :preview-teleported="true"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column prop="video_type" label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.video_type)">
              {{ getTypeName(row.video_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="video_date_air" label="上映时间" width="120" align="center" />

        <el-table-column label="TMDB ID" width="100" align="center">
          <template #default="{ row }">
            <el-link
              v-if="row.tmdb_id"
              :href="row.tmdb_url"
              target="_blank"
              type="primary"
              :underline="false"
            >
              {{ row.tmdb_id }}
            </el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="video_description"
          label="简介"
          min-width="250"
          :show-overflow-tooltip="{
            popperClass: 'description-tooltip',
          }"
        />
        <el-table-column label="资源总数" prop="media_count" width="120"></el-table-column>
        <el-table-column label="点播总数" prop="request_count" width="120"></el-table-column>

        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleChangeLibrary(row)">
              <el-icon><Folder /></el-icon>
              修改媒体库
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

      <!-- 移动端卡片列表 -->
      <div class="mobile-list" v-loading="loading">
        <el-empty v-if="!tableData.length" description="暂无数据" />
        <div v-else class="video-card" v-for="row in tableData" :key="row.item_id">
          <div class="video-card-content">
            <!-- 封面 -->
            <div class="video-cover">
              <el-image
                :src="row.video_image_cover"
                fit="cover"
                :preview-src-list="[row.video_image_cover]"
                :preview-teleported="true"
              >
                <template #error>
                  <div class="image-slot">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>

            <!-- 信息 -->
            <div class="video-info">
              <div class="video-title">{{ row.video_title }}</div>
              <div class="video-meta">
                <el-tag :type="getTypeTagType(row.video_type)" size="small">
                  {{ getTypeName(row.video_type) }}
                </el-tag>
                <span class="meta-item">ID: {{ row.item_id }}</span>
              </div>
              <div class="video-detail">
                <span class="detail-item">媒体库: {{ row.library_name }}</span>
                <span class="detail-item">上映: {{ row.video_date_air }}</span>
              </div>
              <div class="video-detail">
                <span class="detail-item">资源: {{ row.media_count }}</span>
                <span class="detail-item">点播: {{ row.request_count }}</span>
                <span class="detail-item" v-if="row.tmdb_id"
                  >TMDB ID:
                  <el-link
                    :href="row.tmdb_url"
                    target="_blank"
                    type="primary"
                    :underline="false"
                    class="tmdb-link"
                  >
                    {{ row.tmdb_id }}
                  </el-link></span
                >
              </div>
              <div class="video-description" v-if="row.video_description">
                {{ row.video_description }}
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="video-actions">
            <el-button type="primary" size="small" @click="handleChangeLibrary(row)">
              <el-icon><Folder /></el-icon>
              修改媒体库
            </el-button>
            <el-button v-if="!row.is_delete" type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
            <el-button v-else type="success" size="small" @click="handleRecover(row)">
              <el-icon><RefreshLeft /></el-icon>
              恢复
            </el-button>
          </div>
        </div>
      </div>

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

    <!-- 修改媒体库封面对话框 -->
    <ChangeImageDialog
      v-model="changeImageDialogVisible"
      :library-list="libraryList"
      @submit="handleChangeImageSubmit"
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
  SEARCH_TYPE_PLACEHOLDER,
} from '@/constants'
import {
  getVideoList,
  deleteVideo,
  recoverVideo,
  changeVideoLibrary,
  changeLibraryImage,
  getLibraryList,
} from '@/api'

// 异步加载 Dialog 组件
const ChangeLibraryDialog = defineAsyncComponent(() => import('./ChangeLibraryDialog.vue'))
const ChangeImageDialog = defineAsyncComponent(() => import('./ChangeImageDialog.vue'))

const router = useRouter()
const loading = ref(false) // 表格 loading
const pageLoading = ref(false) // 页面级 loading (用于 fetchLibraryList)
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

// 修改封面 Dialog
const changeImageDialogVisible = ref(false)

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
    }
  } catch (error) {
    // 响应拦截器已统一处理错误提示
    console.error('查询失败:', error)
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
  currentPage.value = 1
  pageSize.value = 10
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
  }
}

// 修改媒体库封面
const handleChangeLibraryImage = () => {
  // 打开对话框
  console.log(changeImageDialogVisible.value)

  changeImageDialogVisible.value = true
}

// 提交修改媒体库封面
const handleChangeImageSubmit = async (data) => {
  try {
    // 获取媒体库名称
    const library = libraryList.value.find((lib) => lib.id === data.libraryId)
    const libraryName = library?.name || '未知媒体库'

    // 子组件已经上传图片并返回 file_id，直接使用
    await changeLibraryImage(data.libraryId, data.fileId)
    ElMessage.success(`"${libraryName}" 封面修改成功，封面修改需要需要一段时间才能生效，请耐心等待`)
  } catch (error) {
    console.error('修改失败:', error)
  }
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
      }
    })
    .catch(() => {
      ElMessage.info('已取消恢复')
    })
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1 // 改变每页大小时重置到第一页
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
  pageLoading.value = true

  try {
    const response = await getLibraryList()
    libraryList.value = response || []
  } catch (error) {
    // 响应拦截器已统一处理错误提示
    console.error('获取媒体库列表失败:', error)
  } finally {
    pageLoading.value = false
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

/* 默认显示表格，隐藏移动端列表 */
.pc-table {
  display: block;
}

.mobile-list {
  display: none;
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

/* 按钮中的图标与文字间距 */
:deep(.el-button .el-icon) {
  margin-right: 5px;
}

/* 封面图片加载失败样式 */
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 20px;
}

/* 手机端适配 (小于 768px) */
@media screen and (max-width: 768px) {
  /* 隐藏表格，显示卡片列表 */
  .pc-table {
    display: none !important;
  }

  .mobile-list {
    display: block;
  }

  /* 视频卡片样式 */
  .video-card {
    background: #fff;
    border-radius: 8px;
    margin-bottom: 12px;
    padding: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .video-card-content {
    display: flex;
    gap: 12px;
    margin-bottom: 10px;
  }

  .video-cover {
    flex-shrink: 0;
    width: 80px;
    height: 120px;
    border-radius: 4px;
    overflow: hidden;
    background: #f5f7fa;
  }

  .video-cover :deep(.el-image) {
    width: 100%;
    height: 100%;
  }

  .video-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .video-title {
    font-size: 14px;
    font-weight: bold;
    color: #303133;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
  }

  .video-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .meta-item {
    font-size: 11px;
    color: #909399;
  }

  .video-detail {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 11px;
    color: #606266;
  }

  .detail-item {
    white-space: nowrap;
  }

  .tmdb-link {
    font-size: inherit;
    vertical-align: baseline;
  }

  .video-description {
    font-size: 11px;
    color: #909399;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
  }

  .video-actions {
    display: flex;
    gap: 8px;
    padding-top: 10px;
    border-top: 1px solid #f0f0f0;
  }

  .video-actions :deep(.el-button) {
    flex: 1;
    padding: 6px 10px;
    font-size: 12px;
  }

  /* 容器间距调整 */
  .videos-container {
    padding: 8px;
  }

  /* 头部卡片 */
  .header-card {
    margin-bottom: 10px;
  }

  :deep(.el-card__header) {
    padding: 10px;
  }

  :deep(.el-card__body) {
    padding: 10px;
  }

  /* 头部布局 - 响应式换行 */
  .card-header {
    flex-wrap: wrap;
    gap: 6px;
  }

  .header-icon {
    width: 20px;
    height: 20px;
  }

  .title {
    font-size: 15px;
    flex: 1 1 auto;
  }

  /* 隐藏用户名，只保留头像 */
  .user-info {
    margin-left: auto;
    margin-right: 8px;
  }

  .username {
    display: none;
  }

  .user-avatar {
    width: 28px;
    height: 28px;
  }

  /* 按钮尺寸调整 */
  :deep(.el-button) {
    padding: 6px 10px;
    font-size: 13px;
  }

  /* 表单布局 - 垂直排列 */
  :deep(.el-form--inline) {
    display: block;
  }

  :deep(.el-form--inline .el-form-item) {
    display: block;
    margin-right: 0;
    margin-bottom: 10px;
  }

  :deep(.el-form-item__label) {
    display: block;
    text-align: left;
    padding-bottom: 5px;
    width: 100% !important;
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }

  /* 表单控件宽度 */
  :deep(.el-select),
  :deep(.el-input),
  :deep(.el-radio-group) {
    width: 100% !important;
  }

  /* Switch 调整 */
  :deep(.el-switch__label) {
    font-size: 12px;
  }

  /* 表格优化 */
  :deep(.el-table) {
    font-size: 11px;
  }

  :deep(.el-table th),
  :deep(.el-table td) {
    padding: 6px 3px;
  }

  :deep(.el-table th .cell),
  :deep(.el-table td .cell) {
    padding: 0 3px;
    line-height: 1.3;
  }

  /* 表格内按钮 */
  :deep(.el-table .el-button--small) {
    padding: 3px 6px;
    font-size: 11px;
  }

  :deep(.el-table .el-button .el-icon) {
    margin-right: 2px;
  }

  /* 分页器 */
  .pagination {
    justify-content: center;
    margin-top: 10px;
  }

  :deep(.el-pagination) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
  }

  :deep(.el-pagination .btn-prev),
  :deep(.el-pagination .btn-next),
  :deep(.el-pagination .el-pager li) {
    min-width: 26px;
    height: 26px;
    line-height: 26px;
    font-size: 12px;
  }

  /* 隐藏分页器的部分元素 */
  :deep(.el-pagination__total),
  :deep(.el-pagination__jump) {
    display: none;
  }

  :deep(.el-pagination__sizes) {
    margin: 0 5px;
  }
}

/* 超小屏幕 (小于 480px) */
@media screen and (max-width: 480px) {
  .title {
    font-size: 14px;
  }

  :deep(.el-button) {
    padding: 5px 8px;
    font-size: 12px;
  }

  /* 修改媒体库封面按钮换行 */
  .card-header > .el-button:first-of-type {
    flex: 1 1 100%;
    order: 3;
  }

  /* 表格字体更小 */
  :deep(.el-table) {
    font-size: 10px;
  }

  :deep(.el-table .el-button--small) {
    font-size: 10px;
  }
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

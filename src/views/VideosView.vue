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

          <el-button
            type="danger"
            plain
            size="small"
            @click="handleLogout"
          >
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
            <el-option label="电影库" value="movies" />
            <el-option label="电视剧库" value="tvshows" />
            <el-option label="纪录片库" value="documentaries" />
            <el-option label="动漫库" value="anime" />
          </el-select>
        </el-form-item>

        <el-form-item label="类型">
          <el-select
            v-model="queryForm.type"
            placeholder="请选择类型"
            clearable
            style="width: 150px"
          >
            <el-option label="电影" value="movie" />
            <el-option label="剧集" value="series" />
            <el-option label="纪录片" value="documentary" />
            <el-option label="动漫" value="anime" />
          </el-select>
        </el-form-item>

        <el-form-item label="名称">
          <el-input
            v-model="queryForm.name"
            placeholder="请输入视频名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="TMDB ID">
          <el-input
            v-model="queryForm.tmdbId"
            placeholder="请输入TMDB ID"
            clearable
            style="width: 150px"
          />
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
          <el-button type="success" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table :data="tableData" stripe border v-loading="loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="library" label="所属媒体库" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getLibraryTagType(row.library)">
              {{ getLibraryName(row.library) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="category" label="所属分类" width="100" align="center">
          <template #default="{ row }">
            <el-tag effect="plain">{{ row.category }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="视频名称" min-width="200" show-overflow-tooltip />

        <el-table-column prop="type" label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">
              {{ getTypeName(row.type) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="releaseDate" label="上映时间" width="120" align="center" />

        <el-table-column prop="tmdbId" label="TMDB ID" width="100" align="center" />

        <el-table-column prop="description" label="简介" min-width="250" show-overflow-tooltip />

        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" size="small" link @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="媒体库" prop="library">
          <el-select v-model="formData.library" placeholder="请选择媒体库">
            <el-option label="电影库" value="movies" />
            <el-option label="电视剧库" value="tvshows" />
            <el-option label="纪录片库" value="documentaries" />
            <el-option label="动漫库" value="anime" />
          </el-select>
        </el-form-item>

        <el-form-item label="分类" prop="category">
          <el-input v-model="formData.category" placeholder="请输入分类" />
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入视频名称" />
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择类型">
            <el-option label="电影" value="movie" />
            <el-option label="剧集" value="series" />
            <el-option label="纪录片" value="documentary" />
            <el-option label="动漫" value="anime" />
          </el-select>
        </el-form-item>

        <el-form-item label="上映时间" prop="releaseDate">
          <el-date-picker
            v-model="formData.releaseDate"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="TMDB ID" prop="tmdbId">
          <el-input v-model="formData.tmdbId" placeholder="请输入TMDB ID" />
        </el-form-item>

        <el-form-item label="简介" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入视频简介"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search,
  RefreshLeft,
  Plus,
  Edit,
  Delete,
  SwitchButton,
} from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增视频')
const formRef = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 用户信息
const username = ref(sessionStorage.getItem('username') || '未知用户')

// 查询表单
const queryForm = reactive({
  library: '',
  type: '',
  name: '',
  tmdbId: '',
})

// 表单数据
const formData = reactive({
  id: null,
  library: '',
  category: '',
  name: '',
  type: '',
  releaseDate: '',
  tmdbId: '',
  description: '',
})

// 表单验证规则
const formRules = {
  library: [{ required: true, message: '请选择媒体库', trigger: 'change' }],
  category: [{ required: true, message: '请输入分类', trigger: 'blur' }],
  name: [{ required: true, message: '请输入视频名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  tmdbId: [{ required: true, message: '请输入TMDB ID', trigger: 'blur' }],
}

// 模拟数据
const mockData = [
  {
    id: 1,
    library: 'movies',
    category: '科幻',
    name: '星际穿越',
    type: 'movie',
    releaseDate: '2014-11-07',
    tmdbId: '157336',
    description: '在地球即将毁灭的未来，前宇航员库珀穿越太空寻找新的家园。',
  },
  {
    id: 2,
    library: 'tvshows',
    category: '剧情',
    name: '权力的游戏',
    type: 'series',
    releaseDate: '2011-04-17',
    tmdbId: '1399',
    description: '七大王国的贵族家族为了争夺铁王座展开了一场史诗般的权力斗争。',
  },
  {
    id: 3,
    library: 'documentaries',
    category: '自然',
    name: '地球脉动II',
    type: 'documentary',
    releaseDate: '2016-11-06',
    tmdbId: '61374',
    description: '展现地球上最壮观的自然景观和野生动物的生活。',
  },
  {
    id: 4,
    library: 'anime',
    category: '热血',
    name: '进击的巨人',
    type: 'anime',
    releaseDate: '2013-04-07',
    tmdbId: '1429',
    description: '人类与巨人的生存之战，揭示了世界的残酷真相。',
  },
  {
    id: 5,
    library: 'movies',
    category: '动作',
    name: '盗梦空间',
    type: 'movie',
    releaseDate: '2010-07-16',
    tmdbId: '27205',
    description: '一个专业的盗贼通过潜入他人梦境来窃取商业机密。',
  },
]

const tableData = ref([])

// 获取媒体库名称
const getLibraryName = (library) => {
  const map = {
    movies: '电影库',
    tvshows: '电视剧库',
    documentaries: '纪录片库',
    anime: '动漫库',
  }
  return map[library] || library
}

// 获取媒体库标签类型
const getLibraryTagType = (library) => {
  const map = {
    movies: 'primary',
    tvshows: 'success',
    documentaries: 'warning',
    anime: 'danger',
  }
  return map[library] || ''
}

// 获取类型名称
const getTypeName = (type) => {
  const map = {
    movie: '电影',
    series: '剧集',
    documentary: '纪录片',
    anime: '动漫',
  }
  return map[type] || type
}

// 获取类型标签类型
const getTypeTagType = (type) => {
  const map = {
    movie: '',
    series: 'success',
    documentary: 'warning',
    anime: 'danger',
  }
  return map[type] || ''
}

// 查询数据
const handleQuery = () => {
  loading.value = true

  setTimeout(() => {
    let filteredData = [...mockData]

    if (queryForm.library) {
      filteredData = filteredData.filter((item) => item.library === queryForm.library)
    }
    if (queryForm.type) {
      filteredData = filteredData.filter((item) => item.type === queryForm.type)
    }
    if (queryForm.name) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(queryForm.name.toLowerCase()),
      )
    }
    if (queryForm.tmdbId) {
      filteredData = filteredData.filter((item) => item.tmdbId.includes(queryForm.tmdbId))
    }

    total.value = filteredData.length
    tableData.value = filteredData
    loading.value = false

    ElMessage.success('查询成功')
  }, 500)
}

// 重置表单
const handleReset = () => {
  queryForm.library = ''
  queryForm.type = ''
  queryForm.name = ''
  queryForm.tmdbId = ''
  handleQuery()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增视频'
  dialogVisible.value = true
  Object.assign(formData, {
    id: null,
    library: '',
    category: '',
    name: '',
    type: '',
    releaseDate: '',
    tmdbId: '',
    description: '',
  })
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑视频'
  dialogVisible.value = true
  Object.assign(formData, { ...row })
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除 "${row.name}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 实际项目中这里应该调用删除API
      ElMessage.success('删除成功')
      handleQuery()
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      // 实际项目中这里应该调用新增/编辑API
      ElMessage.success(formData.id ? '编辑成功' : '新增成功')
      dialogVisible.value = false
      handleQuery()
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
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

// 组件挂载时加载数据
onMounted(() => {
  // 检查登录状态
  const isLoggedIn = sessionStorage.getItem('isLoggedIn')
  if (!isLoggedIn) {
    router.push('/login')
    return
  }

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
  border: 2px solid #409EFF;
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

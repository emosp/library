<template>
  <el-dialog
    v-model="visible"
    title="修改媒体库封面"
    class="change-image-dialog-mobile"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="formRules" ref="formRef" label-position="top">
      <el-form-item label="选择媒体库" prop="libraryId">
        <el-select
          v-model="formData.libraryId"
          placeholder="请选择媒体库"
          style="width: 100%"
          @change="handleLibraryChange"
        >
          <el-option
            v-for="item in libraryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="当前封面" v-if="formData.libraryId && formData.currentImageUrl">
        <div class="current-image">
          <el-image
            :src="formData.currentImageUrl"
            fit="cover"
            style="width: 200px; height: 112px"
            :preview-src-list="[formData.currentImageUrl]"
          >
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
                <span>加载失败</span>
              </div>
            </template>
          </el-image>
        </div>
      </el-form-item>

      <el-form-item label="上传封面" prop="imageFile">
        <el-upload
          ref="uploadRef"
          class="image-uploader"
          :auto-upload="false"
          :limit="1"
          :on-change="handleFileChange"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          accept="image/*"
          list-type="picture-card"
        >
          <el-icon class="upload-icon"><Plus /></el-icon>
          <template #tip>
            <div class="upload-tip">只能上传 jpg/png 文件，且不超过 5MB</div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item label="图片预览" v-if="previewUrl">
        <el-image
          :src="previewUrl"
          fit="cover"
          style="width: 200px; height: 112px"
          :preview-src-list="[previewUrl]"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import { Picture, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getUploadToken } from '@/api'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  libraryList: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(false)
const formRef = ref(null)
const uploadRef = ref(null)
const submitting = ref(false)
const previewUrl = ref('')
const formData = ref({
  libraryId: '',
  currentImageUrl: '',
  imageFile: null,
})

// 表单验证规则
const formRules = {
  libraryId: [{ required: true, message: '请选择媒体库', trigger: 'change' }],
  imageFile: [{ required: true, message: '请上传封面图片', trigger: 'change' }],
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    if (val) {
      // 打开对话框时初始化表单数据
      formData.value = {
        libraryId: '',
        currentImageUrl: '',
        imageFile: null,
      }
      previewUrl.value = ''
    }
  },
)

// 监听 visible 变化
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 媒体库选择变化
const handleLibraryChange = (libraryId) => {
  // 查找选中的媒体库
  const library = props.libraryList.find((item) => item.id === libraryId)

  if (library) {
    // 设置当前封面URL（假设媒体库对象有 image_url 字段）
    formData.value.currentImageUrl = library.image_url || library.imageUrl || ''
  } else {
    formData.value.currentImageUrl = ''
  }

  // 清除之前上传的文件
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
  formData.value.imageFile = null
  previewUrl.value = ''
}

// 文件改变时
const handleFileChange = async (file) => {
  const isImage = file.raw.type.startsWith('image/')
  const isLt5M = file.raw.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    uploadRef.value.clearFiles()
    return
  }

  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    uploadRef.value.clearFiles()
    return
  }

  formData.value.imageFile = file.raw

  // 生成预览 URL
  previewUrl.value = URL.createObjectURL(file.raw)

  // 获取上传 token
  getToken(file.raw)

  // 手动触发验证,清除错误提示
  if (formRef.value) {
    formRef.value.validateField('imageFile')
  }
}

const uploadToken = reactive({
  type: '',
  file_id: '',
  upload_url: '',
})
const getToken = (file) => {
  const params = {
    // 资源类型 video 视频 subtitle 字幕 image 图片
    type: 'image',
    // 文件格式
    file_type: file.type,
    // 文件名称
    file_name: file.name,
    // 文件大小 字节
    file_size: file.size,
    // 添加时间戳避免重复请求拦截
    timestamp: Date.now(),
  }
  getUploadToken(params)
    .then((res) => {
      uploadToken.type = res.type
      uploadToken.file_id = res.file_id
      uploadToken.upload_url = res.data.upload_url
    })
    .catch((error) => {
      // 响应拦截器已统一处理错误提示
      console.error('获取上传token失败:', error)
    })
}

// 文件超出限制
const handleExceed = () => {
  ElMessage.warning('只能上传 1 张图片，请先删除已上传的图片')
}

// 移除文件
const handleRemove = () => {
  formData.value.imageFile = null
  previewUrl.value = ''
}

const handleClose = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
  previewUrl.value = ''
  // 重置 uploadToken
  uploadToken.type = ''
  uploadToken.file_id = ''
  uploadToken.upload_url = ''
}

const handleCancel = () => {
  visible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    // 表单验证
    const valid = await formRef.value.validate()
    if (!valid) return

    // 检查是否已获取上传 token
    if (!uploadToken.upload_url || !uploadToken.file_id) {
      ElMessage.error('正在获取上传token，请稍后再试')
      return
    }

    submitting.value = true

    // 使用 PUT 方式上传图片到指定 URL
    const uploadResponse = await fetch(uploadToken.upload_url, {
      method: 'PUT',
      body: formData.value.imageFile,
    })

    if (!uploadResponse.ok) {
      throw new Error('图片上传失败')
    }

    ElMessage.success('图片上传成功')

    // 上传成功后，将 libraryId 和 file_id 传递给父组件
    emit('submit', {
      libraryId: formData.value.libraryId,
      fileId: uploadToken.file_id,
    })

    visible.value = false
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
:deep(.el-input.is-disabled .el-input__inner) {
  color: #606266;
}

.current-image,
.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-image {
  width: 200px;
  height: 112px;
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  flex-direction: column;
  gap: 8px;
  color: #909399;
}

.no-image .el-icon {
  font-size: 32px;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
  gap: 8px;
}

.image-error .el-icon {
  font-size: 32px;
}

.image-uploader {
  width: 100%;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
}

.upload-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 8px;
}
</style>

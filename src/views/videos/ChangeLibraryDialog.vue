<template>
  <el-dialog
    v-model="visible"
    title="修改媒体库"
    class="change-library-dialog-mobile"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="formRules" ref="formRef" label-position="top">
      <el-form-item label="视频名称">
        <el-input v-model="formData.videoTitle" disabled />
      </el-form-item>

      <el-form-item label="当前媒体库">
        <el-input v-model="formData.currentLibraryName" disabled />
      </el-form-item>

      <el-form-item label="新媒体库" prop="libraryId">
        <el-select v-model="formData.libraryId" placeholder="请选择媒体库" style="width: 100%">
          <el-option
            v-for="item in libraryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  videoInfo: {
    type: Object,
    default: () => ({
      videoId: '',
      videoTitle: '',
      currentLibraryId: '',
      currentLibraryName: '',
    }),
  },
  libraryList: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(false)
const formRef = ref(null)
const submitting = ref(false)
const formData = ref({
  videoTitle: '',
  currentLibraryName: '',
  libraryId: '',
})

// 表单验证规则
const formRules = {
  libraryId: [
    { required: true, message: '请选择媒体库', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value && value === props.videoInfo.currentLibraryId) {
          callback(new Error('新媒体库不能与当前媒体库相同'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    if (val) {
      // 打开对话框时初始化表单数据
      formData.value = {
        videoTitle: props.videoInfo.videoTitle,
        currentLibraryName: props.videoInfo.currentLibraryName,
        libraryId: '', // 默认为空,不选择任何媒体库
      }
    }
  },
)

// 监听 visible 变化
watch(visible, (val) => {
  emit('update:modelValue', val)
})

const handleClose = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

const handleCancel = () => {
  visible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', {
        videoId: props.videoInfo.videoId,
        libraryId: formData.value.libraryId,
      })
      visible.value = false
    }
  })
}
</script>

<style scoped>
:deep(.el-input.is-disabled .el-input__inner) {
  color: #606266;
}
</style>

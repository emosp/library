<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600px"
    @close="handleClose"
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
          <el-option
            v-for="item in VIDEO_TYPE_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
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
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { VIDEO_TYPE_OPTIONS } from '@/constants'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '新增视频'
  },
  data: {
    type: Object,
    default: () => ({
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
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(false)
const formRef = ref(null)
const formData = ref({ ...props.data })

// 表单验证规则
const formRules = {
  library: [{ required: true, message: '请选择媒体库', trigger: 'change' }],
  category: [{ required: true, message: '请输入分类', trigger: 'blur' }],
  name: [{ required: true, message: '请输入视频名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  tmdbId: [{ required: true, message: '请输入TMDB ID', trigger: 'blur' }],
}

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  visible.value = val
})

// 监听 visible 变化
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 监听 data 变化
watch(() => props.data, (val) => {
  formData.value = { ...val }
}, { deep: true })

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
      emit('submit', formData.value)
      visible.value = false
    }
  })
}
</script>

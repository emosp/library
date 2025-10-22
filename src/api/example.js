/**
 * API 使用示例
 *
 * 这个文件演示了如何在组件中使用 API
 */

import { getVideoList, updateVideo, deleteVideo } from '@/api'

// 示例 1: 获取视频列表
export const fetchVideos = async (queryParams) => {
  try {
    const response = await getVideoList(queryParams)
    // response.data 包含视频列表数据
    return response.data
  } catch (error) {
    console.error('获取视频列表失败:', error)
    throw error
  }
}

// 示例 2: 更新视频信息
export const handleUpdateVideo = async (videoId, videoData) => {
  try {
    const response = await updateVideo(videoId, videoData)
    return response.data
  } catch (error) {
    console.error('更新视频失败:', error)
    throw error
  }
}

// 示例 3: 删除视频
export const handleDeleteVideo = async (videoId) => {
  try {
    await deleteVideo(videoId)
    return true
  } catch (error) {
    console.error('删除视频失败:', error)
    throw error
  }
}

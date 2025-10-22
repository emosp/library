/*
 * @Author: flkGit
 * @Date: 2025-10-22 15:01:02
 * @LastEditors: flkGit
 * @LastEditTime: 2025-10-22 15:59:29
 * @FilePath: /emos_library/src/api/video.js
 * @Description:
 *
 * Copyright (c) 2025 by flkGit, All Rights Reserved.
 */
import request from '@/utils/request'

/**
 * 视频管理相关 API
 */

// 获取视频列表
export const getVideoList = (params) => {
  return request({
    url: '/api/video/list',
    method: 'get',
    params,
  })
}

// 获取视频详情
export const getVideoDetail = (id) => {
  return request({
    url: `/api/videos/${id}`,
    method: 'get',
  })
}

// 更新视频信息
export const updateVideo = (id, data) => {
  return request({
    url: `/api/videos/${id}`,
    method: 'put',
    data,
  })
}

// 删除视频
export const deleteVideo = (videoId) => {
  return request({
    url: `/api/video/${videoId}/delete`,
    method: 'delete',
  })
}

// 恢复删除的视频
export const recoverVideo = (videoId) => {
  return request({
    url: `/api/video/${videoId}/recover`,
    method: 'patch',
  })
}

// 修改视频所在媒体库ID
export const changeVideoLibrary = (videoId, libraryId) => {
  return request({
    url: `/api/video/${videoId}/changeLibraryId`,
    method: 'put',
    params: {
      library_id: libraryId,
    },
  })
}

// 获取媒体库列表
export const getLibraryList = () => {
  return request({
    url: '/api/library/base',
    method: 'get',
  })
}

// 修改媒体库封面
export const changeLibraryImage = (libraryId, fileId) => {
  return request({
    url: '/api/library/changeImage',
    method: 'put',
    data: {
      library_id: libraryId,
      file_id: fileId,
    },
  })
}

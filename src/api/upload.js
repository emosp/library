/*
 * @Author: flkGit
 * @Date: 2025-10-22 15:34:12
 * @LastEditors: flkGit
 * @LastEditTime: 2025-10-22 15:35:47
 * @FilePath: /emos_library/src/api/upload.js
 * @Description:
 *
 * Copyright (c) 2025 by flkGit, All Rights Reserved.
 */
import request from '@/utils/request'

/**
 * 文件上传相关api
 */

// 获取上传token
export const getUploadToken = (data) => {
  return request({
    url: '/api/upload/getUploadToken',
    method: 'post',
    data,
  })
}

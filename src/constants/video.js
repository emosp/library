/*
 * @Author: flkGit
 * @Date: 2025-10-22 13:41:00
 * @LastEditors: flkGit
 * @LastEditTime: 2025-10-22 14:28:32
 * @FilePath: /emos_library/src/constants/video.js
 * @Description:
 *
 * Copyright (c) 2025 by flkGit, All Rights Reserved.
 */
/**
 * 视频类型常量
 */
export const VIDEO_TYPE = {
  MOVIE: 'movie', // 电影
  TV: 'tv', // 电视
}

/**
 * 视频类型标签映射
 */
export const VIDEO_TYPE_LABEL = {
  [VIDEO_TYPE.MOVIE]: '电影',
  [VIDEO_TYPE.TV]: '电视',
}

/**
 * 视频类型标签颜色映射
 */
export const VIDEO_TYPE_TAG = {
  [VIDEO_TYPE.MOVIE]: 'primary', // 电影 - 蓝色
  [VIDEO_TYPE.TV]: 'success', // 电视 - 绿色
}

/**
 * 视频类型选项（用于下拉框）
 */
export const VIDEO_TYPE_OPTIONS = [
  { label: '电影', value: VIDEO_TYPE.MOVIE },
  { label: '电视', value: VIDEO_TYPE.TV },
]

/**
 * 搜索类型常量
 */
export const SEARCH_TYPE = {
  ID: 'id', // 视频ID
  NAME: 'name', // 视频名称
  TMDB_ID: 'tmdbId', // TMDB ID
}

/**
 * 搜索类型标签映射
 */
export const SEARCH_TYPE_LABEL = {
  [SEARCH_TYPE.ID]: '视频ID',
  [SEARCH_TYPE.NAME]: '视频名称',
  [SEARCH_TYPE.TMDB_ID]: 'TMDB ID',
}

/**
 * 搜索类型占位符映射
 */
export const SEARCH_TYPE_PLACEHOLDER = {
  [SEARCH_TYPE.ID]: '请输入视频ID',
  [SEARCH_TYPE.NAME]: '请输入视频名称',
  [SEARCH_TYPE.TMDB_ID]: '请输入TMDB ID',
}

/**
 * 搜索类型选项
 */
export const SEARCH_TYPE_OPTIONS = [
  { label: '视频ID', value: SEARCH_TYPE.ID },
  { label: '视频名称', value: SEARCH_TYPE.NAME },
  { label: 'TMDB ID', value: SEARCH_TYPE.TMDB_ID },
]

/**
 * 是否包含已删除视频常量
 */
export const WITH_DELETE = {
  NO: 0, // 否 - 不包含已删除
  YES: 1, // 是 - 包含已删除
}

/**
 * 是否包含已删除视频选项
 */
export const WITH_DELETE_OPTIONS = [
  { label: '否', value: WITH_DELETE.NO },
  { label: '是', value: WITH_DELETE.YES },
]

/**
 * 视频删除状态常量
 */
export const DELETE_STATUS = {
  NORMAL: false, // 正常
  DELETED: true, // 已删除
}

/**
 * 视频删除状态标签映射
 */
export const DELETE_STATUS_LABEL = {
  [DELETE_STATUS.NORMAL]: '正常',
  [DELETE_STATUS.DELETED]: '已删除',
}

/**
 * 视频删除状态标签颜色映射
 */
export const DELETE_STATUS_TAG = {
  [DELETE_STATUS.NORMAL]: 'success', // 正常 - 绿色
  [DELETE_STATUS.DELETED]: 'info', // 已删除 - 灰色
}

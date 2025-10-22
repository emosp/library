/**
 * 视频类型常量
 */
export const VIDEO_TYPE = {
  MOVIE: 'movie',  // 电影
  TV: 'tv'         // 电视
}

/**
 * 视频类型标签映射
 */
export const VIDEO_TYPE_LABEL = {
  [VIDEO_TYPE.MOVIE]: '电影',
  [VIDEO_TYPE.TV]: '电视'
}

/**
 * 视频类型选项（用于下拉框）
 */
export const VIDEO_TYPE_OPTIONS = [
  { label: '电影', value: VIDEO_TYPE.MOVIE },
  { label: '电视', value: VIDEO_TYPE.TV }
]

/**
 * 搜索类型常量
 */
export const SEARCH_TYPE = {
  ID: 'id',           // 视频ID
  NAME: 'name',       // 视频名称
  TMDB_ID: 'tmdbId'   // TMDB ID
}

/**
 * 搜索类型标签映射
 */
export const SEARCH_TYPE_LABEL = {
  [SEARCH_TYPE.ID]: '视频ID',
  [SEARCH_TYPE.NAME]: '视频名称',
  [SEARCH_TYPE.TMDB_ID]: 'TMDB ID'
}

/**
 * 搜索类型选项
 */
export const SEARCH_TYPE_OPTIONS = [
  { label: '视频ID', value: SEARCH_TYPE.ID },
  { label: '视频名称', value: SEARCH_TYPE.NAME },
  { label: 'TMDB ID', value: SEARCH_TYPE.TMDB_ID }
]

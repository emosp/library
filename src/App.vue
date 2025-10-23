<script setup></script>

<template>
  <RouterView />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family:
    'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Dialog PC端默认宽度 */
.el-dialog.change-library-dialog-mobile {
  --el-dialog-width: 500px;
}

.el-dialog.change-image-dialog-mobile {
  --el-dialog-width: 500px;
}

/* Dialog 移动端适配 - 全局样式 */
@media screen and (max-width: 768px) {
  /* 修改媒体库 Dialog */
  .el-dialog.change-library-dialog-mobile {
    --el-dialog-width: 90% !important;
    --el-dialog-margin-top: 5vh !important;
  }

  .change-library-dialog-mobile .el-dialog__header {
    padding: 15px;
  }

  .change-library-dialog-mobile .el-dialog__body {
    padding: 15px;
    overflow-x: hidden;
  }

  .change-library-dialog-mobile .el-dialog__footer {
    padding: 12px 15px;
  }

  .change-library-dialog-mobile .el-form-item {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .change-library-dialog-mobile .el-form-item__label {
    font-size: 13px;
    width: 100% !important;
    text-align: left;
    padding-bottom: 5px;
  }

  .change-library-dialog-mobile .el-form-item__content {
    margin-left: 0 !important;
  }

  .change-library-dialog-mobile .el-button {
    padding: 8px 15px;
    font-size: 14px;
  }

  /* 修改媒体库封面 Dialog */
  .el-dialog.change-image-dialog-mobile {
    --el-dialog-width: 90% !important;
    --el-dialog-margin-top: 5vh !important;
  }

  .change-image-dialog-mobile .el-dialog__header {
    padding: 15px;
  }

  .change-image-dialog-mobile .el-dialog__body {
    padding: 15px;
    overflow-x: hidden;
  }

  .change-image-dialog-mobile .el-dialog__footer {
    padding: 12px 15px;
  }

  .change-image-dialog-mobile .el-form-item {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .change-image-dialog-mobile .el-form-item__label {
    font-size: 13px;
    width: 100% !important;
    text-align: left;
    padding-bottom: 5px;
  }

  .change-image-dialog-mobile .el-form-item__content {
    margin-left: 0 !important;
  }

  .change-image-dialog-mobile .el-button {
    padding: 8px 15px;
    font-size: 14px;
  }

  /* 当前封面和预览图片尺寸调整 */
  .change-image-dialog-mobile .current-image {
    display: flex;
    justify-content: center;
  }

  .change-image-dialog-mobile .current-image .el-image {
    width: 100% !important;
    max-width: 200px !important;
    height: auto !important;
  }

  /* 上传区域调整 */
  .change-image-dialog-mobile .el-upload-list--picture-card {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .change-image-dialog-mobile .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }

  .change-image-dialog-mobile .el-upload--picture-card {
    width: 100px;
    height: 100px;
  }

  .change-image-dialog-mobile .upload-icon {
    font-size: 24px;
  }

  .change-image-dialog-mobile .upload-tip {
    font-size: 11px;
  }
}
</style>

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个使用 Vue 3 + Vite 构建的 Emos 视频资源管理服务前端项目，采用 Element Plus UI 框架，Pinia 进行状态管理，Vue Router 进行路由管理。

## 开发环境要求

- Node.js: ^20.19.0 或 >=22.12.0
- 包管理器: pnpm

## 环境变量

项目使用 `.env` 文件管理不同环境的配置：

- `.env.development` - 开发环境配置
  - API 地址: `https://dev.emos.lol/`
- `.env.production` - 生产环境配置
  - API 地址: `https://emos.lol/`

在代码中使用：
```javascript
import { baseURL } from '@/config'
// baseURL 会根据当前环境自动切换
```

## 常用命令

### 开发
```bash
pnpm dev              # 启动开发服务器（热重载）
```

### 构建
```bash
pnpm build            # 生产环境构建
pnpm preview          # 预览生产构建
```

### 代码质量
```bash
pnpm lint             # 运行 ESLint 并自动修复问题
pnpm format           # 使用 Prettier 格式化 src/ 目录下的代码
```

### 依赖管理
```bash
pnpm install          # 安装所有依赖
```

## 项目架构

### 目录结构
- `src/` - 源代码目录
  - `views/` - 页面组件
    - `LoginView.vue` - 登录页面
    - `videos/` - 视频管理模块
      - `VideosView.vue` - 视频列表页面
      - `VideoEditDialog.vue` - 视频编辑对话框（异步加载）
  - `api/` - API 接口管理
    - `index.js` - 统一导出
    - `auth.js` - 用户认证相关 API
    - `video.js` - 视频管理相关 API
  - `utils/` - 工具函数
    - `request.js` - axios 请求封装
  - `router/` - Vue Router 路由配置
  - `stores/` - Pinia 状态管理存储
  - `assets/` - 静态资源（图片、SVG 等）
  - `config/` - 配置文件
    - `index.js` - 环境变量配置
  - `main.js` - 应用入口文件
  - `App.vue` - 根组件
- `public/` - 静态资源目录
- `.env.development` - 开发环境变量
- `.env.production` - 生产环境变量
- `vite.config.js` - Vite 配置文件
- `eslint.config.js` - ESLint 配置文件
- `jsconfig.json` - JavaScript 配置（包含路径别名）

### 路径别名
- `@/` 映射到 `./src/`，在导入时可以使用 `@/` 代替相对路径

### 技术栈
- **框架**: Vue 3 (Composition API)
- **UI 框架**: Element Plus 2.x (按需引入)
- **构建工具**: Vite 7.x
- **状态管理**: Pinia 3.x
- **路由**: Vue Router 4.x (Hash 模式，懒加载)
- **HTTP 客户端**: Axios
- **代码规范**: ESLint + Prettier
- **开发工具**: Vite DevTools

## 开发注意事项

### HTTP 请求管理

项目使用 axios 进行 HTTP 请求管理：

**请求封装** (`src/utils/request.js`):
- 自动添加 baseURL 和 timeout
- 请求拦截器：自动添加 Authorization token
- 响应拦截器：统一处理错误和异常状态码
- 401 未授权时自动跳转登录页

**API 管理** (`src/api/`):
- 按模块组织 API（auth.js、video.js 等）
- 统一从 `src/api/index.js` 导出

**使用示例**:
```javascript
import { getVideoList, updateVideo } from '@/api'

// 获取列表
const data = await getVideoList({ page: 1, size: 10 })

// 更新数据
await updateVideo(id, { name: '新名称' })
```

### Element Plus 按需引入
- 项目使用 `unplugin-auto-import` 和 `unplugin-vue-components` 实现 Element Plus 按需引入
- 组件和 API 会自动导入，无需手动 import
- 全局 API（如 ElMessage、ElMessageBox）已在 ESLint 配置中声明

### 路由配置
- 使用 Hash 模式 (`createWebHashHistory`)
- 所有路由组件使用动态导入实现懒加载
- 路由守卫实现登录验证
- 用户登录状态存储在 `sessionStorage` 中

### 代码分割优化
- **路由懒加载**: 所有页面组件使用 `() => import()` 动态导入
- **组件异步加载**: Dialog 等重型组件使用 `defineAsyncComponent` 异步加载
- **Vendor 分块**:
  - `vue-vendor` chunk: Vue、Vue Router、Pinia
  - `element-plus` chunk: Element Plus 和图标库
- 构建产物大小 (gzip):
  - vue-vendor: ~41 KB
  - element-plus: ~137 KB
  - 页面组件: 按需加载

### UI 设计规范
- **主题色**: `#4cbfaa` (青绿色)
- **背景渐变**: `linear-gradient(135deg, #4cbfaa 0%, #2a9d8f 100%)`
- **应用图标**: `src/assets/icon.svg`
- **字体**: Helvetica Neue, PingFang SC, Microsoft YaHei

### ESLint 和 Prettier
- 项目配置了 ESLint 和 Prettier 进行代码质量控制
- 使用 `pnpm lint` 自动修复 linting 问题
- 使用 `pnpm format` 格式化代码

### 状态管理
- 使用 Pinia 进行状态管理
- Store 文件位于 `src/stores/` 目录

### Vite 配置
- 开发服务器和构建配置在 `vite.config.js` 中
- 已配置 Vue DevTools 插件用于开发调试
- 配置了 Element Plus 自动导入
- 配置了代码分割策略 (manualChunks)

## 性能优化

### 已实施的优化
1. **按需引入**: Element Plus 组件按需加载，避免全量引入
2. **路由懒加载**: 所有路由组件动态导入
3. **组件异步加载**: VideoEditDialog 等组件异步加载
4. **代码分块**: Vue 核心库和 Element Plus 独立打包
5. **CSS 分割**: 每个异步组件的样式独立打包

### 构建产物说明
- 主应用文件很小 (~3 KB)，首屏加载快
- 第三方库独立打包，利于浏览器缓存
- Dialog 等组件只在需要时才加载


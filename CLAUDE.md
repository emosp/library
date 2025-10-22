# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个使用 Vue 3 + Vite 构建的前端项目，采用 Pinia 进行状态管理，Vue Router 进行路由管理。

## 开发环境要求

- Node.js: ^20.19.0 或 >=22.12.0
- 包管理器: pnpm

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
  - `router/` - Vue Router 路由配置
  - `stores/` - Pinia 状态管理存储（例如：counter.js）
  - `main.js` - 应用入口文件
- `public/` - 静态资源目录
- `vite.config.js` - Vite 配置文件
- `jsconfig.json` - JavaScript 配置（包含路径别名）

### 路径别名
- `@/` 映射到 `./src/`，在导入时可以使用 `@/` 代替相对路径

### 技术栈
- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 7.x
- **状态管理**: Pinia 3.x
- **路由**: Vue Router 4.x
- **代码规范**: ESLint + Prettier
- **开发工具**: Vite DevTools

## 开发注意事项

### ESLint 和 Prettier
- 项目配置了 ESLint 和 Prettier 进行代码质量控制
- 使用 `pnpm lint` 自动修复 linting 问题
- 使用 `pnpm format` 格式化代码

### 状态管理
- 使用 Pinia 进行状态管理
- Store 文件位于 `src/stores/` 目录
- 当前已有 counter.js 作为示例 store

### 路由
- 路由配置位于 `src/router/` 目录
- 使用 Vue Router 4.x 的最新 API

### Vite 配置
- 开发服务器和构建配置在 `vite.config.js` 中
- 已配置 Vue DevTools 插件用于开发调试

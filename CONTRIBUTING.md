# 贡献指南

## Pull Request 规范
- 请先 fork 一份到自己的项目下，不要直接在仓库下建分支。

- commit 信息要以# [记录] + messages


- 执行 `yarn run dev && yarn run build` 后可以正确打包文件。

- 提交 PR 前请 rebase，确保 commit 记录的整洁。

- 确保 PR 是提交到 `dev` 分支，而不是 `master` 分支。

- 如果是修复 bug，请在 PR 中给出描述信息。


## 开发环境搭建

首先你需要 Node.js 8+ 和 NPM 5+
```shell
git clone https://github.com/Liquid-Zhangliquan/ycyfans-map.git
yarn or npm i
yarn run dev
```

## 项目目录说明

```bash

├── build // 包含webpack相关的打包脚本和部署脚本。
│   └── deploy.js
│   └── helper.js
│   └── webpack.base.conf.js
│   └── webpack.dev.conf.js
│   └── webpack.dll.conf.js
│   └── webpack.prod.conf.js
├── public // 静态资源目录（可能包含字体图标，图片等）。
│   
├── src // 源码目录
│   ├── assets // 资源目录（img， scss，js）
│   ├── components // 公共组件
│   ├── plugin // 外部插件
│   ├── redux 
│   ├── routes // 路由
│   ├── services // ajax服务api目录
│   ├── utils // 工具
│   ├── views // 视图
│   └── index.html
│   └── index.jsx

```

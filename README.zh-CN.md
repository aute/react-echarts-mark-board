# [react-echarts-mark-board](https://github.com/aute/react-echarts-mark-board)
[English](./README.md) | 简体中文

react-echarts-mark-board 是基于 React 标注绘制工具，支持绘制线段、方向及封闭图形

## 例子
#### 👉 [例子](https://aute.github.io/react-echarts-mark-board)
![demo](./demo.gif)

## ⭐️ 特性

- 进行线段、方向及封闭图形的绘制，可应用于计算机视觉相关项目标注工作
- 绘制过程中双击即可结束绘制。特别的，当绘制封闭图形时，除双击外，首尾锚点足够靠近也可自动吸附闭合图形
- 基于 React 及 TypeScript
- 相关系统大量采用 eCharts 进行数据展示，基于 eCharts 绘图减少依赖大小（视需求进行无第三方绘图依赖版本开发）
- 无外部样式，内部样式如线段、方向及封闭图形支持颜色、宽度自定义
- 自适应父元素大小，数据以归一化形式返回

## 📂 目录介绍

```
.
├── lib 编译产出代码
├── docs 例子及文档
├── src 源代码目录
├── CHANGELOG.md 变更日志
└── TODO.md 计划功能
```

## 🚀  使用者指南

通过npm下载安装代码

```bash
$ npm install --save react-echarts-mark-board
```

如果你是webpack等环境

```js
import reactEchartsDrawMark from 'react-echarts-mark-board';
```

## 📑  文档
- #### [API](./api.zh-CN.md)
- #### [lib statistics](https://aute.github.io/react-echarts-mark-board/statistics)
- #### [test coverage](https://aute.github.io/react-echarts-mark-board/coverage/lcov-report/)

## 😘 贡献者指南

首次运行需要先安装依赖

```bash
$ npm install
```

一键打包生成生产代码

```bash
$ npm run build
```

运行单元测试:

```bash
$ npm test
```

修改 package.json 中的版本号，修改 README.md 中的版本号，修改 CHANGELOG.md，然后发布新版

```bash
$ npm run release
```

将新版本发布到npm

```bash
$ npm publish
```


## ⚙️ 更新日志
[CHANGELOG.md](./CHANGELOG.md)

## ✈️ 计划列表
[TODO.md](./TODO.md)


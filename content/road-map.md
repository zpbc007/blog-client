---
title: Road map
description: 文档站规划
position: 3
category: 'Getting started'
---

# yoda 文档站

## 需求

- 使用项目中的 md 文件生成文档
- 使用后端 api 接口生成文档
- 代码在线编辑能力
- 代码在线运行能力
- 可将代码同步到其他端
- vue 组件运行能力
- vue stack
- vue3
- 全文搜索能力
- 更新能力
- 静态化能力

## 技术方案选择

- gatsby

  - 优点:

    1. 可纯静态化，编译时根据 graphql 查询所有数据，生成页面
    2. antv theme 稍加改动后即可使用

  - 缺点:
    1. react 技术栈
    2. 缺乏动态能力(之后可能会有动态的需求)
    3. 搜索为纯 js 实现，后期数据量大时，索引文件的大小会是个问题

- gridsome

  - 优点:

    1. gatsby 的 vue 实现

  - 缺点:
    1. 没有可直接使用的主题
    2. 不太活跃，容易被弃坑

- nuxt

  - 优点:

    1. 可动静结合，可以部分 ssg，部分 ssr
    2. content module + docs theme 可以满足 md 文档功能
    3. 可扩展性比较好，可以支持后期复杂的需求

  - 缺点:
    1. content 只支持本地 md 文件，不支持 api 获取数据
    2. 开发量比 gatsby 高

目前倾向选择 nuxt，vue stack, 较为灵活，后期复杂需求也可以满足

## 如何实现

#### 1. 文档生成

- 根据 api 内容生成 md 文件(速度慢、会产生大量中间文件)
- ~~fork content，将 api 内容转为与本地 md 一样的格式(直接 fork，后续更新是个问题)~~copy docs theme
- 使用 content 解析本地文件，api 获取的数据与 content 内容统一放到 graphql 上
- docs theme 使用 graphql 获取数据
- 自己开发，使用 Apollo 实现 gatsby 机制(工作量大，但可自定义)

#### 2. 全文搜索

- 使用纯 js 方案，生成索引文件直接扔到前端
- 生成的索引文件扔到 node 端，前端发送请求
- 使用全文搜索引擎

#### 3. demo

- 先搞个 vue 的代码编辑组件
- 使用 babel 在浏览器端编译代码
- new Function 方式运行
- 将代码放到 url query 里
- 代码传到 node 里暂存
- web rtc

## road map

1. 快速搭建

   - [x] 使用 nuxt + content 创建项目
   - [x] copy docs theme 展示本地 md
   - [ ] 使用 graphql 作为数据层，将 content 解析的 md 文件和 api 中获取的文档注入
   - [ ] 编译时生成索引文件，使用 serverMiddleWare 完成服务端的搜索功能
   - [ ] 从后端 api 里读取数据，生成 md 文件
   - [ ] 使用 docs theme 的搜索能力，纯静态站
   - [ ] 代码编辑能力
   - [ ] 代码编译能力
   - [ ] 代码运行能力
   - [ ] 使用 url query 传输代码
   - [ ] 根据文件名、文件夹名排序

2. 优化编译时间

   - [ ] fork content / 使用 Apollo + 自定义 theme

3. 优化搜索时间

   - [ ] 索引文件放在 node 端
   - [ ] 使用全文搜索引擎

4. 优化代码传输能力

   - [ ] 编辑后发到 node 暂存，并生成临时 id
   - [ ] 根据 id 获取对应代码片段
   - [ ] 使用 web rtc，直接发过去

5. md 文档管理

   - [ ] strapi 等 cms

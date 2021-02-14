---
title: Search
description: 搜索功能实现
position: 7
category: 'features'
---

## 需求

- [ ] 支持中文检索
- [ ] 多语言同时检索
- [ ] 支持索引文件序列化(编译时生成)
- [ ] 支持根据序列化的索引创建搜索对象(服务端 or 浏览器)

## 选择

- content 中的 lokidb 与 @lokidb/full-text-search

  - 不支持中文检索
  - 与 content 绑定，得往 content database 中注入所有文档

- 自定义搜索 lunr

## 输入

- 文档的集合
- 建立索引的字段

## 输出

- 查询对象
- 序列化索引方法
- 反序列化索引方法

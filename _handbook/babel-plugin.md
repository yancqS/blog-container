---
title: Babel 插件手册
description: 文档涵盖了如何创建 Babel 插件等方面的内容
link: https://babeljs.io/
github: https://github.com/babel/babel
languages:
  - AST
  - Babel
---

# Babel 插件手册

这篇文档涵盖了如何创建 [Babel](https://babeljs.io) [插件](https://babeljs.io/docs/advanced/plugins/)等方面的内容。.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

# 目录

  * [介绍](#toc-introduction)
  * [基础](#toc-basics) 
      * [抽象语法树（ASTs）](#toc-asts)
      * [Babel 的处理步骤](#toc-stages-of-babel)
      * [解析](#toc-parse) 
          * [词法分析](#toc-lexical-analysis)
          * [语法分析](#toc-syntactic-analysis)
      * [转换](#toc-transform)
      * [生成](#toc-generate)
      * [遍历](#toc-traversal)
      * [Visitors（访问者）](#toc-visitors)
      * [Paths（路径）](#toc-paths) 
          * [Paths in Visitors（存在于访问者中的路径）](#toc-paths-in-visitors)
      * [State（状态）](#toc-state)
      * [Scopes（作用域）](#toc-scopes) 
          * [Bindings（绑定）](#toc-bindings)
  * [API](#toc-api) 
      * [babylon](#toc-babylon)
      * [babel-traverse](#toc-babel-traverse)
      * [babel-types](#toc-babel-types)
      * [Definitions（定义）](#toc-definitions)
      * [Builders（构建器）](#toc-builders)
      * [Validators（验证器）](#toc-validators)
      * [Converters（变换器）](#toc-converters)
      * [babel-generator](#toc-babel-generator)
      * [babel-template](#toc-babel-template)
  * [编写你的第一个 Babel 插件](#toc-writing-your-first-babel-plugin)
  * [转换操作](#toc-transformation-operations) 
      * [访问](#toc-visiting)
      * [获取子节点的Path](#toc-get-the-path-of-a-sub-node)
      * [检查节点（Node）类型](#toc-check-if-a-node-is-a-certain-type)
      * [检查路径（Path）类型](#toc-check-if-a-path-is-a-certain-type)
      * [检查标识符（Identifier）是否被引用](#toc-check-if-an-identifier-is-referenced)
      * [找到特定的父路径](#toc-find-a-specific-parent-path)
      * [获取同级路径](#toc-get-sibling-paths)
      * [停止遍历](#toc-stopping-traversal)
      * [处理](#toc-manipulation)
      * [替换一个节点](#toc-replacing-a-node)
      * [用多节点替换单节点](#toc-replacing-a-node-with-multiple-nodes)
      * [用字符串源码替换节点](#toc-replacing-a-node-with-a-source-string)
      * [插入兄弟节点](#toc-inserting-a-sibling-node)
      * [插入到容器（container）中](#toc-inserting-into-a-container)
      * [删除节点](#toc-removing-a-node)
      * [替换父节点](#toc-replacing-a-parent)
      * [删除父节点](#toc-removing-a-parent)
      * [Scope（作用域）](#toc-scope)
      * [检查本地变量是否被绑定](#toc-checking-if-a-local-variable-is-bound)
      * [生成UID](#toc-generating-a-uid)
      * [提升变量声明至父级作用域](#toc-pushing-a-variable-declaration-to-a-parent-scope)
      * [重命名绑定及其引用](#toc-rename-a-binding-and-its-references)
  * [插件选项](#toc-plugin-options) 
      * [插件的准备和收尾工作](#toc-pre-and-post-in-plugins)
      * [在插件中启用其他语法](#toc-enabling-syntax-in-plugins)
  * [构建节点](#toc-building-nodes)
  * [最佳实践](#toc-best-practices) 
      * [尽量避免遍历抽象语法树（AST）](#toc-avoid-traversing-the-ast-as-much-as-possible)
      * [及时合并访问者对象](#toc-merge-visitors-whenever-possible)
      * [可以手动查找就不要遍历](#toc-do-not-traverse-when-manual-lookup-will-do)
      * [优化嵌套的访问者对象](#toc-optimizing-nested-visitors)
      * [留意嵌套结构](#toc-being-aware-of-nested-structures)
      * [单元测试](#toc-unit-testing)
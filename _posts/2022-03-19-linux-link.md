---
title: Linux软链接和硬链接
description: Linux软链接和硬链接
date: '2022-03-19'
author: Yoha
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210420224048.jpeg
tags:
    - JavaScript
meta:
  - name: title
    content: Linux软链接和硬链接
  - name: description
    content: Linux软链接和硬链接
  - name: keywords
    content: Linux软链接和硬链接
  - name: author
    content: Yoha
featured: true
---
# Linux软链接和硬链接

## Linux链接概念

Linux链接分两种，一种被称为硬链接（Hard Link），另一种被称为符号链接（Symbolic Link）。默认情况下，ln命令产生硬链接。

> 关于硬链接在之前的[node模块fs](https://yancqs.github.io/blog/2020/05/08/node-fs/)中的`fs.link()`有过介绍。

### 硬链接

硬链接指通过索引节点来进行链接。在Linux的文件系统中，保存在磁盘分区中的文件不管是什么类型都给它分配一个编号，称为**索引节点号(Inode Index)**。在Linux中，多个文件名指向同一索引节点是存在的。一般这种链接就是**硬链接**。硬链接的作用是允许一个文件拥有多个有效路径名，这样用户就可以建立硬链接到重要文件，以防止“误删”的功能。其原因如上所述，因为对应该目录的索引节点有一个以上的链接。只删除一个链接并不影响索引节点本身和其它的链接，只有当最后一个链接被删除后，文件的数据块及目录的链接才会被释放。也就是说，文件真正删除的条件是与之相关的所有硬链接文件均被删除。

### 软链接

另外一种链接称之为符号链接（Symbolic Link），也叫软链接。软链接文件有类似于Windows的快捷方式。它实际上是一个特殊的文件。在符号链接中，文件实际上是一个文本文件，其中包含的有另一文件的位置信息。

## 实操部分

### 创建硬链接

创建一个测试文件`test.txt`

```shell
touch test.txt
```

创建`test.txt`的一个硬链接`test-hard.txt`:

```shell
ln test.txt test-hard.txt
```

从结果中可以看出，硬链接文件`test-hard.txt`与原文件`test.txt`的inode节点相同，均为19205252

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20220319204935.png)

所以修改任何一个文件都会影响另外一个：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20220319205209.png)

### 创建软链接

```shell
ln -s test.txt test-soft.txt
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20220319205531.png)

可以看到软链接的inode与`test.txt`文件并不一致。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20220319205949.png)

### 删除文件

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20220319212109.jpeg)

通过上面的测试可以看出：当删除原始文件`test.txt`后，硬链接`test-hard.txt`不受影响，但是符号链接`test-soft.txt`文件无效。

## 总结

依此您可以做一些相关的测试，可以得到以下全部结论：
1).删除符号(软)链接`test-soft.txt`, 对`test.txt`,`test-hard.txt`无影响；
2).删除硬链接`test-hard.txt`, 对`test.txt`,`test-soft.txt`也无影响；
3).删除原文件`test.txt`, 对硬链接`test-hard.txt`没有影响，导致符号(软)链接`test-soft.txt`失效；
4).同时删除原文件`test.txt`, 硬链接`test-hard.txt`，整个文件会真正的被删除。

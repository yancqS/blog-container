---
title: Node.js中的console.log()输出彩色字体
description: Node.js中的console.log()输出彩色字体
date: '2021-10-26'
author: Yoha
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211026161432.png
tags:
    - 其他
meta:
  - name: title
    content: Node.js中的console.log()输出彩色字体
  - name: description
    content: Node.js中的console.log()输出彩色字体
  - name: keywords
    content: node, console, 彩色文字
  - name: author
    content: Yoha
featured: true
---
# Node.js中的console.log()输出彩色字体

## 前言

最近在写脚本的时候发现在控制台输出的信息不够显眼，比较单调。但是又没必要为了这一个小需求再引入一个第三方库（`chalk`），于是就想着研究一下控制台输出彩色字体的原理是什么。

> 请注意，此篇文章中的颜色仅适用于仿真器（putty、secureCRT、XShell），以及unix终端，不适用于`CMD`(但依然可用于WIN下的仿真器)

## 简介

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211026152046.png)

在终端或仿真器中输入下面的代码，并回车，预览最直接的效果。

```shell
echo  -e "\033[1;31mI ♡  You \e[0m"
```

> 请注意，引号内的`\e`等同于`\033`；`\033`、`\x1b`和`\e`效果是一样，对应键盘左上角Esc键对应的`ASCII码`（8进制）；
>
> 在nodeJS环境下只有`\033`和`\x1b`生效。

```js
console.log('\x1b[1;31;46mI ♡  You \033[0m');
console.log('\033[31;43mI ♡  You \x1b[0m');
```

控制台输出为：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211026152707.png)

通用的控制文本颜色的转义序列格式如下：

```
CSI n1[;n2[;..]]m
```

其中CSI全称为『控制序列引导器』（Control Sequence Introducer/Initiator），也就是上述示例中的`\033[`（其中`\033`是键盘左上角Esc键对应的Ascii码（八进制））；

n1、n2等表示SGR参数（下面会列出一些常用的SGR参数），用于控制颜色、粗体、斜体、闪烁等文本输出格式；m表示转义序列结束。

## 颜色参数

### 常用颜色

```
格式：\033[显示方式;前景色;背景色m

说明：
前景色            背景色           颜色
---------------------------------------
30                40              黑色
31                41              红色
32                42              绿色
33                43              黃色
34                44              蓝色
35                45              紫红色
36                46              青蓝色
37                47              白色

显示方式           意义
-------------------------
0                终端默认设置
1                高亮/加粗显示
4                使用下划线
5                闪烁
7                反白显示
8                不可见

例子：
\033[1;31;40m    <!--1-高亮显示 31-前景色红色  40-背景色黑色-->
\033[0m          <!--采用终端默认设置，即取消颜色设置-->
```

什么是前景色？什么是背景色呢？看下图

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211026153602.webp)

在这可以把前景色理解为字体的颜色。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211026154819.png)

### RGB模式

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211026154843.png)

使用方式：

```
ESC[ … 38;2;<r>;<g>;<b> … m Select RGB foreground color
ESC[ … 48;2;<r>;<g>;<b> … m Select RGB background color
```

> 注意：此处用法`2`代表`RGB`模式，后面3位为RGB的数值；38代表开始设置**前景色**；48代表开始设置**背景色**

举个栗子：

```js
console.log('\033[1;38;2;0;0;255;48;2;255;255;0mI ♡  You \x1b[0m');
```

`1`代表高亮（加粗）；`38;2;0;0;255`表示设置蓝色前景色；`48;2;255;255;0`表示设置黄色背景色；`m`表示结束；

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211026155602.png)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211026155716.png)

### 256模式

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211026155820.png)

使用方式：

```
ESC[ … 38;5;<n> … m Select foreground color
ESC[ … 48;5;<n> … m Select background color
```

> 注意：此处用法`5`代表`256`模式；38代表开始设置**前景色**；48代表开始设置**背景色**

举个栗子：

```js
console.log('\033[1;38;5;226;48;5;201mI ♡  You \x1b[0m');
```

`1`代表高亮（加粗）；`38;5;226`表示设置226号前景色；`48;5;201`表示设置201背景色；`m`表示结束；

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211026160425.png)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211026160527.png)

## SRG控制参数

```
| 0  |   	关闭所有格式，还原为初始状态
| 1  |    粗体/高亮显示 
| 2  |    模糊（※)	
| 3  |    斜体（※） 
| 4  |    下划线（单线）  
| 5  |    闪烁（慢） 
| 6  |    闪烁（快）（※）  
| 7  |    交换背景色与前景色   
| 8  |    隐藏（伸手不见五指，啥也看不见）（※）
```

> 1. 其中含有（※）标注的编码表示不是所有的终端仿真器都支持，只有少数仿真器支持。
> 2. 多个SGR参数可以组合使用，例如：echo -e "\x1b[31;4mRed Underline Text\e[0m"输出红色下划线字体“Red Underline Text”。

举个栗子：

```js
console.log('\033[1;3;38;5;226;48;5;201mI ♡  You \x1b[0m');
console.log('\033[1;3;7;38;5;226;48;5;201mI ♡  You \x1b[0m');
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211026161432.png)

## 参考文章

- [控制台输出颜色控制](https://cloud.tencent.com/developer/article/1142372)
- [使Node.js中的console.log()输出彩色字体](https://www.jianshu.com/p/cca3e72c3ba7)
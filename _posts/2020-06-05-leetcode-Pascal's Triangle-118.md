---
title: 杨辉三角
date: "2020-06-05"
author: Yoha
tags:
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017151542.jpeg
meta:
  - name: title
    content: 杨辉三角
  - name: description
    content: 杨辉三角
  - name: keywords
    content: 杨辉三角, leetcode, Leetcode
  - name: author
    content: Yoha
featured: true
---
# 118.杨辉三角

## 描述

给定一个非负整数 numRows，生成杨辉三角的前 numRows 行。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017185200.gif)

在杨辉三角中，每个数是它左上方和右上方的数的和。

## 示例

- 示例1

  ![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017185218.png)

## 代码及思路

### 思路

仔细观察一下，可以看出来每个数组的第一位和最后一位都为1，并且大数组的第n个元素数组长度为n。所以假设大数组为arr, i 为第i个元素数组，会有arr[i][0] = 1 和 arr[i][i] = 1;这样第i个元素数组的首元素和最后一个元素就都值啦。中间元素的值可以写一个循环arr[i][j] = arr[i-1][j-1] + arr[i-1][j].

### 代码

```javascript
/**
 * @param {number} numRows
 * @return {number[][]}
 */
let generate = function(numRows) {
  let res = [];
  for(let i = 0; i < numRows; i++) {
    res[i] = [];
    res[i][0] = 1;
    res[i][i] = 1;
    for(let j = 1; j < i; j++) {
      res[i][j] = res[i-1][j-1] + res[i-1][j];
    }
  }
  return res;
};
```


<comment />
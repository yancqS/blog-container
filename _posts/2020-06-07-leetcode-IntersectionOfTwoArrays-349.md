---
title: 两个数组的交集
date: "2020-06-07"
author: Yoha
tags:
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017151542.jpeg
meta:
  - name: title
    content: 两个数组的交集
  - name: description
    content: 两个数组的交集
  - name: keywords
    content: 两个数组的交集, leetcode, Leetcode
  - name: author
    content: Yoha
featured: true
---
# 349.两个数组的交集

## 描述

给定两个数组，编写一个函数来计算它们的交集。

## 示例

- 示例1

  输入：nums1 = [1,2,2,1], nums2 = [2,2]

  输出：[2]

- 示例2

  输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]

  输出：[9,4]

## 代码及思路

### 思路

对这两个数组中的任意一个数组进行遍历，然后判断另一个数组中是有这个值，如果有就把这个值添加到到结果集合中(主要考虑到集合的元素不重复)。遍历结束后，将集合转为数组返回即可。

### 代码

```javascrit
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
let intersection = function(nums1, nums2) {
  let res = new Set();
  for(let item of nums1) {
    if(nums2.includes(item)) {
      res.add(item);
    }
  }
  return Array.from(res);
};
```


<comment />
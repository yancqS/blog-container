---
title: 0～n-1中缺失的数字
date: "2020-06-12"
author: Yoha
tags:
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017151542.jpeg
meta:
  - name: title
    content: 0～n-1中缺失的数字
  - name: description
    content: 0～n-1中缺失的数字
  - name: keywords
    content: 0～n-1中缺失的数字, leetcode, Leetcode
  - name: author
    content: Yoha
featured: true
---
# 0～n-1中缺失的数字

## 描述

一个长度为n-1的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围0～n-1之内。在范围0～n-1内的n个数字中有且只有一个数字不在该数组中，请找出这个数字。

## 示例

- 示例 1:

    输入: [0,1,3]

    输出: 2

- 示例 2:

    输入: [0,1,2,3,4,5,6,7,9]

    输出: 8

## 代码及思路

### 思路

题目中的关键信息：长度为n-1， 但有n个数字(0~n-1), 数字递增， 有且只有一个数字不在该数组中。

通过这几个关键信息我们可以得出的结论是:只能按照间隔为1进行递增，如果后一个数字减去前一个数字大于1，那说明这两个数字之间的数即为缺失的数字。

但这个是一般情况，考虑特殊情况: [1,2,3]和[0,1,2],缺少的数字分别是是0和3，但是后一个数字减去前一个数字都为1。这种情况要单独处理一下。

还有一种情况(最开始未考虑导致未通过): 如果数组的长度为1.[0] 或者 [1],也要单独考虑。

### 代码

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var missingNumber = function(nums) {
    let arr = [];
    if(nums.length == 1) return nums[0] == 0 ? 1 : 0;
    for(let i = 1; i<nums.length; i++) {
        arr.push(nums[i] - nums[i - 1]);
    }
    let index = arr.findIndex(item => item > 1);
    if(index == -1){
        return nums.includes(nums.length) ? 0 : nums.length;
    }
    return nums[index] + 1;
};
```


<comment />
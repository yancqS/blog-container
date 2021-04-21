---
title: 回文数
date: "2020-06-01"
author: Yoha
tags:
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017191711.gif
meta:
  - name: title
    content: 回文数
  - name: description
    content: 回文数
  - name: keywords
    content: 回文数, leetcode, Leetcode
  - name: author
    content: Yoha
featured: true
---
# leetcode-9.回文数

## 描述

判断一个整数是否是回文数。回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。

## 示例

- 示例1

  输入：121

  输出： true

- 示例2

  输入: -121

  输出: false

  解释: 从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。

- 示例 3:

  输入: 10

  输出: false
  
  解释: 从右向左读, 为 01 。因此它不是一个回文数。

## 题解及分析思路

>*分析思路~~也许~~（肯定）不是最优，只是想法。*

### 思路

输入是一个整数,如果这个整数小于0，那么可定不是回文数。返回false。

如果这个正是整数大于0，可以把这个整数转为字符串数组：(num+'').split(""),例如12321 => ['1', '2', '3', '2', '1'],然后利用两个变量left和right，不断去判断第n个和倒数第n个是否相等即可。

### 代码

```javascript
/**
  * @param {number} x
  * @return {boolean}
  */
var isPalindrome = function(x) {
    if(typeof x !== "number")return false;
        let arr = (x+"").split("");
        let length = arr.length;
        let left = 0;
        let right = length -1;
        while(left < right){
            if(arr[left] === arr[right]){
                left++;
                right--;
            }else{
                return false;
            }
        }
        return true;
};
```


<comment />
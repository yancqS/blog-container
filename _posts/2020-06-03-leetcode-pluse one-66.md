---
title: 加一
date: "2020-06-03"
author: Yoha
tags:
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017151542.jpeg
meta:
  - name: title
    content: 加一
  - name: description
    content: 加一
  - name: keywords
    content: 加一, leetcode, Leetcode
  - name: author
    content: Yoha
featured: true
---
# 66.加一

## 描述

给定一个由整数组成的非空数组所表示的非负整数，在该数的基础上加一。

最高位数字存放在数组的首位， 数组中每个元素只存储单个数字。

你可以假设除了整数 0 之外，这个整数不会以零开头。

## 示例

- 示例1
  
  输入：[1,2,3]

  输出：[1,2,4]

- 示例2

  输入：[4,3,2,1]

  输出：[4,3,2,2]

## 代码及其思路

### 思路

看到这个题目，第一反应思路：把数组转为数字，然后加1，然后再转为数组。所以有了以下代码：

```javascript
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
    let sum = 0;
    for(let i = 0; i < digits.length; i++){
        sum += digits[i] * Math.pow(10, digits.length - i - 1);
    }
    let res = sum + 1;
    let result = (res + '').split('').map(item => +item);
    return result;
};
```

但是，没有通过，因为在这个数组[6,1,4,5,3,9,0,1,9,5,1,8,6,7,0,5,5,4,3]下报错啦。0.0这个数组转为数字肯定超出js最大数字的范围。

于是，要想着操作数组中的数字。比如[1,2] => [1,3];[9] => [1, 0];[1,9] => [2,0];写个循环，由后向前循环，如果最后一位小于9，直接加1，返回结果，结束循环。如果最后一位为9，则把这一位置为0，它的前一位加1，如果循环完毕，其中每一位都是9，则把它们全部置为0，手动在第一位加个1。

### 代码

```javascript
/**
     * @param {number[]} digits
     * @return {number[]}
     */
    let plusOne = function(digits) {
        let len = digits.length;
        for(let i = len - 1; i >= 0; i--) {
          if(digits[i] < 9) {
            digits[i]++;
            return digits;
          }
          digits[i] = 0;
        }
        return [1, ...digits];
    };
```

---
title: pow(x,n)
date: "2020-06-02"
author: Yoha
tags:
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017190350.jpg
meta:
  - name: title
    content: pow(x,n)
  - name: description
    content: pow(x,n)
  - name: keywords
    content: pow(x,n), leetcode, Leetcode
  - name: author
    content: Yoha
featured: true
---
# pow(x,n)

## 描述

实现 pow(x, n) ，即计算 x 的 n 次幂函数

## 示例

- 示例 1:

    输入: 2.00000, 10

    输出: 1024.00000

- 示例2
    
    输入: 2.10000, 3

    输出: 9.26100

- 示例 3:

    输入: 2.00000, -2

    输出: 0.25000

## 题解及思路

### 思路

其实第一反应是这个Math.pow(x,n),的确可以，但是....

另一个思路写个循环不断的相乘，理论上可以，但是超出时间限制

另一个想法：pow(x,n),如果n为偶数，那么pow(x,n) = pow(x, n/2)\*pow(x, n/2),这个时候无论n是否为正数，这么算都是可以的。比如pow(2,4)和pow(2,-4);如果n为奇数,且n为正数 pow(x,n) = pow(x, parseInt(n/2))\*pow(x, parseInt(n/2))\*x,如果n为负数pow(x,n) = pow(x, parseInt(n/2))\*pow(x, parseInt(n/2))\/x;这个就是递归,递归的停止条件是当n等于0的时候返回1.

### 代码

```javascript
/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
let myPow = function(x, n) {
    if(typeof x !== 'number' || typeof n !== 'number') return NaN;
    if(n === 0) return 1;
    let res;
    let half = myPow(x, parseInt(n/2));
    if(n % 2 == 0) {
        //偶数
        // res = myPow(x, n/2) * myPow(x, n/2);由于这两个相乘的数是相等的，没必要调用两次函数。
        res = half * half;
    } else if(n > 0) {
        // res = myPow(x, n/2) * myPow(x, n/2) * x;
        res = half * half * x;
    } else {
        // res = myPow(x, n/2) * myPow(x, n/2) / x;
        res = half * half / x;
    }
    return res;
}
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017190350.jpg)


<comment />
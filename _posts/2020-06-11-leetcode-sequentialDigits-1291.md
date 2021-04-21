---
title: 顺次数
date: "2020-06-11"
author: Yoha
tags:
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017151542.jpeg
meta:
  - name: title
    content: 顺次数
  - name: description
    content: 顺次数
  - name: keywords
    content: 顺次数, leetcode, Leetcode
  - name: author
    content: Yoha
featured: true
---
# 1291.顺次数

## 描述

我们定义「顺次数」为：每一位上的数字都比前一位上的数字大 1 的整数。

请你返回由 [low, high] 范围内所有顺次数组成的 有序 列表（从小到大排序）。

## 示例

- 示例 1：

    输出：low = 100, high = 300

    输出：[123,234]

- 示例 2：

    输出：low = 1000, high = 13000

    输出：[1234,2345,3456,4567,5678,6789,12345]

- 提示：

    - 10 <= low <= high <= 10^9

## 代码及思路

### 思路

我的这个思路比较暴力，不是很好。首先想的是把这两个数字转为字符串，然后可以知道是几位数。小数的最高位加上其「长度减一」，如果大于或等于10，说明在这个长度下不会存在连续数。所以长度应该加一，最高为置为1。如果小于10，那么就循环从最高位加到最低位，即为一个结果。

举个栗子：low=100, high=1000
那么low_len = 3, high_len = 4; 100的最高位是1， 1 + low_len = 4 < 10, 所以存在连续数。1 * Math.pow(10, low_len - 1 - i) + (1 + i) * Math.pow(10, low_len - 1 - i) + (1 + i) * Math.pow(10, low_len - 1 - i) = 123.然后最高为加1，循环继续。

如果到了某个数加1大于10，首先first置为1，然后判断low_len 是不是小于 high_len，如果是low_len加1。

跳出循环的条件是low_len 不再小于 high_len

### 代码

```javascript
/**
 * @param {number} low
 * @param {number} high
 * @return {number[]}
 */
var sequentialDigits = function(low, high) {
    let low_len = (low + '').length;
    let high_len = (high + '').length;
    let first = parseInt(low / Math.pow(10, low_len - 1));
    let res = [];
    let num = 0;
    while(true) {
        if(first + low_len - 1 < 10) {
            num = 0;
            for(let i = 0; i < low_len; i++) {
                num += (first + i) * Math.pow(10, low_len - 1 -i);
            }
            if(num >= low && num <= high) {
                res.push(num);
            }
            first++;
        } else {
            first = 1;
            if(low_len < high_len) {
                low_len++;
            } else {
                break;
            }
        }
    }
    return res;
};
```

---
title: 宝石与石头
date: "2020-06-10"
author: Yoha
tags:
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017151542.jpeg
meta:
  - name: title
    content: 宝石与石头
  - name: description
    content: 宝石与石头
  - name: keywords
    content: 宝石与石头, leetcode, Leetcode
  - name: author
    content: Yoha
featured: true
---
# 771. 宝石与石头

## 描述

给定字符串J代表石头中宝石的类型，和字符串S代表你拥有的石头。 S中每个字符代表了一种你拥有的石头的类型，你想知道你拥有的石头中有多少是宝石。

J中的字母不重复，J和S中的所有字符都是字母。字母区分大小写，因此"a"和"A"是不同类型的石头。

## 示例

- 示例 1:

    输入: J = "aA", S = "aAAbbbb"

    输出: 3

- 示例 2:

    输入: J = "z", S = "ZZ"

    输出: 0

- 注意:
    - S 和 J 最多含有50个字母。
    - J 中的字符不重复。

## 代码及思路

### 思路

想着是把宝石J和石头S字符串转为数组。然后利用filter方法过滤出石头数组中包含的宝石，取其长度。

### 代码

```javascript
/**
 * @param {string} J
 * @param {string} S
 * @return {number}
 */
var numJewelsInStones = function(J, S) {
    let jArr = J.split('');
    let sArr = S.split('');
    let res = 0;
    for(let i = 0; i < jArr.length; i++) {
        res += sArr.filter(item => item == jArr[i]).length
    }
    return res;
};
```

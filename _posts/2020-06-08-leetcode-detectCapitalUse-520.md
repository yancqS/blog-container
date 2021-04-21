---
title: 检测大写字母
date: "2020-06-08"
author: Yoha
tags:
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017151542.jpeg
meta:
  - name: title
    content: 检测大写字母
  - name: description
    content: 检测大写字母
  - name: keywords
    content: 检测大写字母, leetcode, Leetcode
  - name: author
    content: Yoha
featured: true
---
# 520. 检测大写字母

## 描述

给定一个单词，你需要判断单词的大写使用是否正确。

我们定义，在以下情况时，单词的大写用法是正确的：

  - 全部字母都是大写，比如"USA"。
  - 单词中所有字母都不是大写，比如"leetcode"。
  - 如果单词不只含有一个字母，只有首字母大写， 比如 "Google"。

否则，我们定义这个单词没有正确使用大写字母。

输入是由大写和小写拉丁字母组成的非空单词

## 示例

- 示例1

  输入: "USA"
  
  输出: True

- 示例2

  输入: "FlaG"

  输出: False

## 代码及思路

### 思路

如果是全部大写那么 str.toUpperCase() === str;

如果是全部小写那么 str.toLowerCase() === str;

如果str[0].toUpperCase() + str.slice(1).toLowerCase() === str,说明首字母大写，其他小写。

否则 返回false。

### 代码

```javascript
/**
 * @param {string} word
 * @return {boolean}
 */
let detectCapitalUse = function(word) {
  if(word.toUpperCase() === word) return true;
  if(word.toLowerCase() === word) return true;
  if(word[0].toUpperCase() + word.slice(1).toLowerCase() === word) return true;
  return false;
};
```

再附一个大佬的正则匹配方法：

```javascript
let detectCapitalUse = function(word) {
  let reg1 = /^[A-Z]*$/;
  let reg2 = /^[A-Z][a-z]*$/;
  let reg3 = /^[a-z]*$/;
  return reg1.test(word) || reg2.test(word) || reg3.test(word);
};
```

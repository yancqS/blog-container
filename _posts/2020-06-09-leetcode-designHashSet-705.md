---
title: 设计哈希集合
date: "2020-06-09"
author: Yoha
tags:
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017151542.jpeg
meta:
  - name: title
    content: 设计哈希集合
  - name: description
    content: 设计哈希集合
  - name: keywords
    content: 设计哈希集合, leetcode, Leetcode
  - name: author
    content: Yoha
featured: true
---
# 705.设计哈希集合

## 描述

不使用任何内建的哈希表库设计一个哈希集合

具体地说，你的设计应该包含以下的功能

- add(value)：向哈希集合中插入一个值。
- contains(value) ：返回哈希集合中是否存在这个值。
- remove(value)：将给定值从哈希集合中删除。如果哈希集合中没有这个值，什么也不做。

注意：

- 所有的值都在 [0, 1000000]的范围内。
- 操作的总数目在[1, 10000]范围内。
- 不要使用内建的哈希集合库。

## 示例

```javascript
MyHashSet hashSet = new MyHashSet();
hashSet.add(1);
hashSet.add(2);
hashSet.contains(1);// 返回 true
hashSet.contains(3);// 返回 false (未找到)
hashSet.add(2);
hashSet.contains(2);// 返回 true
hashSet.remove(2);
hashSet.contains(2);// 返回  false (已经被删除)
```

## 代码及思路

### 思路

利用数组的push,includes,splice(index, 1)来实现。

### 代码

```javascript
class hashSet {
    constructor() {
        this.set = [];
    }
    add(item) {
        this.set.push(item);
    }
    contains(item) {
        return this.set.includes(item);
    }
    remove(item) {
        let index = this.set.findIndex(num => num === item);
        if(index !== -1) this.set.splice(index, 1);
    }
}
```


<comment />
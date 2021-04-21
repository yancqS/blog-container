---
title: 多数元素
date: "2020-06-06"
author: Yoha
tags:
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017151542.jpeg
meta:
  - name: title
    content: 多数元素
  - name: description
    content: 多数元素
  - name: keywords
    content: 多数元素, leetcode, Leetcode
  - name: author
    content: Yoha
featured: true
---
# 169.多数元素

## 描述

给定一个大小为 n 的数组，找到其中的多数元素。多数元素是指在数组中出现次数大于 ⌊ n/2 ⌋ 的元素。

你可以假设数组是非空的，并且给定的数组总是存在多数元素。

##　示例

  - 示例1

    输入: [3,2,3]

    输出: 3

  - 示例2

    输入: [2,2,1,1,1,2,2]

    输出: 2

## 代码及思路

### 思路

遍历数组，利用map，记录相同数字出现的次数。如果某一个元素出现的次数大于n/2,则直接返回这个元素。

### 代码

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
let majorityElement = function(nums) {
  let map = new Map();
  for(let item of nums) {
    if(map.has(item)) {
      map.set(item, map.get(item) + 1);
    } else {
      map.set(item, 1);
    }
    if(map.get(item) > nums.length / 2) {
      return item;
    }
  }
};
```

另外，还看到一个投票求解(专业术语叫摩尔投票法)：

```javascript
var majorityElement = function(nums) {
        let count = 0;
        let candidate = null;

       nums.forEach(function(num){
            if (count == 0) {
                candidate = num;
            }
            count += (num == candidate) ? 1 : -1;
        });

        return candidate;
}
```

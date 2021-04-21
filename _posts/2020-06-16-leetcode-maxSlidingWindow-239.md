---
title: 239.滑动窗口最大值
date: "2020-06-16"
author: Yoha
tags:
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017151542.jpeg
meta:
  - name: title
    content: 滑动窗口最大值
  - name: description
    content: 滑动窗口最大值
  - name: keywords
    content: 滑动窗口最大值
  - name: author
    content: Yoha
featured: true
---
# 239.滑动窗口最大值

## 描述

给定一个数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。

返回滑动窗口中的最大值。

## 示例

- 示例:

    输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3

    输出: [3,3,5,5,6,7]

- 解释:

滑动窗口的位置                 最大值

\---------------              ----------

[1  3  -1] -3  5  3  6  7    =>   3

 1 [3  -1  -3] 5  3  6  7    =>   3

 1  3 [-1  -3  5] 3  6  7    =>   5

 1  3  -1 [-3  5  3] 6  7    =>   5

 1  3  -1  -3 [5  3  6] 7    =>   6

 1  3  -1  -3  5 [3  6  7]   =>   7

## 代码及思路

### 思路

其实开始感觉这个题目没啥难度，不知道为啥是困难。(年轻啊0.0)。

说一下最开始的思路：主要利用数组的slice函数来不断获取窗口内的数组，然后利用Math.max.apply(null, windowArr)获取窗口数组的最大值。然后考率一下窗口宽度大于数组长度的情况，即获取整个数组的最大值。

然后就有了下面的代码：

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function (nums, k) {
    let len = nums.length;
    let res = [];
    if (k >= len) return [Math.max.apply(null, nums)];
    for (let i = 0; i <= len - k; i++) {
        res.push(Math.max.apply(null, nums.slice(i, i + k)));
    }
    return res;
};
```

可悲的是：超时啦。(是因为一个巨长的数组引起的)

然后改进了一下，想着既然是因为数组的长度引起的问题，那么就不维护一个那么长的数组啦，只要维护窗口宽度k长度的数组。毕竟是要取窗口宽度内的数组最大值。

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
    if(nums.length === 1) return nums;
    let arr = [], res = [];
    for(let i = 0; i < nums.length; i++) {
        arr.push(nums[i]);
        if(i >= k - 1) {
            res.push(Math.max(...arr));
            arr.shift();
        }
    }
    return res;
};
```

这次确实通过啦，但是那个时间**7036ms**。

遂去研究了一下大佬们的代码(如下)

### 代码

[参考代码链接](https://leetcode-cn.com/problems/sliding-window-maximum/solution/shuang-duan-dui-lie-javascript-by-licolico-6/)

自己写一个由大到小的有序队列queue，队列里0的位置一直是最大的元素，里面有3个方法:

- push(val)：先将队列里面小于val的数都删掉，然后将val插入到队列;
- pop(val)：用于删除窗口外的最大值(比如你在找3,4,5三个位置的最大值,但是2位置的最大值还在队列里面,而且比它们都大,但是它已经过时了,要把它删掉,不能影响后续的比较),如果最大值还在窗口内那么它不会删除任何值
- max()：返回队列的第一个元素，也就是最大值

***双端队列：***

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
    class Queue {
        constructor() {
            this.queue = [];
        }
        push(val) {
            while(this.queue.length && this.queue[this.queue.length - 1] < val) {
                this.queue.pop();
            }
            this.queue.push(val);
        }
        pop(val) {
            if(this.queue[0] === val) this.queue.shift();
        }
        max() {
            return this.queue[0];
        }
    }

    let len = nums.length;
    let queue = new Queue();
    let res = [];
    if(k === 0) return [];
    for(let i = 0; i < k - 1; i ++) {
        queue.push(nums[i]);
    }
    for(let i = k - 1; i < len; i ++) {
        queue.push(nums[i]);
        res.push(queue.max());
        queue.pop(nums[i - k + 1]);
    }
    return res;
};
```

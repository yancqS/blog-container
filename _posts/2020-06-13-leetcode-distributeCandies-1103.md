---
title: 1103.分糖果II
date: "2020-06-13"
author: Yoha
tags:
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017151542.jpeg
meta:
  - name: title
    content: 分糖果II
  - name: description
    content: 分糖果II
  - name: keywords
    content: 分糖果, leetcode, Leetcode
  - name: author
    content: Yoha
featured: true
---
# 1103.分糖果II

## 描述

排排坐，分糖果。

我们买了一些糖果 candies，打算把它们分给排好队的 n = num_people 个小朋友。

给第一个小朋友 1 颗糖果，第二个小朋友 2 颗，依此类推，直到给最后一个小朋友 n 颗糖果。

然后，我们再回到队伍的起点，给第一个小朋友 n + 1 颗糖果，第二个小朋友 n + 2 颗，依此类推，直到给最后一个小朋友 2 * n 颗糖果。

重复上述过程（每次都比上一次多给出一颗糖果，当到达队伍终点后再次从队伍起点开始），直到我们分完所有的糖果。注意，就算我们手中的剩下糖果数不够（不比前一次发出的糖果多），这些糖果也会全部发给当前的小朋友。

返回一个长度为 num_people、元素之和为 candies 的数组，以表示糖果的最终分发情况（即 ans[i] 表示第 i 个小朋友分到的糖果数）。

## 示例

- 示例 1：

    输入：candies = 7, num_people = 4

    输出：[1,2,3,1]

  - 解释：
  
    第一次，ans[0] += 1，数组变为 [1,0,0,0]。

    第二次，ans[1] += 2，数组变为 [1,2,0,0]。
    
    第三次，ans[2] += 3，数组变为 [1,2,3,0]。

    第四次，ans[3] += 1（因为此时只剩下 1 颗糖果），最终数组变为 [1,2,3,1]。

- 示例 2：

    输入：candies = 10, num_people = 3

    输出：[5,2,3]

  - 解释：

    第一次，ans[0] += 1，数组变为 [1,0,0]。

    第二次，ans[1] += 2，数组变为 [1,2,0]。

    第三次，ans[2] += 3，数组变为 [1,2,3]。

    第四次，ans[0] += 4，最终数组变为 [5,2,3]。

## 代码及思路

### 思路

分给小朋友的糖果数量是以1递增的，并且是不断循环的，直到糖果分完。每次分的糖果可以通过一个全局变量j来控制，并且每次循环要判断剩余的糖果是否大于0，大于0则进行分配糖果。如果分发玩一轮后还有剩余的糖果，则再次分发剩余的糖果。

### 代码

```javascript
let j = 0;
let arr = [];
var distributeCandies = function (candies, num_people) {
  while (candies > 0) {
    for (let i = 0; i < num_people; i++) {
      arr[i] = arr[i] ? arr[i] : 0
      if (candies > 0) {
        j++;
        arr[i] = candies - j > 0 ? arr[i] + j : arr[i] + candies
        candies -= j;
      }
    }
  }
  return arr;
};
```

借鉴一个大佬的代码：

```javascript
/**
 * @param {number} candies
 * @param {number} num_people
 * @return {number[]}
 */
let distributeCandies = function(candies, num_people) {
    let result = new Array(num_people).fill(0);
    let i = 1;
    while(candies > 0){
        var temp = (i - 1 + num_people) % num_people;
        result[temp] =  result[temp] + (candies > i ? i : candies)
        candies -= i++;
    }
    return result;
};
```

在这里说明一个规律: 一个连续变化的值对n取余，其值会在0~n-1范围内周期性的变化。

举个栗子：

```javascript
11%3= 2
10%3= 1
9%3= 0
8%3= 2
7%3= 1
6%3= 0
5%3= 2
4%3= 1
3%3= 0
2%3= 2
1%3= 1
0%3= 0
```


<comment />
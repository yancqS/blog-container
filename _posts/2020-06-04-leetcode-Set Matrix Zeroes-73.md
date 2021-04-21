---
title: 矩阵置零
date: "2020-06-04"
author: Yoha
tags:
    - Leetcode
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017151542.jpeg
meta:
  - name: title
    content: 矩阵置零
  - name: description
    content: 矩阵置零
  - name: keywords
    content: 矩阵置零, leetcode, Leetcode
  - name: author
    content: Yoha
featured: true
---
# 73.矩阵置零

## 描述

给定一个 m x n 的矩阵，如果一个元素为 0，则将其所在行和列的所有元素都设为 0。请使用原地算法。

## 示例

- 示例1

输入: 

[

  [1,1,1],

  [1,0,1],

  [1,1,1]

]

输出: 

[

  [1,0,1],

  [0,0,0],

  [1,0,1]

]

- 示例2

输入: 

[

  [0,1,2,0],

  [3,4,5,2],

  [1,3,1,5]

]

输出:

[

  [0,0,0,0],

  [0,4,5,0],

  [0,3,1,0]

]

## 思路及代码

### 思路

暂且不管题目中要求原地算法。不管白猫还是黑猫。能抓住老鼠就是好猫。于是我就大胆的开始想方法啦。

既然要把0所在的行和列都要置为0，首先要把出现0的位置记录下来。然后就有下面的代码：

```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
let setZeroes = function(matrix) {
        let rec = [];
        for(let i = 0;i<matrix.length;i++){
            for(let j = 0;j<matrix[i].length;j++){
                if(matrix[i][j] === 0){
                    rec.push(i,j);
                }
            }
        }
        //这个函数是去执行置0操作的。rec数组存放出现0的位置
        zero(matrix,rec)
    };
```

记录了0出现的位置，比如rec = [1,1,2,2],就要把第一行和第一列置为0，把第二行和第二列置为0.对rec进行循环时间隔为2.

```javascript
function zero(matrix,rec){
        let len = rec.length;
        for(let i = 0;i<len-1;i+=2){
            let m = rec[i],n=rec[i+1];
            for(let j = 0;j<matrix[0].length;j++){
                matrix[m][j] = 0;
            }
            for(let k = 0;k<matrix.length;k++){
                matrix[k][n] = 0;
            }
        }
    }
```

### 代码

```javascript
/**
  * @param {number[][]} matrix
  * @return {void} Do not return anything, modify matrix in-place instead.
  */
    function zero(matrix,rec){
        let len = rec.length;
        for(let i = 0;i<len-1;i+=2){
            let m = rec[i],n=rec[i+1];
            for(let j = 0;j<matrix[0].length;j++){
                matrix[m][j] = 0;
            }
            for(let k = 0;k<matrix.length;k++){
                matrix[k][n] = 0;
            }
        }
    }
    let setZeroes = function(matrix) {
        let rec = [];
        for(let i = 0;i<matrix.length;i++){
            for(let j = 0;j<matrix[i].length;j++){
                if(matrix[i][j] === 0){
                    rec.push(i,j);
                }
            }
        }
        zero(matrix,rec)
    };
```

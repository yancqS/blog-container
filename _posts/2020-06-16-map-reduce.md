---  
title: JS原生函数实现之数组实例方法map/reduce
date: "2020-06-16"
author: Yoha
tags:
    - 前端开发
    - JavaScript
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017150634.png
meta:
  - name: title
    content: JS原生函数实现之数组实例方法map/reduce
  - name: description
    content: JS原生函数实现之数组实例方法map/reduce
  - name: keywords
    content: map, reduce
  - name: author
    content: Yoha
featured: true
---
# JS原生函数实现之数组实例方法map/reduce

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017150312.png)

```javascript
Array.prototype.map2 = function (fn, thisVal) {
  if (typeof fn != 'function') {
    throw new Error(fn + 'should be function');
  }
  if (this.length == 0) {
    return [];
  }
  return this.reduce((arr, curVal, curIndex) => {
    arr.push(fn.call(thisVal, curVal, curIndex, this));
    return arr;
  }, [])
};
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017150326.png)

```javascript
Array.prototype.reduce2 = function (callback, initData) {
  let initVal = initData ? initData : initData == 0 ? initData : this[0];
  for (let i = initData ? 0 : initData == 0 ? 0 : 1; i < this.length; i++) {
    initVal = callback(initVal, this[i], i, this)
  }
  return initVal;
}
```


<comment />
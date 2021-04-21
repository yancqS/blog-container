---
title: JS原生函数模拟实现new和instanceof及函数柯里化
date: "2020-06-20"
author: Yoha
tags:
    - 前端开发
    - JavaScript
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017105512.jpeg
meta:
  - name: title
    content: JS原生函数模拟实现new和instanceof及函数柯里化
  - name: description
    content: JS原生函数模拟实现new和instanceof及函数柯里化
  - name: keywords
    content: JS原生函数模拟实现new和instanceof, 函数柯里化
  - name: author
    content: Yoha
featured: true
---
# JS原生函数模拟实现new和instanceof

## new的模拟实现

首先要知道new操作符，在new 一个构造函数时，发生了什么：

- 创建一个新对象
- 将这个新对象的隐式原型(\_\_proto\_\_)指向构造函数的原型(prototype)
- 将构造函数的属性和方法添加到这个新对象中
- 返回这个新对象

> ps:如果构造函数返回的是对象或者是函数则在new运算符调用这个构造函数时返回的是对象或者函数。

代码实现如下：

```javascript
function _new(...args) {
  let constructor = args[0];
  let obj = Object.create(constructor.prototype);//把前两步完成啦
  let res = constructor.call(obj, ...args.slcie(1));//完成第三步
  if((typeof res === 'object' || typeof res === 'function') &&　res !== null) {
    return res;//第四步
  } else {
    return obj;//第四步
  }
}
```

## instanceof模拟实现

L instanceof R

原理: L的\_\_proto\_\_是不是等于R的prototype，如果不等于就再向上L.\_\_proto\_\_.\_\_proto\_\_,一直找到要么等于R.prototype,要么\_\_proto\_\_指向null。

代码实现如下：

```javascript
function _instanceof (L, R) {
  let O = R.prototype;
  L = L.__proto__;
  while(true) {
    if(L === null) {
      return false;
    }
    if(O === L) {
      return true;
    }

    L = L.__proto__;
  }
}
```

## 函数柯里化

>在计算机科学中，柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术.

```javascript
function curry(fn) {
  let len = fn.length;
  return function curryfn() {
    let arg = Array.from(aruments);
    if(arg.length < len) {
      return function() {
        return curryfn.apply(this, arg.concat(...aruments)));
      }
    } else {
      fn.apply(this, arg);
    }
  }
}
function sum(a, b, c, d) {
  console.log(a + b + c + d);
}
let currySum = curry(sum);
currySum(1,2)(3)(4)//应该打印 10
```

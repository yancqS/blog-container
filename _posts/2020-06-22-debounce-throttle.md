---
title: 函数防抖和节流、以及Promise.all实现
date: "2020-06-22"
author: Yoha
tags:
    - 前端开发
    - JavaScript
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017105512.jpeg
meta:
  - name: title
    content: 函数防抖和节流、以及Promise.all实现
  - name: description
    content: 函数防抖和节流、以及Promise.all实现
  - name: keywords
    content: 防抖, 节流, Promise.all
  - name: author
    content: Yoha
featured: true
---
# 函数防抖和节流、以及Promise.all实现

## 防抖

>所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。

```javascript
function debounce(fn, time) {
  let _t;
  return function () {
    clearTimeout(_t);
    _t = setTimeout(() => {
      fn();
    }, time)
  }
}
function handleresize() {
  console.log(1);
}

window.onresize = debounce(handleresize, 5000);
```

## 节流

>所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。节流会稀释函数的执行频率。

```javascript
function throttle(fn, delay) {
  let currentTime = new Date().getTime();
  return function () {
    if (new Date().getTime() - currentTime > delay) {
      fn();
      currentTime = new Date().getTime();
    }
  }
}
function handleresize() {
  console.log(1);
}
window.onresize = throttle(handleresize, 5000);
```

## Promise.all、Promise.race模拟实现

### Promise.all

```javascript
function PromiseAll(promiseArr) {
  if(!Array.isArray(promiseArr)) throw new Error('The arguments must be a Array');
  let len = promiseArr.length, value_arr = [], count = 0;
  return new Promise((resolve, reject) => {
    for(let i = 0; i < len; i++) {
      Promise.resolve(promiseArr[i]).then(value => {
        value_arr[i] = value;
        count++;
        if(count == len) {
          resolve(value_arr);
        }
      }).catch(reason => {
        reject(reason);
      })
    }
  })
}

let p1 = new Promise(1);
let p2 = new Promise(2);
let p3 = new Promise(3);

PromiseAll([p1,p2,p3]).then(valArr => {
  console.log(valArr);
}).catch(reason => {
  console.log(reason);
})
```

### Promise.race

```javascript
function PromiseRace(promiseArr) {
  if(!Array.isArray(promiseArr)) throw new Error("The arguments must be a Array");
  let len = promiseArr.length;
  return new Promise((resolve, reject) => {
    for(let i = 0; i < len; i++) {
      Promise.resolve(promiseArr[i]).then(value => {
        resolve(value);
      }).catch(reason => {
        reject(reason);
      })
    }
  })
}

let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('5秒');
  }, 5000);
})

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('3秒');
  }, 3000);
})

PromiseRace([p1,p2]).then(value => {
  console.log(value);
}).catch(reason => {
  console.log(reason);
})
```

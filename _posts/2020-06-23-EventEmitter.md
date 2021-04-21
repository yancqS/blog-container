---
title: 事件触发器EventEmitter
date: "2020-06-23"
author: Yoha
tags:
    - 前端开发
    - JavaScript
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017114430.jpg
meta:
  - name: title
    content: 事件触发器EventEmitter
  - name: description
    content: 事件触发器EventEmitter
  - name: keywords
    content: 事件触发器, EventEmitter
  - name: author
    content: Yoha
featured: true
---
# 事件触发器EventEmitter

## 发布订阅模式：

```javascript
class EventEmitter {
  constructor() {
    this._event = []
  }

  on(eventName, fn) {
    let callback = this._event[eventName] || [];
    callback.push(fn);
    this._event[eventName] = callback;
    return this;
  }

  emit(...args) {
    let eventName = args[0];
    let params = args.slice(1);
    let event = this._event[eventName];
    event.forEach(fn => fn.apply(this, params));
    return this;
  }

  off(eventName, fn) {
    let callback = this._event[eventName];
    this._event[eventName] = callback && callback.filter(_fn => _fn !== fn);
    return this;
  }

  once(eventName, fn) {
    let wrapFun = function(...args) {
      fn.apply(this, args);
      this.off(eventName, fn);
    }
    this.on(eventName, wrapFun);
    return this;
  }
}

let event = new EventEmitter();
function handleClick(num) {
  console.log('--click--', num);
}
function handleClick1(num) {
  console.log('--click1--', num);
}
event.on('click', handleClick);//订阅（监听）
event.on('click', handleClick1);//订阅（监听）
/*执行其他代码，在某个时间触发（发布）click信号*/
...
event.emit('click', 10);//发布（触发）
```

上面的eventEmitter类的实现就是基于发布订阅模式。在阮一峰老师的《Javascript异步编程的4种方法》中提到：

>我们假定，存在一个"信号中心"，某个任务执行完成，就向信号中心"发布"（publish）一个信号，其他任务可以向信号中心"订阅"（subscribe）这个信号，从而知道什么时候自己可以开始执行。这就叫做"发布/订阅模式"（publish-subscribe pattern），又称"观察者模式"（observer pattern）。

发布订阅模式可以理解为是观察者模式的一种变形，两者的区别是：发布/订阅模式在观察者模式的基础上，在目标和观察者之间增加一个调度中心。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017114430.jpg)

## 观察者模式（有待考证）：

>应该用Object.defineProperty() 或者用 Proxy 来实现。下面代码有点问题。待修改

```javascript
class Observe {
    constructor() {
      this.dep = [];
    }

    watcher(propertyName, fn) {
      let handle = this.dep[propertyName] || [];
      handle.push(fn);
      this.dep[propertyName] = handle;
      return this;
    }

    unwatch(propertyName) {
      let depen = this.dep[propertyName];
      depen = depen && [];
      this.dep[propertyName] = depen;
      return this;
    }

    notify(propertyName, ...args) {
      let handle = this.dep[propertyName];
      if (handle && handle.length > 0) {
        handle.forEach(fn => fn.apply(this, args));
      }
      return this;
    }
  }

  let observe = new Observe();

  let obj = {
    a: 'first',
    b: 'second'
  }

  let handle = {
    get(target, property) {
      return Reflect.get(target, property);
    },
    set(target, key, value) {
      observe.notify(key);
      Reflect.set(target, key, value);
    }
  }

  function watcher1() {
    console.log('watchee1: a have chage');
  }

  function watcher2() {
    console.log('watchee2: a have chage');
  }

  observe.watcher('a', watcher1);
  observe.watcher('a', watcher2);

  let proxy = new Proxy(obj, handle);

  proxy.a = 10;
  proxy.a = 130;

  observe.unwatch('a');

  proxy.a = 100;
```


<comment />
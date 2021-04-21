---
title: JS原生函数实现之call、apply、bind
date: "2020-06-15"
author: Yoha
tags:
    - 前端开发
    - JavaScript
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017105512.jpeg
meta:
  - name: title
    content: JS原生函数实现之call/apply/bind
  - name: description
    content: JS原生函数实现之call/apply/bind
  - name: keywords
    content: call, apply, bind, 模拟实现
  - name: author
    content: Yoha
featured: true
---
# JS原生函数实现之call/apply/bind

```javascript
    let foo = {
      a: 10
    }

    function bar(name, age) {
      console.log(name, age);
      console.log(this.a);
    }


    /*
    let foo = {
      a: 10,
      bar: function(name,age) {
        console.log(name, age);
        console.log(this.a);
      }
    }
    foo.bar();//10
    */


    Function.prototype.call2 = function (context) {
      let _context = context || window;
      _context.fn = this;
      let arg = [];
      for (let i = 1; i < arguments.length; i++) {
        arg.push(arguments[i])
      }
      let res = _context.fn(...arg);
      delete _context.fn;
      return res;
    }

    Function.prototype.apply2 = function (context) {
      let _context = context || window;
      _context.fn = this;
      if (Array.isArray(arguments[1])) {
        let res = _context.fn(...arguments[1]);
        delete _context.fn;
        return res;
      } else if (arguments[1]) {
        throw new Error('need array');
      } else {
        let res = _context.fn();
        delete _context.fn;
        return res;
      }
    }

    Function.prototype.bind2 = function (context) {
      let self = this; //self === bar
      let arg = Array.prototype.slice.call(arguments, 1);
      let fbound = function () {
        let bindArg = Array.prototype.slice.call(arguments);
        //当作为构造函数时，this 指向实例，self 指向绑定函数(bar)，
        //因为下面一句 `fbound.prototype = this.prototype;`，已经修改了 fbound.prototype 为 绑定函数(bar)的 prototype，
        //此时结果为 true，当结果为 true 的时候，this 指向实例。

        //当作为普通函数时，this 指向 window，self 指向绑定函数，此时结果为 false，当结果为 false 的时候，this 指向绑定的 context。
        // console.log(this instanceof self);
        // console.log(this);
        // console.log(self);
        self.call2(this instanceof self ? this : context, ...arg.concat(bindArg));
      }
      fbound.prototype = this.prototype;
      return fbound;
    }

    // bar.call2(foo, 'kenvin', 18);
    // bar.apply2(foo, ['jack', 1888]);

    let b = bar.bind2(foo, 'kkk')
    b(15);
```

## 参考文章

[JavaScript深入之call和apply的模拟实现](https://juejin.im/post/5907eb99570c3500582ca23c)


<comment />
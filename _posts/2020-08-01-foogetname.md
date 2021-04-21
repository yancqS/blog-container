---
title: 题目:经典的FOO.getName问题
tags:
    - 前端开发
    - JavaScript
date: "2020-08-01"
author: Yoha
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017101258.png
meta:
  - name: title
    content: 题目:经典的FOO.getName问题
  - name: description
    content: 题目:经典的FOO.getName问题
  - name: keywords
    content: 运算符优先级
  - name: author
    content: Yoha
featured: true
---
# 题目:经典的FOO.getName问题

代码如下:

```javascript
function Foo() {
  getName = function () {
    console.log(1);
  }
  return this;
}
Foo.getName = function () {
  console.log(2);
}
Foo.prototype.getName = function () {
  console.log(3);
}
var getName = function () {
  console.log(4);
}
function getName() {
  console.log(5);
}
```

问题是: 下面的代码输出什么？

```javascript
Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();
```

解析：

- 首先是Foo.getName(),调用Foo的静态方法getName，对应着：

  ```javascript
  Foo.getName = function () {
    console.log(2);
  }
  ```

  因此输出为2；

- 其次是getName()，由于函数提升是优先于变量提升，因此getName()会被覆盖：

  ```javascript
  function getName() {
    console.log(5);
  }
  var getName;
  getName = function () {
    console.log(4);
  }
  ```

  所以输出为4；

- 其次是Foo().getName()，这句代码，首先是执行了Foo(),

  ```javascript
  function Foo() {
    getName = function () {
      console.log(1);
    }
    return this;
  }
  ```

  执行Foo(),修改了全局变量getName的值，并且返回了this，此时this指向的是 window，因此Foo().getName()输出的是1；

- 其次是getName()，这个时候getName的值已经被上一句Foo().getName()执行时修改了，因此输出还是1；

- 其次是new Foo.getName();这个地方涉及到运算符的优先级问题

  参考[MDN运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)

  ![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017101645.png)

  Foo.getName()属于成员访问，优先级为19；new Foo属于new(无参数列表)优先级为18，因此new Foo.getName()相当于：new (Foo.getName())。先执行Foo.getName()，输出为 2，再创建Foo.getName()方法的实例。

- 其次是new Foo().getName();

  new Foo()属于new(带参数列表)优先级为19；成员访问的优先级也是19。按照运算符规则，同一优先级按照从左至右的顺序执行。因此new Foo().getName()相当于(new Foo()).getName()。也就是先执行new Foo()，先创建Foo的实例，然后调用实例的getName()方法。由于实例自身并没有这个方法，因此会顺着实例的原型：实例.\_\_proto\_\_去找这个方法，实例.\_\_proto\_\_指向Foo.prototype。因此最终调用的是Foo.prototype.getName()。输出为3。

- 最后是new new Foo().getName();

  >第一个new 属于 new(无参数列表) 优先级为18；之后的new属于带参数列表的，优先级为19，成员访问优先级也为19.

  相当于：new ((new Foo()).getName())，先执行new Foo().getName()，输出3，然后再创建Foo.prototype.getName()这个函数的实例。


<comment />
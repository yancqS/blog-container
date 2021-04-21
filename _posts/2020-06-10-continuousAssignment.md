---
title: 连续赋值
date: "2020-06-10"
author: Yoha
location: Beijing
tags:
    - 前端开发
    - JavaScript
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017175905.png
meta:
  - name: title
    content: 连续赋值
  - name: description
    content: 连续赋值
  - name: keywords
    content: 连续赋值
  - name: author
    content: Yoha
featured: true
---
# 关于连续赋值的问题

## 题目

```javascript
let a = { n: 1 };
let b = a;
a.x = a = { n: 2 };
console.log(a.x);
console.log(b.x);
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017175905.png)

具体的文字描述引用知乎大佬的解释，说的比较到位:

```javascript
let a = { n: 1 };
let b = a;
```

这两行比较好理解。在栈内存中，a与b是不同的，是两个变量，但是他们的指针是相同的，指向同一个堆。

关键点来啦：

```javascript
a.x = a = { n: 2 };
```

JS成员访问的优先级要比赋值运算高。先获取等号左侧的a.x，但a.x并不存在，于是JS为（堆内存中的）对象创建一个新成员x，这个成员的初始值为undefined.

(这也是为什么直接引用一个未定义的变量会报错，但是直接引用一个对象的不存在的成员时，会返回undefined.)

创建完成后，***目标指针已经指向了这个新成员x***，并会先挂起，单等等号右侧的内容有结果了，便完成赋值。

接着执行赋值语句的右侧，发现a={n:2}是个简单的赋值操作，于是a的新值等于了{n:2}。

这里特别注意，这个a已经不是开头的那个a，而是一个全新的a,这个新a指针已经不是指向原来的值的那个堆内存，而是分配了一个新的堆内存。但是原来旧的堆内存因为还有b在占用，所以并未被回收。然后，将这个新的对象a的堆内存指针，赋值给了刚才挂起的新成员x,此时，对象成员x便等于了新的对象a。

所以现在：

```javascript
a = { n: 2 }
b = { n: 1, x: { n: 2 } }
console.log(a === b.x) //true。不是因为值的相等，而是因为对象引用的地址相同。也是是说，这个地方的相等表示指针指向同一个堆内存。
```

## 参考文章

- [知乎大佬的解释](https://www.zhihu.com/question/41220520)
- [运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)


<comment />
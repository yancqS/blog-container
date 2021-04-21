---
title: 题目:变量提升/匿名函数this指向
date: "2020-07-17"
author: Yoha
tags:
    - 前端开发
    - JavaScript
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017105512.jpeg
meta:
  - name: title
    content: 计算机组成原题目:变量提升/匿名函数this指向理第一章
  - name: description
    content: 题目:变量提升/匿名函数this指向
  - name: keywords
    content: 变量提升, 匿名函数this
  - name: author
    content: Yoha
featured: true
---
# 题目:变量提升/匿名函数this指向

## 题目1

代码如下：

```javascript
var x = 1, y = 0, z = 0;
var add = function (x) {
	x = x + 1;
	return x;
}
y = add(x);
function add(x) {
	return x = x + 3;
}
z = add(x);
console.log(x, y, z);
```

请问输出的x,y,z的值分别为多少？为什么？

由于函数提升优于变量提升，导致加3的add函数声明被下面加1的add函数表达式覆盖。也就有了下面的代码：

```javascript
function add(x) {
	return x = x + 3;
}
var x, y, z;
var add;
x = 1;
y = 0;
z = 0;
add = function (x) {
	x = x + 1;
	return x;
}
y = add(x);
z = add(x);
console.log(x, y, z);
```

接着 y = add(x) 调用add函数，传入的参数为1。注意add函数接受的参数x和外面的var x = 1;并不是一个x。因为作用域，在add函数的作用域内可以找到x，就不会去全局的作用域去找。同理z = add(x) 也是。

因此输出的x,y,z的值分别为1, 2, 2.

假如我们把add函数稍作修改，如下：

```javascript
function add(x) {
	return x = x + 3;
}
var x, y, z;
var add;
x = 1;
y = 0;
z = 0;
add = function (x1) {
	x = x1 + 1;
	return x;
}
y = add(x);
z = add(x);
console.log(x, y, z);//此时输出为：3，2，3
```

这个时候输出的x, y, z值为3，2，3。这是因为在y = add(x) 调用add函数时，传入的参数为1，函数作用域内不曾声明x，因此会找到全局的x，并修改其值为2，返回x，因此y=2；在z = add(x) 调用add函数时，传入的参数为2(被修改后的x)，然后全局的x被修改为3，返回x，因此z = 3. 所以输出为3，2，3。

## 题目2

代码如下：

```javascript
var num = 1;
var myObject = {
	num: 2,
	add: function () {
		this.num = 3;
		(function () {
			console.log(this.num);
			this.num = 4;
		})();
		console.log(this.num);
	},
  sub: function () {
		console.log(this.num);
	}
}

myObject.add();
console.log(myObject.num);
console.log(num);
var sub = myObject.sub;
sub();
```

先看第17行：myObject.add();

调用myObject对象中的add方法，此时this指向这个对象(也就是myObject),但比较特殊的时这个函数里面还有一个立即执行的匿名函数，在这个匿名函数里面this是指向window的。

因此执行第17行会打印：1，3

接着执行第18行console.log(myObject.num);也是打印3

接着执行第19行console.log(num);在执行第17行时，匿名函数中修改全局num值为4，所以此时打印出来为4.

执行第21行，如果直接调用myObject.add();此时这个add函数里面的this指向myObject对象，但是如果var sub = myObject.sub;然后调用sub(),这个时候情况就不一样啦。此时就相当于调用了一个普通的函数，并不是作为myObject对象的方法被调用的。因此，此时this指向window。在执行第17行时，匿名函数中修改全局num值为4，所以此时打印出来为4.

>《javascript高级程序设计》这本书里du的匿名函数这一章也有讲到，摘抄如下：
this对象是在运行时基于函数的执行环境绑定的：在全局函数中，this等于window，而当函数被作为某个对象的方法调用时，this等于那个对象。不过，匿名函数的执行环境具有全局性，因为其this对象通常指向window。

<comment />
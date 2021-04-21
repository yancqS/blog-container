---
title: How JavaScript works - an overview of the engine, the runtime, and the call stack
description: How Javascript works
date: '2020-11-12'
author: Yoha
location: Beijing
image: https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201111175711.png
tags:
    - 翻译
    - 转载
    - JavaScript
meta:
  - name: title
    content: Javascript工作原理：引擎、运行时及调用栈概览
  - name: description
    content: Javascript工作原理：引擎、运行时及调用栈概览
  - name: keywords
    content: Javascript工作原理, 引擎, 运行时, 调用栈
  - name: author
    content: Yoha
featured: true
---
# How JavaScript works: an overview of the engine, the runtime, and the call stack
>Javascript工作原理：引擎、运行时及调用栈概览

As JavaScript is getting more and more popular, teams are leveraging its support on many levels in their stack - front-end, back-end, hybrid apps, embedded devices and much more.
>随着Javascript越来越受欢迎，团队正凭借JavaScript在他们诸如前端、后端、混合式app、嵌入设备以及更多场景等开发栈的不同层面的支持。

This post is meant to be the first in a series aimed at digging deeper into JavaScript and how it actually works: we thought that by knowing the building blocks of JavaScript and how they come to play together you’ll be able to write better code and apps. We’ll also share some rules of thumb we use when building [SessionStack](https://www.sessionstack.com/?utm_source=medium&utm_medium=source&utm_content=javascript-series-post1-intro), a lightweight JavaScript application that has to be robust and highly-performant in order to stay competitive.
>这篇文章是深入研究JavaScript工作原理系列文章的第一篇：我们认为在了解 JavaScript 的构建模块以及它们是如何在一起工作的之后你将会写出更好的代码和 apps。我们将会分享一些当在创建 [SessionStack](https://www.sessionstack.com/?utm_source=medium&utm_medium=source&utm_content=javascript-series-post1-intro) 时候的经验法则，SessionStack 是一个轻量级的 JavaScript 程序它拥有强壮性和高性能的优点以保持竞争力。

As shown in the [GitHut stats](https://githut.info/), JavaScript is at the top in terms of Active Repositories and Total Pushes in GitHub. It doesn’t lag behind much in the other categories either.
>正如[GitHut stats](https://githut.info/)所展示的那样，JavaScript的活跃仓库和总推送量在Github排名第一。在其他方面也不逊色于其他语言太多。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201111173115.jpg)


[(Check out up-to-date GitHub language stats)](https://madnight.github.io/githut/)
>[(查看最新的GitHub语言统计信息)](https://madnight.github.io/githut/)

If projects are getting so much dependent on JavaScript, this means that developers have to be utilizing everything that the language and the ecosystem provide with deeper and deeper understanding of the internals, in order to build amazing software.
>如果工程正在变得非常依赖于JavaScript，这意味着为了开发出色的软件，开发者必须利用由语言和生态系统提供的一切东西，并且要更加深入的理解JavaScript内部的工作机制。

As it turns out, there are a lot of developers that are using JavaScript on a daily basis but don’t have the knowledge of what happens under the hood.
>事实上，有很多平时使用JavaScrip的t开发者并不了解其底层知识。

## Overview
>概览

Almost everyone has already heard of the V8 Engine as a concept, and most people know that JavaScript is single-threaded or that it is using a callback queue.
>几乎所有人都听说过V8引擎的概念，并且大所数人知道JavaScript是单线程的或者它是使用回调队列的。

In this post, we’ll go through all these concepts in detail and explain how JavaScript actually runs. By knowing these details, you’ll be able to write better, non-blocking apps that are properly leveraging the provided APIs.
>在这篇文章中，我们将详细介绍这些概念并解释JavaScript的工作原理。了解了这些细节，通过合理地使用所提供的APIs，你将可能写出更好的，非阻塞的程序。

If you’re relatively new to JavaScript, this blog post will help you understand why JavaScript is so “weird” compared to other languages.
>如果你是JavaScript的新手，此博客文章将帮助你了解JavaScript与其他语言相比为何如此“古怪”。

And if you’re an experienced JavaScript developer, hopefully, it will give you some fresh insights on how the JavaScript Runtime you’re using every day actually works.
>如果你是一位经验丰富的JavaScript开发人员，那么希望它会帮你更加深入地理解JavaScript运行时的实际工作原理。

### The JavaScript Engine
>javascript引擎

A popular example of a JavaScript Engine is Google’s V8 engine. The V8 engine is used inside Chrome and Node.js for example. Here is a very simplified view of what it looks like:
>谷歌V8引擎是流行的JavaScript引擎之一。例如，V8引擎用于Chrome和Node.js。 这里有一个简单的视图来描绘其大概：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201111173700.png)

The Engine consists of two main components:
>引擎主要有两个部分组成
- Memory Heap — this is where the memory allocation happens
> - 动态内存管理 － 在这里分配内存
- Call Stack — this is where your stack frames are as your code executes
> - 调用栈 － 这里代码执行即是你的堆栈结构

### The Runtime
>运行时

There are APIs in the browser that have been used by almost any JavaScript developer out there (e.g. “setTimeout”). Those APIs, however, are not provided by the Engine.
>几乎每一个JavaScript开发者都使用过一些浏览器API（比如：setTimeout）。然而，这些API并不是引擎提供的。

So, where are they coming from?
>那么它们从何而来呢？

It turns out that the reality is a bit more complicated.
>事实上这个情况有点复杂。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201111175711.png)

So, we have the Engine but there is actually a lot more. We have those things called Web APIs which are provided by browsers, like the DOM, AJAX, setTimeout and much more.
>所以，除了引擎实际上还有很多其他方面的东西。我们可以使用由浏览器提供的称为Web API的东西，比如DOM，AJAX，setTimeout等。

And then, we have the so popular **event loop** and the **callback queue**.
>因此，就有了周知的**事件循环**和**回调队列**

### The Call Stack
>调用栈

JavaScript is a single-threaded programming language, which means it has a single Call Stack. Therefore it can do one thing at a time.
>JavaScript是单线程的编程语言，这就意味着其只有一个调用栈。因此，它一次只能做一件事情。

The Call Stack is a data structure which records basically where in the program we are. If we step into a function, we put it on the top of the stack. If we return from a function, we pop off the top of the stack. That’s all the stack can do.
>调用栈是一种数据结构，它记录着我们在程序中的大概位置。当执行进入一个函数，会把它置于栈顶。如果从函数中返回，则会把它从栈顶移除。这就是调用栈所能够做的事情。

Let’s see an example. Take a look at the following code:
>举个例子。代码如下：

```javascript
function multiply(x, y) {
    return x * y;
}
function printSquare(x) {
    var s = multiply(x, x);
    console.log(s);
}
printSquare(5);
```

When the engine starts executing this code, the Call Stack will be empty. Afterwards, the steps will be the following:
>当引擎开始执行这段代码的时候，调用栈会被清空。然后，产生如下步骤：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201111201105.png)

Each entry in the Call Stack is called a Stack Frame.
>调用栈的每个入口被称为堆栈结构。

And this is exactly how stack traces are being constructed when an exception is being thrown — it is basically the state of the Call Stack when the exception happened. Take a look at the following code:
>这正是当抛出异常时堆栈跟踪是如何被构造出来的 —— 当发生异常时这基本上是调用栈的状态。看如下代码：

```javascript
function foo() {
    throw new Error('SessionStack will help you resolve crashes :)');
}
function bar() {
    foo();
}
function start() {
    bar();
}
start();
```

If this is executed in Chrome (assuming that this code is in a file called foo.js), the following stack trace will be produced:
>如果在Chrome中执行（假设代码在foo.js文件中），将会产生如下跟踪栈：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201111201215.png)

**“Blowing the stack”** — this happens when you reach the maximum Call Stack size. And that could happen quite easily, especially if you’re using recursion without testing your code very extensively. Take a look at this sample code:
>**"堆栈溢出"** —— 当你达到最大的调用栈大小会发生这种情况。这种情况很容易发生，尤其是当你使用递归而没有仔细检查代码的时候。查看如下代码：

```javascript
function foo() {
    foo();
}
foo();
```

When the engine starts executing this code, it starts with calling the function “foo”. This function, however, is recursive and starts calling itself without any termination conditions. So at every step of the execution, the same function gets added to the Call Stack over and over again. It looks something like this:
>当引擎开始执行这段代码时，它开始调用foo函数。然而，这是一个递归函数，它会不断的调用自己而没有任何终止条件。因此，在每一次执行过程中，调用栈会反复添加同样的函数。执行过程大概如下：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201111201329.png)

At some point, however, the number of function calls in the Call Stack exceeds the actual size of the Call Stack, and the browser decides to take action, by throwing an error, which can look something like this:
>然而，在某一时刻，调用栈中函数调用次数超出了调用栈的实际大小，浏览器就会抛出如下错误：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201111201413.png)

Running code on a single thread can be quite easy since you don’t have to deal with complicated scenarios that are arising in multi-threaded environments — for example, deadlocks.
>在单线程中运行代码会相当轻松，因为你不必去处理多线程环境中产生的复杂情况，比如死锁。

But running on a single thread is quite limiting as well. Since JavaScript has a single Call Stack, **what happens when things are slow?**
>但是在单线程中运行代码也会有相当多限制。由于JavaScript只有一个调用栈，**那么如果运行很慢会发生什么呢？**

### Concurrency & the Event Loop
>并发和事件循环

What happens when you have function calls in the Call Stack that take a huge amount of time in order to be processed? For example, imagine that you want to do some complex image transformation with JavaScript in the browser.
>当你在调用栈中有函数为了完成运行需要消耗大量的时间的时候会发生什么？比如，想象一下，你想在浏览器中用JavaScript完成一些复杂的图像转换。

You may ask — why is this even a problem? The problem is that while the Call Stack has functions to execute, the browser can’t actually do anything else — it’s getting blocked. This means that the browser can’t render, it can’t run any other code, it’s just stuck. And this creates problems if you want nice fluid UIs in your app.
>你也许会问 —— 为什么这也算个问题？问题在于当调用栈有函数在执行时，浏览器实际上是不能做任何事情的 —— 它被阻塞了。这意味着浏览器不能够执行渲染，也不能运行任何代码，它被卡住啦。如果你想在app中拥有流畅的UI交互，那这将是一个问题。

And that’s not the only problem. Once your browser starts processing so many tasks in the Call Stack, it may stop being responsive for quite a long time. And most browsers take action by raising an error, asking you whether you want to terminate the web page.
>并且，这并不是唯一的问题。一旦你的浏览器开始在调用栈中执行如此多的任务，浏览器可能会在相当长的一段时间内停止交互。大多数浏览器会抛出一个错误，询问你是否要关闭网页。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201111201530.jpeg)

Now, that’s not the best user experience out there, is it?
>现在，这并不是最好的用户体验，不是吗？

So, how can we execute heavy code without blocking the UI and making the browser unresponsive? Well, the solution is **asynchronous callbacks**.
>所以，我们如何在不阻塞UI以及不让浏览器停止响应的情况下执行运行缓慢（或者说耗时）的代码呢？办法是使用**异步回调**。

This will be explained in greater detail in Part 2 of the “How JavaScript actually works” tutorial: “Inside the V8 engine + 5 tips on how to write optimized code”.
>这将会在 『JavaScript 工作原理』 第二章：『在V8 引擎中如何写最佳代码的 5 条小技巧』中进行详细阐述。

## 参考文章

- [翻译参考文章](https://github.com/Troland/how-javascript-works/blob/master/overview.md)

<comment />
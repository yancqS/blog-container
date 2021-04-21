---
title: How JavaScript works - inside the V8 engine + 5 tips on how to write optimized code
description: How Javascript works
date: '2021-04-13'
author: Yoha
location: Beijing
image: https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201217171505.png
tags:
    - 翻译
    - 转载
    - JavaScript
meta:
  - name: title
    content: Javascript工作原理：如何在 V8 引擎中书写最优代码的 5 条小技巧
  - name: description
    content: Javascript工作原理：如何在 V8 引擎中书写最优代码的 5 条小技巧
  - name: keywords
    content: Javascript工作原理
  - name: author
    content: Yoha
featured: true
---
# How JavaScript works: inside the V8 engine + 5 tips on how to write optimized code

>Javascript工作原理：如何在 V8 引擎中书写最优代码的 5 条小技巧

Couple of weeks ago we started a series aimed at digging deeper into JavaScript and how it actually works: we thought that by knowing the building blocks of JavaScript and how they come to play together you’ll be able to write better code and apps.

>几周前，我们开始了旨在更深入地研究JavaScript及其工作原理的一系列文章：我们认为，通过了解JavaScript的组成部分以及它们如何一起发挥作用，你将能够编写更好的代码和应用。

The first post of the series focused on providing an overview of the engine, the runtime and the call stack. This second post will be diving into the internal parts of Google’s V8 JavaScript engine. We’ll also provide a few quick tips on how to write better JavaScript code —best practices our development team at SessionStack follows when building the product.

>该系列的第一篇文章主要介绍了引擎、运行时以及调用栈的概述。第二篇文章将深入探讨Google V8 JavaScript引擎的内部部分。我们还将提供一些有关如何编写更好的JavaScript代码的技巧，这是我们SessionStack开发团队在构建产品时遵循的最佳实践。

## Overview

>概述

A **JavaScript engine** is a program or an interpreter which executes JavaScript code. A JavaScript engine can be implemented as a standard interpreter, or just-in-time compiler that compiles JavaScript to bytecode in some form.

>**JavaScript引擎**是执行JavaScript代码的程序或解释器。JavaScript引擎可以用标准解释器或者即时编译器来实现，即时编译器是以某种形式把JavaScript解释为字节码。

This is a list of popular projects that are implementing a JavaScript engine:

>这是一组实现JavaScript引擎的热门项目：

- [V8](https://en.wikipedia.org/wiki/V8_(JavaScript_engine)) — open source, developed by Google, written in C++
- [Rhino](https://en.wikipedia.org/wiki/Rhino_(JavaScript_engine)) — managed by the Mozilla Foundation, open source, developed entirely in Java
- [SpiderMonkey](https://en.wikipedia.org/wiki/SpiderMonkey) — the first JavaScript engine, which back in the days powered Netscape Navigator, and today powers Firefox
- [JavaScriptCore](https://en.wikipedia.org/wiki/JavaScriptCore) — open source, marketed as Nitro and developed by Apple for Safari
- [KJS](https://en.wikipedia.org/wiki/KJS_(KDE)) —— KDE's engine originally developed by Harri Porten for the KDE project’s Konqueror web browser
- [Chakra (JScript9)](https://en.wikipedia.org/wiki/Chakra_(JScript_engine)) —— Internet Explorer
- [Chakra (JavaScript)](https://en.wikipedia.org/wiki/Chakra_(JavaScript_engine)) —— Microsoft Edge
- [Nashorn](https://en.wikipedia.org/wiki/Nashorn_(JavaScript_engine)) —— open source as part of OpenJDK, written by Oracle Java Languages and Tool Group
- [JerryScript](https://en.wikipedia.org/wiki/JerryScript) ——  is a lightweight engine for the Internet of Things.

> - v8 —— 开源，由谷歌开发，用C++编写
> - Rhino —— 由 Mozilla 基金会主导，开源的，完全使用 Java 开发
> - SpiderMonkey —— 第一个JavaScript引擎，可追溯到Netscape Navigator时代，如今又为Firefox提供动力
> - JavaScriptCore —— 开源，以 Nitro 的名称来推广，并由苹果为 Safari 开发
> - KJS —— KDE 引擎，起先是由 Harri Porten 为 KDE 工程的 Konqueror 浏览器所开发
> - Chakra (JScript9) —— IE
> - Chakra (JavaScript) —— Microsoft Edge
> - Nashorn —— 作为OpenJDK的一部分开源，由Oracle Java语言和Tool Group编写
> - JerryScript —— 一个为物联网开发的轻量级引擎

## Why was the V8 Engine created?

>V8引擎的由来

The V8 Engine which is built by Google is open source and written in C++. This engine is used inside Google Chrome. Unlike the rest of the engines, however, V8 is also used for the popular Node.js runtime.

> V8引擎是由谷歌开源并以C++语言编写。Google Chrome内置了这个引擎。然而与其他引擎不同的是，V8引擎也被用于当下流行的Node.js运行时中。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201217171505.png)

V8 was first designed to increase the performance of JavaScript execution inside web browsers. In order to obtain speed, V8 translates JavaScript code into more efficient machine code instead of using an interpreter. It compiles JavaScript code into machine code at execution by implementing a **JIT (Just-In-Time) compiler** like a lot of modern JavaScript engines do such as SpiderMonkey or Rhino (Mozilla). The main difference here is that V8 doesn’t produce bytecode or any intermediate code.

>起先V8被设计用来提高Web浏览器中JavaScript的执行性能。为了达到更快的执行速度，V8将JavaScript代码转换为更为有效的机器代码，而不是使用解释器。像许多现代JavaScript引擎（例如SpiderMonkey或Rhino（Mozilla））一样，它通过实现JIT（即时）编译器在执行时将JavaScript代码编译为机器代码。这里主要的区别是V8不会产生字节码或任何中间码。

## V8 used to have two compilers

>V8曾经拥有两个编译器

Before version 5.9 of V8 came out (released earlier this year), the engine used two compilers:

>在V8引擎的5.9版本发布(2017 年初)之前，它拥有两种编译器：

- full-codegen — a simple and very fast compiler that produced simple and relatively slow machine code.
- Crankshaft — a more complex (Just-In-Time) optimizing compiler that produced highly-optimized code.

> - full-codegen —— 一个简单且快速的编译器用来生成简单且运行相对缓慢的机器码。
> - Crankshaft —— 一个更复杂的（即时）优化编译器用来生成了高效的代码。

The V8 Engine also uses several threads internally:

>V8引擎内部使用多个线程：

- The main thread does what you would expect: fetch your code, compile it and then execute it
- There’s also a separate thread for compiling, so that the main thread can keep executing while the former is optimizing the code
- A Profiler thread that will tell the runtime on which methods we spend a lot of time so that Crankshaft can optimize them
- A few threads to handle Garbage Collector sweeps

> - 主线程做你期望它做的事情：获取代码，编译代码并且执行
> - 还有一个单独的编译线程，因此主线程可以在编译线程优化代码的同时继续执行
> - 一个用于性能检测的线程会告诉运行时我们在哪个方法上花了太多的时间，以便于让 Crankshaft 来优化这些代码
> - 有几个线程用来处理垃圾回收器的清理工作

When first executing the JavaScript code, V8 leverages full-codegen which directly translates the parsed JavaScript into machine code without any transformation. This allows it to start executing machine code very fast. Note that V8 does not use intermediate bytecode representation this way removing the need for an interpreter.
>当第一次执行 JavaScript 代码的时候，V8 使用 full-codegen 直接把解析的 JavaScript 代码解释为机器码，中间没有任何转换。这使得它一开始非常快速地运行机器码。注意， V8 没有使用中间字节码来表示，这样就不需要解释器了。

When your code has run for some time, the profiler thread has gathered enough data to tell which method should be optimized.
>当代码已经执行一段时间后，性能检测器线程已经收集了足够多的数据来告诉 Crankshaft 哪个方法可以被优化。

Next, Crankshaft optimizations begin in another thread. It translates the JavaScript abstract syntax tree to a high-level static single-assignment (SSA) representation called Hydrogen and tries to optimize that Hydrogen graph. Most optimizations are done at this level.
>接下来，在另一个线程中开始进行 Crankshaft 代码优化。它把 JavaScript 抽象语法树转化为一个被称为 Hydrogen 的高级静态单赋值并且试着优化这个 Hydrogen 图表。大多数的代码优化都在这一层完成。

## Inlining
>内联

The first optimization is inlining as much code as possible in advance. Inlining is the process of replacing a call site (the line of code where the function is called) with the body of the called function. This simple step allows following optimizations to be more meaningful.
>第一个优化方法即是提前尽可能多地内联代码。内联指的是把调用地址(函数被调用的那行代码)置换为被调用函数的函数体的过程。这个简单的步骤使得接下来的代码优化更有意义。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201217171912.png)

## Hidden class
>隐藏类

JavaScript is a prototype-based language: there are no classes and objects are created using a cloning process. JavaScript is also a dynamic programming language which means that properties can be easily added or removed from an object after its instantiation.
>Javascript是基于原型的语言：当进行克隆的时候不会创建类和对象。Javascript也是一门动态编程语言，这意味着在它实例化之后，可以任意地添加或删除对象属性。

Most JavaScript interpreters use dictionary-like structures ([hash function based](https://en.wikipedia.org/wiki/Hash_function)) to store the location of object property values in the memory. This structure makes retrieving the value of a property in JavaScript more computationally expensive than it would be in a non-dynamic programming language like Java or C#. In Java, all of the object properties are determined by a fixed object layout before compilation and cannot be dynamically added or removed at runtime (well, C# has the [dynamic](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/reference-types) type which is another topic). As a result, the values of properties (or pointers to those properties) can be stored as a continuous buffer in the memory with a fixed-offset between each. The length of an offset can easily be determined based on the property type, whereas this is not possible in JavaScript where a property type can change during runtime.
>大多数的Javascript解释器使用类字典结构(基于哈希函数)来存储对象属性值的内存地址（即对象的内存地址）。这种结构使得在Javascript中获取属性值要比诸如Java或者C#这种非动态编程语言更耗费时间。在 Java 中，所有的对象属性都在编译前由一个固定的对象布局所决定并且不能够在运行时动态添加或者删除(嗯， C# 拥有动态类型，这是另外一个话题)。因此，属性值(指向这些属性的指针)以连续的缓冲区的形式存储在内存之中，彼此之间有固定的偏移量。偏移量的长度可以基于属性类型被简单地计算出来，然而在 JavaScript 中这是不可能的，因为运行时可以改变属性类型。

Since using dictionaries to find the location of object properties in the memory is very inefficient, V8 uses a different method instead: hidden classes. Hidden classes work similarly to the fixed object layouts (classes) used in languages like Java, except they are created at runtime. Now, let’s see what they actually look like:
>由于使用字典在内存中寻找对象属性的内存地址是非常低效的，V8 转而使用隐藏类。隐藏类工作原理和 Java 语言中使用的固定对象布局(类)类似，除了它们是在运行时创建的以外。现在，让我们看看他们的样子：

```javascript
function Point(x, y) {
    this.x = x;
    this.y = y;
}
var p1 = new Point(1, 2);
```

Once the “new Point(1, 2)” invocation happens, V8 will create a hidden class called “C0”.
>一旦 "new Point(1,2)" 发生调用，V8 将会创建一个叫做 "C0" 的隐藏类。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201217172146.png)

No properties have been defined for Point yet, so “C0” is empty.
>因为还没有为类 Point 创建属性，所以 "C0" 是空的。

Once the first statement “this.x = x” is executed (inside the “Point” function), V8 will create a second hidden class called “C1” that is based on “C0”. “C1” describes the location in the memory (relative to the object pointer) where the property x can be found. In this case, “x” is stored at [offset](https://en.wikipedia.org/wiki/Offset_%28computer_science%29) 0, which means that when viewing a point object in the memory as a continuous buffer, the first offset will correspond to property “x”. V8 will also update “C0” with a “class transition” which states that if a property “x” is added to a point object, the hidden class should switch from “C0” to “C1”. The hidden class for the point object below is now “C1”.
>一旦第一条语句 "this.x = x" 开始执行(在 Point 函数中), V8 将会基于 "C0" 创建第二个隐藏类"C1"。"C1"描述了属性 x 的内存地址(相对于对象指针)。本例中， 'x' 存储在偏移0中，这意味着当在内存中以连续的缓冲区来查看 `Point` 对象时，第一个偏移量将会对应着属性 'x'。V8将会使用"类转换"来更新"C0",类转换表示如果属性'x'被添加到`Point`对象，隐藏类将会从"C0"更新到"C1"。下面的`Point`对象的隐藏类现在是"C1"。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201217172326.png)

`Every time a new property is added to an object, the old hidden class is updated with a transition path to the new hidden class. Hidden class transitions are important because they allow hidden classes to be shared among objects that are created the same way. If two objects share a hidden class and the same property is added to both of them, transitions will ensure that both objects receive the same new hidden class and all the optimized code that comes with it.`
>`每当对象添加新的属性时，将会使用转换路径来把旧的隐藏类更新为新的隐藏类。隐藏类转换是重要的，因为它们使得以同样方式创建的对象可以共享隐藏类。如果两个对象共享一个隐藏类并且两个对象添加了相同的属性，转换将会确保两个对象收到相同的隐藏类，以及随之而来的相同的代码优化。`

This process is repeated when the statement “this.y = y” is executed (again, inside the Point function, after the “this.x = x” statement).
>当运行"this.y = y"时，会重复相同的过程(还是在`Ponint`函数中，在"this.x = x"语句之后)。

A new hidden class called “C2” is created, a class transition is added to “C1” stating that if a property “y” is added to a Point object (that already contains property “x”) then the hidden class should change to “C2”, and the point object’s hidden class is updated to “C2”.
>一个被称为"C2"的新的隐藏类将会被创建，一个类转换被添加到"C1"中，表明如果属性'y'被添加到`Point`对象中(已经包含'x'属性)，那么隐藏类应该更改为"C2",并且`Point`对象的隐藏类会更新为"C2"。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201217174903.png)

Hidden class transitions are dependent on the order in which properties are added to an object. Take a look at the code snippet below:
>隐藏类转换依赖于属性被添加到对象的**顺序**。看如下的代码片段：

```javascript
function Point(x, y) {
    this.x = x;
    this.y = y;
}
var p1 = new Point(1, 2);
p1.a = 5;
p1.b = 6;
var p2 = new Point(3, 4);
p2.b = 7;
p2.a = 8;
```

Now, you would assume that for both p1 and p2 the same hidden classes and transitions would be used. Well, not really. For “p1”, first the property “a” will be added and then the property “b”. For “p2”, however, first “b” is being assigned, followed by “a”. Thus, “p1” and “p2” end up with different hidden classes as a result of the different transition paths. **In such cases, it’s much better to initialize dynamic properties in the same order so that the hidden classes can be reused.**
>现在，你会以为 p1 和 p2 会使用相同的隐藏类和类转换。然而，对于 "p1"，先添加属性 "a" 然后再添加属性 "b"。然而，对于 "p2"，先添加属性 "b" 然后是 "a"。这样，因为使用不同的转换路径，"p1" 和 "p2" 会使用不同的隐藏类。**在这种情况下，更好的方法是以相同的顺序初始化动态属性以便于复用隐藏类。**

## Inline caching
>内联缓存

V8 takes advantage of another technique for optimizing dynamically typed languages called inline caching. Inline caching relies on the observation that repeated calls to the same method tend to occur on the same type of object. An in-depth explanation of inline caching can be found [here](https://github.com/sq/JSIL/wiki/Optimizing-dynamic-JavaScript-with-inline-caches).
>V8利用了另一种优化动态类型语言的技术，称为内联缓存。内联缓存依赖于对于同样类型的对象的同样方法的重复调用的观察。关于内联缓存的深入阐述可以在[这里](https://github.com/sq/JSIL/wiki/Optimizing-dynamic-JavaScript-with-inline-caches)找到。

We’re going to touch upon the general concept of inline caching (in case you don’t have the time to go through the in-depth explanation above).
>我们将会简单涉及一下内联缓存的概念(万一你没有时间去通读以上的深入理解内联缓存的文章)。

So how does it work? V8 maintains a cache of the type of objects that were passed as a parameter in recent method calls and uses this information to make an assumption about the type of object that will be passed as a parameter in the future. If V8 is able to make a good assumption about the type of object that will be passed to a method, it can bypass the process of figuring out how to access the object’s properties, and instead, use the stored information from previous lookups to the object’s hidden class.
>那么它是怎么工作的？V8 会维护了在最近方法调用中作为参数传递的对象类型的缓存，并且使用这份信息假设在未来某个时候这个对象类型将会作为参数被传入这个方法。如果 V8 能够很好地预判即将传入方法的对象类型，它就可以绕过寻找如何访问对象属性的过程，代之以使用储存的来自之前查找到的对象隐藏类的信息。

So how are the concepts of hidden classes and inline caching related? Whenever a method is called on a specific object, the V8 engine has to perform a lookup to the hidden class of that object in order to determine the offset for accessing a specific property. After two successful calls of the same method to the same hidden class, V8 omits the hidden class lookup and simply adds the offset of the property to the object pointer itself. For all future calls of that method, the V8 engine assumes that the hidden class hasn’t changed, and jumps directly into the memory address for a specific property using the offsets stored from previous lookups. This greatly increases execution speed.
>所以隐藏类和内联缓存的概念是怎么联系在一起的呢？每当在一个特定的对象上调用方法的时候，V8引擎都必须对该对象的隐藏类执行查找，以确定访问特定属性的偏移量。在两次具有相同隐藏类的相同方法的成功调用之后，V8 忽略隐藏类的查找，而是只是简单地把属性的偏移量添加到对象指针自身。在之后所有对这个方法的调用，V8 引擎假设隐藏类没有改变，然后使用之前查找到的偏移量来直接跳转到指定属性的内存地址。这极大地提升了代码运行速度。

Inline caching is also the reason why it’s so important that objects of the same type share hidden classes. If you create two objects of the same type and with different hidden classes (as we did in the example earlier), V8 won’t be able to use inline caching because even though the two objects are of the same type, their corresponding hidden classes assign different offsets to their properties.
>内联缓存也是为什么同样类型的对象共享隐藏类是如此重要的原因。如果创建了两个相同类型的对象而使用不同的隐藏类(正如之前的例子所做的那样)，V8将不能使用内联缓存，因为即使相同类型的两个对象，它们对应的隐藏类也会为它们的属性分配不同的偏移量。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201217175132.png)

`The two objects are basically the same but the “a” and “b” properties were created in different order.`
>`这两个对象基本上是一样的但是创建'a'和'b'的顺序是不同的。`

## Compilation to machine code
>编译为机器码

Once the Hydrogen graph is optimized, Crankshaft lowers it to a lower-level representation called Lithium. Most of the Lithium implementation is architecture-specific. Register allocation happens at this level.
>一旦优化了Hydrogen图表，Crankshaft 会把它降级为低级的表现形式叫做 Lithium。大多数 Lithium 的实现都是依赖于指定的架构的。寄存器分配发生在这一层。

In the end, Lithium is compiled into machine code. Then something else happens called OSR: on-stack replacement. Before we started compiling and optimizing an obviously long-running method, we were likely running it. V8 is not going to forget what it just slowly executed to start again with the optimized version. Instead, it will transform all the context we have (stack, registers) so that we can switch to the optimized version in the middle of the execution. This is a very complex task, having in mind that among other optimizations, V8 has inlined the code initially. V8 is not the only engine capable of doing it.
>最后，Lithium会被编译为机器码。然后被称为OSR的事情发生了：堆栈替换。在开始编译和优化一个明显的耗时的方法之前，我们可能已经运行它了。V8 不会忘记代码执行缓慢的地方，而再次使用优化过的版本代码。相反，它会转换所有的上下文(堆栈，寄存器)，这样就可以在执行过程中切换到优化的版本代码。这是一个复杂的任务，你只需要记住的是，在其它优化过程中，V8 会初始化内联代码。V8 并不是唯一拥有这项能力的引擎。

There are safeguards called deoptimization to make the opposite transformation and reverts back to the non-optimized code in case an assumption the engine made doesn’t hold true anymore.
>这里有被称为逆优化的安全防护，以防止当引擎所假设的事情不再成立的时候，可以进行逆向转换和把代码反转为未优化的代码。


## Garbage collection
>垃圾回收

For garbage collection, V8 uses a traditional generational approach of mark-and-sweep to clean the old generation. The marking phase is supposed to stop the JavaScript execution. In order to control GC costs and make the execution more stable, V8 uses incremental marking: instead of walking the whole heap, trying to mark every possible object, it only walk part of the heap, then resumes normal execution. The next GC stop will continue from where the previous heap walk has stopped. This allows for very short pauses during the normal execution. As mentioned before, the sweep phase is handled by separate threads.
>V8 使用传统的标记-清除技术来清理老旧的内存以进行垃圾回收。标记阶段会中止 JavaScript 的运行。为了控制垃圾回收的成本并且使得代码执行更加稳定，V8 使用增量标记法：不遍历整个内存堆，试图标记每个可能的对象，它只是遍历一部分堆，然后恢复正常的代码执行。下一个垃圾回收点将会从上一个堆遍历中止的地方开始执行。这会在正常的代码执行过程中有一个非常短暂的间隙。之前提到过，清除阶段是由单独的线程处理的。

## Ignition and TurboFan
>Ignition 和 TurboFan

With the release of V8 5.9 earlier in 2017, a new execution pipeline was introduced. This new pipeline achieves even bigger performance improvements and significant memory savings in real-world JavaScript applications.
>随着2017年初V8 5.9的发布，引入了新的执行管道。 这个新的管道可以在实际的JavaScript应用程序中实现更大的性能提升并显著节省内存。

The new execution pipeline is built on [top of Ignition](https://v8.dev/docs), V8’s interpreter, and [TurboFan](https://v8.dev/docs/turbofan), V8’s newest optimizing compiler.
>新的执行管道是建立在新的 V8 解释器 Ignition 和 V8 最新的优化编译器 TurboFan 之上的。

You can check out the blog post from the V8 team about the topic [here](https://v8.dev/blog/launching-ignition-and-turbofan).
>你可以查看 V8 小组的[博文](https://v8.dev/blog/launching-ignition-and-turbofan)。

Since version 5.9 of V8 came out, full-codegen and Crankshaft (the technologies that have served V8 since 2010) have no longer been used by V8 for JavaScript execution as the V8 team has struggled to keep pace with the new JavaScript language features and the optimizations needed for these features.
>自从 V8 5.9 版本发布以来，full-codegen 和 Crankshaft(V8 从 2010 开始使用至今) 不再被 V8 用来运行JavaScript，因为 V8 小组正努力跟上新的 JavaScript 语言功能以及为这些功能所需要做的优化。

---

>非原文

注：V8团队的博文:『Launching Ignition and TurboFan』发表于2017年5月15日。摘抄文章一段：

For the first time, Ignition and TurboFan are used universally and exclusively for JavaScript execution in V8 v5.9. Furthermore, starting with v5.9, Full-codegen and Crankshaft, the technologies that [served V8 well since 2010](https://blog.chromium.org/2010/12/new-crankshaft-for-v8.html), are no longer used in V8 for JavaScript execution, since they no longer are able to keep pace with new JavaScript language features and the optimizations those features require. We plan to remove them completely very soon. That means that V8 will have an overall much simpler and more maintainable architecture going forward.

---

This means that overall V8 will have much simpler and more maintainable architecture going forward.
>这意味着接下来整个 V8 将会更加精简和更具可维护性。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201217175531.png)

`Improvements on Web and Node.js benchmarks`
>`网页和 Node.js benchmarks 评分的提升`

These improvements are just the start. The new Ignition and TurboFan pipeline pave the way for further optimizations that will boost JavaScript performance and shrink V8’s footprint in both Chrome and Node.js in the coming years.
>这些提升只是一个开始。新的 Ignition 和 TurboFan 管道为未来的优化作铺垫，这些优化在未来几年内会提升 JavaScript 性能，并且缩小 V8 在 Chrome 和 Node.js 中占用的空间。

Finally, here are some tips and tricks on how to write well-optimized, better JavaScript. You can easily derive these from the content above, however, here’s a summary for your convenience:
>最后，这里有一些技巧教你如何写出优化的、更好的JavaScript。你可以很容易地从上面的内容中获得这些信息，不过，为了方便起见，总结如下：

## How to write optimized JavaScript
>如何编写优化的Javascript代码

1. **Order of object properties:** always instantiate your object properties in the same order so that hidden classes, and subsequently optimized code, can be shared.
2. **Dynamic properties:** adding properties to an object after instantiation will force a hidden class change and slow down any methods that were optimized for the previous hidden class. Instead, assign all of an object’s properties in its constructor.
3. **Methods:** code that executes the same method repeatedly will run faster than code that executes many different methods only once (due to inline caching).
4. **Arrays:** avoid sparse arrays where keys are not incremental numbers. Sparse arrays which don’t have every element inside them are a **hash table**. Elements in such arrays are more expensive to access. Also, try to avoid pre-allocating large arrays. It’s better to grow as you go. Finally, don’t delete elements in arrays. It makes the keys sparse.
5. **Tagged values:** V8 represents objects and numbers with 32 bits. It uses a bit to know if it is an object (flag = 1) or an integer (flag = 0) called SMI (SMall Integer) because of its 31 bits. Then, if a numeric value is bigger than 31 bits, V8 will box the number, turning it into a double and creating a new object to put the number inside. Try to use 31 bit signed numbers whenever possible to avoid the expensive boxing operation into a JS object.
>1. 对象属性的顺序：总是以相同的顺序实例化对象属性，这样隐藏类及之后的优化代码都可以被共享。
>2. 动态属性：实例化之后为对象添加属性会致使隐藏类发生改变以及为前一个隐藏类优化的所有方法会变慢。相反，在对象构造函数中赋值对象的所有属性。
>3. 方法：重复执行相同方法的代码会比每次运行不同的方法的代码更快(多亏了内联缓存)。
>4. 数组：避免使用键不是递增数字的稀疏数组。里面没有包含所有元素的稀疏数组是一个哈希表。访问该数列中的元素会更加耗时。同样，试着避免预先分配大型数组。最好是随着使用而递增。最后，不要删除数列中的元素。这会让键稀疏。
>5. 标记值：V8 用 32 位来表示对象和数字。它使用一位来辨别是对象(flag=1)或者是被称为 SMI(小整数) 的整数(flag=0)，之所以是小整数是因为它是 31 位的。然后，如果一个数值比 31 位还要大，V8 将会装箱数字，把它转化为浮点数并且创建一个新的对象来存储这个数字。尽可能试着使用 31 位有符号数字来避免创建 JS 对象的耗时装箱操作。

## 参考文章
- [翻译参考文章](https://github.com/Troland/how-javascript-works/blob/master/v8.md)


<comment />
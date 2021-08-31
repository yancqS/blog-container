---
title: 深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系
description: 深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系
date: '2021-09-02'
author: Yoha
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210802155602.png
tags:
    - JavaScript
    - 转载
meta:
  - name: title
    content: 深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系
  - name: description
    content: 深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系
  - name: keywords
    content: EventLoop, 浏览器渲染, 帧动画, 空闲回调
  - name: author
    content: Yoha
featured: false
---

# 深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系

## 前言

关于 Event Loop 的文章很多，但是有很多只是在讲「宏任务」、「微任务」，我先提出几个问题：

1. 每一轮 Event Loop 都会伴随着渲染吗？
2. `requestAnimationFrame` 在哪个阶段执行，在渲染前还是后？在 `microTask` 的前还是后？
3. `requestIdleCallback` 在哪个阶段执行？如何去执行？在渲染前还是后？在 `microTask` 的前还是后？
4. `resize`、`scroll` 这些事件是何时去派发的。

这些问题并不是刻意想刁难你，如果你不知道这些，那你可能并不能在遇到一个动画需求的时候合理的选择 `requestAnimationFrame`，你可能在做一些需求的时候想到了 `requestIdleCallback`，但是你不知道它运行的时机，只是胆战心惊的去用它，祈祷不要出线上 bug。

这也是本文想要从规范解读入手，深挖底层的动机之一。本文会酌情从规范中排除掉一些比较晦涩难懂，或者和主流程不太相关的概念。更详细的版本也可以直接去读这个规范，不过比较费时费力。

> 其实我看到这个地方的时候就知道这篇文章值得一读，因为它不是单纯讲进程、线程、JS事件循环（宏任务、微任务）的文章。前言中提到的问题确实不太熟悉，说不知道吧了解一点，说知道吧，也不能很明确的说出来。是时候梳理一波了。对文章作者公众号『 前端从进阶到入院』表示感谢~~

## 事件循环

我们先依据[HTML 官方规范](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)从浏览器的事件循环讲起，因为剩下的 API 都在这个循环中进行，它是浏览器调度任务的基础。

### 定义

为了协调时间，用户交互，脚本，渲染，网络任务等，浏览器必须使用本节描述的事件循环。

### 流程

1. 从任务队列中取出一个**宏任务**并执行；

2. 检查微任务队列，执行并清空**微任务**队列，如果在微任务的执行中又加入新的微任务，也会在这一步一起执行。

3. 进入更新渲染阶段，判断是否需要渲染，这里有一个`rendering opportunity`的概念，也就是说：**不一定每一轮event loop都会对应一次浏览器渲染**，要根据其屏幕刷新率、页面性能、页面是否在后台运行来共同决定。通常来说，这个渲染间隔是固定的。（所以多个task很可能在一次渲染之间执行）

   - 浏览器会尽可能的保持帧率稳定，例如页面性能无法维持60fps（每16.66ms渲染一次）的话，那么浏览器会选择30fps的更新速率，而不是偶尔丢帧。
   - 如果浏览器上下文不可见，那么页面帧率会降低到4fps左右甚至更低。
   - 如果满足以下条件，也会跳过渲染：
     - 浏览器判断更新渲染不会带来视觉上的改变，且
     - `map of animation frame callback`为空，也就是帧动画回调为空，可以通过`requestAnimationFrame`来请求帧动画。

4. 如果上述的判断决定本轮不需要渲染，那么下面的几步（5-9）也**不会**继续运行：

   > This step enables the user agent to prevent the steps below from running for other reasons, for example, to ensure certain tasks are executed immediately after each other, with only microtask checkpoints interleaved (and without, e.g., animation frame callbacks interleaved). Concretely, a user agent might wish to coalesce timer callbacks together, with no intermediate rendering updates. 有时候浏览器希望两次「定时器任务」是合并的，他们之间只会穿插着 `microTask`的执行，而不会穿插屏幕渲染相关的流程（比如`requestAnimationFrame`，下面会写一个例子）。

5. 对于需要渲染的文档，如果窗口大小发生了变化，执行监听的`resize`方法。

6. 对于需要渲染的文档，如果页面发生了滚动，执行`scroll`方法。

7. 对于需要渲染的文档，执行帧回调动画，也就是`requestAnimationFrame`的回调。

8. 对于需要渲染的文档，执行`IntersectionObserve`的回调。

9. 对于需要渲染的文档，***重新渲染***绘制用户界面。

10. 判断`task队列`和`microTask`队列是否都为空，如果是的话，则进行`Idle`空闲周期的算法，判断是否要执行`requestIdleCallback`的回调函数。

对于`resize` 和 `scroll`来说，并不是到了这一步才去执行滚动和缩放，那岂不是要延迟很多？浏览器当然会立刻帮你滚动视图，根据[CSSOM 规范](https://drafts.csswg.org/cssom-view/#scrolling-events)所讲，浏览器会保存一个 `pending scroll event targets`，等到事件循环中的 `scroll`这一步，去派发一个事件到对应的目标上，驱动它去执行监听的回调函数而已。`resize`也是同理。

可以在这个流程中仔细看一下「宏任务」、「微任务」、「渲染」之间的关系。

## 多任务队列

`task`队列并不是像我们想象的那样只有一个，根据规范里的描述：

> An event loop has one or more task queues. A task queue is a set of tasks. For example, a user agent could have one task queue for mouse and key events (to which the user interaction task source is associated), and another to which all other task sources are associated. Then, using the freedom granted in the initial step of the event loop processing model, it could give keyboard and mouse events preference over other tasks three-quarters of the time, keeping the interface responsive but not starving other task queues. Note that in this setup, the processing model still enforces that the user agent would never process events from any one task source out of order.

事件循环中可能会有一个或多个任务队列，这些队列分别为了处理：

1. 鼠标和键盘事件
2. 其他一些Task

浏览器会在保持任务顺序的前提下，可能会分配四分之三的优先权给鼠标和键盘事件，保证用户的输入得到最高优先级的响应，而剩下的优先级交给其他`Task`，并且保证不会『饿死』它们。

这个规范也导致 Vue 2.0.0-rc.7 这个版本 `nextTick` 采用了从微任务 `MutationObserver` 更换成宏任务 `postMessage` 而导致了一个 [Issue](https://github.com/vuejs/vue/issues/3771)。

---

非原文

下面为具体回答：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210830195538.png)

---

目前由于一些“未知”的原因，jsfiddle 的案例打不开了。简单描述一下就是采用了 `task` 实现的 `nextTick`，在用户持续滚动的情况下 `nextTick` 任务被延后了很久才去执行，导致动画跟不上滚动了。

迫于无奈，尤大还是改回了 `microTask` 去实现 `nextTick`，当然目前来说 `promise.then` 微任务已经比较稳定了，并且 Chrome 也已经实现了 `queueMicroTask` 这个官方 API。不久的未来，我们想要调用微任务队列的话，也可以节省掉实例化 `Promise` 在开销了。

从这个 Issue 的例子中我们可以看出，稍微去深入了解一下规范还是比较有好处的，以免在遇到这种比较复杂的 Bug 的时候一脸懵逼。

下面的章节中咱们来详细聊聊 `requestIdleCallback` 和 `requestAnimationFrame`。

## requestAnimationFrame

> 以下内容中`requestAnimationFrame` 简称 `rAF`

在解读规范的过程中，我们发现`requestAnimationFrame`的回调有两个特征：

1. 在重新渲染前调用
2. 很可能在宏任务之后不调用

> 非原文：第二点主要是因为：不一定每一轮event loop都会对应一次浏览器渲染

我们来分析一下，为什么要在重新渲染前调用？因为`rAF`是官方推荐来做一些流畅动画说应该使用的API，做动画不可避免的会去更改DOM，而如果在渲染之后再去更改DOM，那就只能在下一次渲染机会的时候才能去绘制出来，这显然是不合理的。

`rAF`在浏览器决定渲染之前给你最后一个机会去改变DOM属性，然后很快在接下来的绘制中帮你呈现出来，所以这是做流畅动画的不二选择。下面我用一个`setTimeoue`的例子来对比。

### 闪烁动画

假设我们现在想要

<video src="https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210831005757.mp4" controls width="100%" height="460px"></video>

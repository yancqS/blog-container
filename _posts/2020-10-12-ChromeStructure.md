---
title: Chrome浏览器架构
description: DOM编程
date: '2020-10-12'
author: Yoha
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201008220027.png
tags:
    - 转载
meta:
  - name: title
    content: Chrome浏览器架构
  - name: description
    content: Chrome浏览器架构
  - name: keywords
    content: Chrome浏览器架构
  - name: author
    content: Yoha
featured: true
---

# Chrome 浏览器架构

## 背景

这篇文章被收录在我的前端技术系列文章中浏览器工作原理栏目中，做为这个栏目的第一篇文章，先从页面是如何在浏览器中被显示出来这一最常见的问题做为开始，整体介绍浏览器的工作原理。这篇文章取材于[Mariko Kosaka](https://developers.google.com/web/resources/contributors/kosamari)在2018年9月发表在Chrome开发者文档中的[Inside look at modern web browser](https://developers.google.com/web/updates/2018/09/inside-browser-part1)系列文章，同时结合我自己的理解。如果你对浏览器如何将代码转化成页面，这正适合于你。

## CPU与GPU

### CPU

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201008220027.png)

CPU是计算机的大脑，负责处理各种不同的任务。在过去，大多数CPU是单芯片的，核心被安置在同一个芯片上。更新的CPU可以支持多核心，运算能力大大加强。而最新的的cpu已经达到10核心20线程数的能力了。

### GPU

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201008223928.png)

GPU是另一个计算机的组成部分，与CPU不同，GPU更擅长利用多核心同时处理单一的任务。像命名那样，GPU最初被用于处理图像。这就是为什么使用GPU可以更快、更顺畅的渲染页面内容。随着GPU的发展，越来越多的计算任务也可以使用GPU来处理。甚至有人说GPU是人工智能的大功臣，可见GPU已经不再仅用于图像处理上了。

## 计算机架构

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201008224214.png)

我们可以把计算机自下而上分成三层：硬件、操作系统和应用。有了操作系统的存在，上层运行的应用可以使用操作系统提供的能力使用硬件资源而不会直接访问硬件资源。

### 进程与线程

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201009213037.png)

一个进程是应用正在运行的程序。而线程是进程中更小的一部分。当应用被启动，进程就被创建出来。程序可以创建线程来帮助其工作。操作系统会为进程分配私有的内存空间以供使用，当关闭程序时，这段私有的内存也会被释放。其实还有比线程更小的存在就是协程，**而协程是运行在线程中更小的单位。async/await就是基于协程实现的**。

>进程是系统进行资源分配的最小单位，线程是系统能够进行运算调度的最小单位。线程隶属于进程，被包含于进程之中。

### 进程间通信(IPC)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201009220604.png)

一个进程可以让操作系统开启另一个进程处理不同的任务。当两个进程需要通信时，可以时用IPC(Inter Process Communication)。

多数程序被设计成使用IPC来进行进程间的通信，好处在于当一个进程给另一个进程发消息而没有回应时，并不影响当前的进程继续工作。

## 浏览器架构

借助进程和线程，浏览器可以被设计成单进程、多线程架构，或者利用IPC实现多进程、多线程架构。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201009222127.png)

这里我们以Chrome多进程架构介绍，在Chrome中存在不同类型的进程，它们各司其职。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201009225900.png)

**浏览器进程做为Chrome中最核心的进程管理着Chrome中的其他进程，而Renderer则负责渲染不同的站点。**

>浏览器是多进程的，有一个主控进程，以及每一个tab页都会新开一个进程。
>进程可能包括主控进程（浏览器进程）、渲染进程、插件进程、GPU进程。

### 进程工作内容

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201009230651.png)

- 浏览器进程(Browser process)

    浏览器进程负责管理Chrome应用本身，包括地址栏、书签、前进和后退按钮。同时也负责可不见的功能，比如网络请求、文件按访问等，也负责其他进程的调度。
    
- 渲染进程（Renderer process）

    渲染进程负责站点的渲染，其中也包括JavaScript代码的运行，web worker的管理等。
    
    >非原文：每一个tab页可以看作是一个渲染进程，这个进程是多线程的，它有几大类子线程：GUI渲染线程、JS引擎线程、事件触发线程、定时器触发线程、异步http请求线程。

- 插件进程（Plugin process）

    插件进程负责为浏览器提供各种额外的插件功能，例如flash。
    
- GPU进程（GPU process）

    GPU进程负责提供成像的功能。
    
当然还有其他像扩展进程或工具进程等其他进程，可以在Chrome的Task Manager面板中查看，面板中列出了运行的进程和其占用的CPU、内存情况。

### 多进程架构的好处

当我们访问一个站点时，渲染进程会负责运行站点的代码，渲染站点的页面，同时响应用户的交互动作，当我们在Chrome中打开三个页签同时访问三个站点时，如果其中一个没有响应，我们可以关闭它然后使用其他的页签，这是因为Chrome为每个站点创建一个独立的渲染进程，专门处理当前站点的渲染工作。如果所有的页面运行在同一个进程中，当有一个页面没有响应时，所有的页面就都卡住了。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201011145005.png)

另一个好处是，借助操作系统对进程安全的控制，浏览器可以将页面放置在沙箱中，站点的代码可以运行在隔离的环境中，保证核心进程的安全。

虽然多进程的架构优于单进程架构，但由于进程独享自己的私有内存，以渲染进程为例，虽然渲染的站点不同，但工作内容大体相似，为了完成渲染工作它们会在自己的内存中包含相同的功能，例如V8引擎（用于解析和运行Javascript），这意味着这部分相同的功能需要占用每个进程的内存空间。为了节省内存，Chrome限制了最大进程数，最大进程数取决于硬件的能力，同时**当使用多个页签访问相同的站点时浏览器不会创建新的渲染进程**。

### 面向服务的架构

Chrome将架构从多进程模型转变成面向服务。浏览器将功能以服务的方式提供，以解决多进程架构中的问题。

当Chrome运行在拥有强大硬件的计算机上时，会将一个服务以多个进程的方式实现，提高稳定性，当计算机硬件资源紧张时，则可以将多个服务放在一个进程中节省资源。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201012214222.png)

### 基于站点隔离的渲染进程

利用iframe我们可以在同一个页面访问不同站点的资源，但从安全的角度考虑，同源策略不允许一个站点在未得到同意的情况下访问其他站点的资源，所以从Chrome 67开始每个站点由独立的渲染进程处理被默认启用。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201012214535.png)

### 浏览器进程

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201012214907.png)

浏览器进程负责处理除了渲染外的大部分工作，浏览器进程包括几个线程：
- UI 线程负责绘制工具栏中的按钮、地址栏等。
- 网络线程负责从网络中获取数据。
- 存储线程负责文件等功能。

当我们在地址栏中输入一个地址时，浏览器进程中的UI线程最先得知这个动作，并开始处理。

### 一次访问

下面我们就从一次常见的访问入手，逐步了解浏览器是如何展示页面的。

**Step1: 输入处理**

当我们在地址栏中输入时，UI线程会先判断我们输入的内容是要搜索的内容还是要访问一个站点，因为地址栏同时也是一个搜索框。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201012215641.png)

**Step2: 访问开始**

当我们按下回车开始访问时，UI线程将借助**网络线程**访问站点资源. 浏览器页签的标题上会出现加载中的图标，同时网络线程会根据适当的网络协议，例如DNS lookup和TLS为这次请求建立连接。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201012221507.png)

当服务器返回给浏览器重定向请求时，网络线程会通知UI线程需要重定向，然后会以新的地址做开始请求资源。

**Step3: 处理响应数据**

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201012221635.png)

当网络线程收到来自服务器的数据时，会试图从数据中的前面的一些字节中得到数据的类型（Content-Type），以试图了解数据的格式。

当返回的数据类型是HTML时，会将数据传递给**渲染进程**做进一步的渲染工作。但是如果数据类型是zip文件或者其他文件格式时，会将数据传递给下载管理器做进一步的文件预览或者下载工作。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201012221906.png)

在开始渲染之前，**网络线程**要先检查数据的安全性，这里也是浏览器保证安全的地方。如果返回的数据来自一些恶意的站点，网络线程会显示警告的页面。同时，Cross Origin Read Blocking(CORB)策略也会确保跨域的敏感数据不会被传递给渲染进程。

**Step4: 渲染过程**

当所有的检查结束后，网络线程确信浏览器可以访问站点时，网络线程通知UI线程数据已经准备好了。UI线程会根据当前的站点找到一个渲染进程完成接下来的渲染工作。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201012223325.png)

在**Step2: 访问开始**，UI线程将请求地址传递给网络线程时，UI线程就已经知道了要访问的站点。此时UI线程就可以开始查找或启动一个渲染进程，这个动作与让网络线程下载数据是同时的。如果网络线程按照预期获取到数据，则渲染进程就已经可以开始渲染了，这个动作减少了从网络线程开始请求数据到渲染进程可以开始渲染页面的时间。当然，如果出现重定向的请求时，提前初始化的渲染进程可能就不会被使用了，但相比正常访问站点的场景，重定向往往是少数，在实际工作中，也需要根据特定的场景给出特定的方案，不必追求完美的方案。

**Step5: 提交访问**

经历前面的步骤，数据和渲染进程都已经准备好了。浏览器进程会通过IPC向渲染进程提交这次访问，同时也会保证渲染进程可以通过网络线程继续获取数据。一旦浏览器进程收到来自渲染进程的确认完毕的消息，就意味着访问的过程结束了，文档渲染的过程就开始了。

这时，地址栏显示出表明安全的图标，同时显示出站点的信息。访问历史中也会加入当前的站点信息。为了能恢复访问历史信息，当页签或窗口被关闭时，访问历史的信息会被存储在硬盘中。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201012224845.png)

**Extra Step: 加载完毕**

当访问被提交给渲染进程，渲染进程会继续加载页面资源并且渲染页面。当渲染进程"结束"渲染工作，会给浏览器进程发送消息，这个消息会在页面中所有子页面（frame）结束加载后发出，也就是onLoad事件触发后发送。当收到"结束"消息后，UI线程会隐藏页签标题上的加载状态图标，表明页面加载完毕。

但这里"结束"并不意味着所有的加载工作都结束了，因为可能还有JavaScript在加载额外的资源或者渲染新的视图。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201012225451.png)

### 访问不同的站点

一次普通的访问到此就结束了。当我们输入另外一个地址时，浏览器进程会重复上面的过程。但是在开始新的访问前，会确认当前的站点是否关心beforeunload事件。

beforeunload事件可以提醒用户是否要访问新的站点或者关闭页签，如果用户拒绝则新的访问或关闭会被阻止。

由于所有的包括渲染、运行Javascript的工作都发生在渲染进程中，浏览器进程需要在新的访问开始前与渲染进程确认当前的站点是否关心unload。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201019125720.png)

如果一次访问是从一个渲染进程中发起的，例如用户点击一个链接或者运行JavaScript代码`location = 'http://newsite.com'`时，渲染进程首先检查beforeunload。然后再执行和浏览器进程初始化访问同样的步骤，只不过区别在于这样的访问请求是由渲染进程向浏览器进程发起的。

当新的站点请求被创建时，一个独立的渲染进程将被用于处理这个请求。为了支持像unload的事件触发，老的渲染进程需要保持住当前的状态。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201019131205.png)

### Service Worker

>非原文：Web工作者线程规范中定义了三种主要的工作者线程：专用工作者线程，共享工作者线程和服务工作者线程。（立个flag写一篇关于工作者线程文章）

Service worker是一种可以使web开发者控制缓存的技术。如果Service worker被实现成从本地存储获取数据时，那么原本的请求就不会被浏览器发送给服务器了。

值得注意的是，Service worker中的代码是运行在**渲染进程**中的。当访问开始时，网络线程会根据域名检查是否有Service worker会处理当前地址的请求，如果有，则UI线程会找到对应的渲染进程去执行Service worker的代码，而Service worker可以让开发者决定这个请求是从本地存储还是从网络中获取数据。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201019222958.png)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201019223745.png)

### 访问预加载

如果Service worker最终决定要从网络中获取数据时，我们会发现这种跨进程的通信会造成一些延迟。**Navigation Preload**是一种可以在Service worker启动的同时加载资源的优化机制。借助特殊的请求头，服务器可以决定返回什么样的内容给浏览器。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201019224158.png)

### 渲染进程负责页面的内容

渲染进程负责所有发生在浏览器页签中的事情。在一个渲染进程中，主线程负责解析，编译或运行代码等工作，当我们使用Worker时，Worker线程会负责运行一部分代码。合成线程和光栅线程是也是运行在渲染进程中的，负责更高效和顺畅的渲染页面。

>非原文：光栅线程数设最为大值，大部分网站页面都使用光栅图像，提高线程数可以提高网页文字及图片的加载速度。

渲染进程最重要的工作就是将HTML、CSS和Javascript代码转换成一个可以与用户产生交互的页面。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201019224518.png)

## 解析过程

下面的章节主要介绍渲染进程如何将从网络线程中获取的文本转化成图像的过程。

### DOM的创建

当渲染进程接收到来自浏览器进程提交访问的消息后就开始接受HTML数据，主线程开始解析HTML文本字符串，并且将其转化成Document Object Model（DOM）。

DOM是一种浏览器内部用于表达页面结构的数据，同时也为Web开发者提供了操作页面元素的接口，让web开发者可以在Javascript代码中获取和操作页面中的元素。

### 额外的资源加载

一个网站通常还会使用类似图片，样式文件和JavaScript代码等额外的资源。这些资源也需要从网络或缓存中获取。主线程在转化HTML的过程中理应挨个加载它们，但是为了提高效率，预加载扫描（Preload Scanner）与转换过程会同时运行着。当预加载扫描在分析器分析HTML过程中发现了类似img或link这样的标签时，就会发送请求给浏览器进程的网络线程，而主线程会根据这些额外资源是否会阻塞转化过程而决定是否等待资源加载完毕。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201020210042.png)

### JavaScript会阻塞转化过程

当HTML分析器发现`<script>`标签时，会暂停接下来的HTML转化工作，然后加载、解析并且运行Javascript代码。因为在Javascript代码中可能会使用类似`document.write`这样的API去改变DOM的结构。这就是为什么HTML分析器必须等待Javascript代码运行结束才能继续分析的原因。

### 告诉浏览器如何加载资源

如果我们的Javascript代码并不需要改变DOM，可以为`<script>`标签添加async或defer属性，这样浏览器就会异步的加载这些资源并且不会阻塞HTML转化过程。如果script标签是由JavaScript代码创建的，标签的async属性会默认为true。同时我们也可以使用一些预加载技术，比如`<link ref="preload">`来通知浏览器这些资源需要越快下载越好。

## 样式计算（Style calculation）

对于展示一个页面，光有DOM是不够的，因为我们还需要样式来让页面变得更美观。主线程会解析样式（CSS）并决定每个DOM元素的样式。这些样式取决于CSS选择器的范围，在浏览器开发者工具中我们可以看到这些信息。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201020211030.png)

即使我们没有给DOM指定任何的样式，`<h1>`标签也会比`<h2>`标签显示的大。这是因为浏览器为不同的标签内置了不同的样式。

### 布局

完成了样式计算工作后，渲染进程已经知道了DOM的结构和每个节点的样式，但是依然不足以渲染一个页面。想象一下，让你在电话中向朋友描述一张图：“图中有一个大红色圆和一个小的、蓝色的方块”是不足以让朋友知道这张图到底是什么样的。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201020211202.png)

布局是为元素指定几何信息的过程。主线程遍历DOM结构中的元素及其样式，同时创建出带有坐标和元素尺寸信息的布局树（Layout tree）。布局树的结构与DOM树的结构十分相似，但只包含将会在页面中显示的元素。当一个元素的样式被设置成`display: none`时，元素就不会出现在布局树中，但那些样式被设置成visiblility：hidden的元素会出现在布局树中。相似的，当我们使用一个包含内容的伪元素（例如`p::before { content: 'Hi!' }`）时，元素会出现在布局树中即使这个元素不存在于DOM树中，这也是为什么我们使用DOM提供的API无法获取伪元素的原因.

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201020211639.png)

描述页面布局信息是一项具有挑战性的工作，即使在只有块元素的页面中也必须要考虑字体的大小和在哪里换行，因为在计算下一个元素的位置时需要知道上一个元素的尺寸和形状。

### 绘制

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201020211910.png)

有了DOM、样式和布局还是无法完成渲染工作。试想，当我们试图复制一张图画。我们知道图画中元素的尺寸、形状和位置，**我们还需要知道绘制这些元素的顺序**。

例如，当一个元素z-index属性被设置后，绘制的顺序会导致渲染成错误的结果。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201020212028.png)

在这个阶段，主线程遍历布局树并创建绘制记录，绘制记录是一系列由绘制步骤组成的流程，例如先绘制背景，然后是文字，然后是形状。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201026191739.png)

### 渲染过程是昂贵的

在渲染过程中，任何一个步骤中产生的数据变化都会引起后续一系列的的变化。例如，当布局树改变时，绘制需要重构页面中变化的部分。

当一些元素有动画发生时，浏览器需要在每一帧中绘制这些元素。当无法保证每一帧绘制的连续性时，用户就会感觉到卡顿。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201027214750.png)

正常情况下渲染操作可以与屏幕刷新保持同步，但由于这些操作运行在主线程中，也就意味这些操作可能被正在运行的Javascript代码所阻塞。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201027215115.png)

为了不影响渲染操作，我们可以将Javascript操作优化成小块，然后使用requestAnimationFrame()。当需要大量计算时，也可以使用Worker来避免阻塞主进程。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201027220145.png)

### 合成

现在，浏览器已经知道了文档结构、每一个元素的样式，元素的几何信息，绘制的顺序。将这些信息转化成屏幕上像素的过程叫做光栅化，光栅化是图形学的范畴。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201029113842.gif)

传统的做法是将可视区域的内容进行光栅化。随着用户滚动页面，不断的光栅化更多的区域。然而对于现代浏览器，有着更复杂的的过程，这个过程被称做合成。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201029114602.gif)

合成是一种将页面拆分成多层的技术，合成线程可以将各个层在不同线程中光栅化，再组合成一个页面。当滚动时，如果层已经被光栅化，则会使用已经存在的层合成新的帧，动画则可以通过移动层来实现。

### 层

为了决定层包含哪些元素，主线程需要遍历布局树以找到需要生成的部分。对开发者来说，当某一部分需要用独立的层渲染，我们可以使用css属性will-change让浏览器创建层，关于浏览器如何生成层的标准可自行查阅。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201029145539.png)

虽然通过分层可以优化浏览器性能，但并不意味着应该给每个元素一个层，过多的层反而影响性能，所以在层的划分上应该具体形况具体分析。

### 栅格线程和合成线程

当布局树和绘制顺序确定以后，主线程会将这些信息提交给合成线程。合成线程会光栅化各个层。一个层包含的内容可能是一个完整的页面，也可能是页面的部分，所以合成线程将层拆分成许多块，并将它们发送给栅格线程。栅格线程光栅化这些块并将它们存储在GPU缓存中。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201029151342.png)

合成线程可以决定栅格线程光栅块的优先级，这样可以保证用户能看到的部分可以先被光栅化。一个层也会包含多种块以支持类似缩放这样的功能。

当块被光栅化后，合成线程会使用draw quads收集这些信息并创建合成帧（Compositor frame）。

### Draw quads

存储在缓存中，包含类似块位置这样的信息，用于描述如何使用块合成页面。

### Compositor frame

用于存储表现页面一帧中包含哪些Draw quads的集合。

然后一个合成帧被提交给浏览器进程。这时如果浏览器UI有变化，或者插件的UI有变化时，另一个合成帧就会被创建出来。所以每当有交互发生时，合成线程就会创建更多的合成帧然后通过GPU将新的部分渲染出来。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201029153037.png)

合成的好处在于其独立于主线程。合成线程不需要等待样式计算和Javascript代码的运行。这也是为什么合成更适合优化交互性能，但如果布局或者绘制需要重新计算则主线程是必须要参与的。

本质上，浏览器的渲染过程就是将文本转换成图像的过程，而当用户与页面发生交互动作时，则显示新的图像。在这个过程中由渲染进程中的主线程完成计算工作，由合成线程和栅格线程完成图像的绘制工作。而在计算过程中，还有强制布局、重排、重绘等更加细节的概念会在后面的文章中做讲解。

## 从浏览器的角度看事件

当我们听到事件时，通常会联想到在一个文本框中输入或者单击鼠标，但从浏览器的角度看，输入事件意味着所有的用户动作。鼠标滚轮滚动或者屏幕触摸都是输入事件。

当用户与页面发生交互时，浏览器进程首先接收到事件，然而，浏览器进程只关心事件发生时是在哪个页签中，所以浏览器进程会将事件类型和位置信息等发送给负责当前页签的渲染进程，渲染进程会恰当的找到事件发生的元素并且触发事件监听器。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201029153345.png)

## 合成线程对事件的处理

在前面的章节中，我们知道了合成线程可以通过合成技术合成不同的光栅层优化性能，如果页面并不监听任何事件，合成线程可以完全独立于主线程生成新的合成帧。但如果页面监听了事件呢？

### 标记“慢滚动”区域

由于运行Javascript是主线程的工作，当页面被合成线程合成过，合成线程会标记那些有事件监听的区域。有了这些信息，当事件发生在响应的区域时，合成线程就会将事件发送给主线程处理。如果在非事件监听区域，则渲染进程直接创建新的帧而不关心主线程。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201029155026.png)

### 在事件监听时标记

在web开发中常见的方式就是事件代理。利用事件冒泡，我们可以在目标元素的上层元素中监听事件。参照下面的代码。

```javascript
document.body.addEventListener('touchstart', event => {
  if (event.target === area) {
    event.preventDefault();
  }
});
```

通过这种写法，可以更高效的监听事件。但如果从浏览器的角度看，此时整个页面会被标记成“慢滚动”区域。这意味着虽然页面中的某些部分并不需要事件监听，但合成线程依然要在每次交互发生后等待主线程处理事件，合成线程的优化效果不复存在。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201029155525.png)

为了解决这个问题，我们可在事件代理时传入passive: true(IE不支持)参数。这样告诉渲染线程，依然需要将事件发送给主线程处理，但不需要等待。

```javascript
document.body.addEventListener('touchstart', event => {
    if (event.target === area) {
        event.preventDefault()
    }
 }, {passive: true});
```

### 查找事件目标

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201029161032.png)

当渲染线程将事件发送给主线程后，第一件事就是找到事件触发的目标。通过在渲染过程中生成的绘制信息，可以根据坐标找到目标元素。

### 减少发送给主线程的事件数量

为了保证动画的顺畅，需要显示器在每秒刷新60次。对于典型的触摸事件由合成线程提交给主线程的事件频率可以达到每秒60-120次，对于典型的鼠标事件每秒会发送100次。事件发送的频率通常比屏幕刷新频率要高。

如果类似`touchmove`这样的事件每秒向主线程发送120次可能会造成主线程执行时间过长而影响性能。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201029161156.png)

为了减少发送给主线程的事件数量，Chrome合并了连续的事件。类似`wheel`，`mousewheel`，`mousemove`，`pointermove`，`touchmove`这样的事件会被延迟到下一次requestAnimationFrame前触发.

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201029161318.png)

而任何的离散事件，类似`keydown`, `keyup`, `mouseup`, `mousedown`, `touchstart`和 `touchend`都会立即被发送给主线程处理。


## 总结

到此，我们已经可以通过从用户在浏览器地址栏中的一次输入到页面图像的显示了解浏览器是如何工作的。这里我们总结一下。

- 浏览器进程做为最重要的进程负责大多数页签外部的工作，包括地址栏显示、网络请求、页签状态管理等。
- 不同的渲染进程负责不同的站点渲染工作，渲染进程间彼此独立。
- 渲染进程在渲染页面的过程中会通过浏览器进程获取站点资源，只有安全的资源才会被渲染进程接收到。
- 渲染进程中主线程负责除了图像生成外绝大多数工作，如何减少主线程上代码的运行是交互性能优化的关键。
- 渲染进程中的合成线程和栅格线程负责图像生成，利用分层技术可以优化图像生成的效率。
- 当用户与页面发生交互时，事件的传播途径从浏览器进程到渲染进程的合成线程再根据事件监听的区域决定是否要传递给渲染进程的主线程处理。


## 最后

转载于[Chrome 浏览器架构](https://xie.infoq.cn/article/5d36d123bfd1c56688e125ad3)


<comment />
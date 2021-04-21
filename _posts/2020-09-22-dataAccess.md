---
title: 高性能JavaScript——第二章
description: DOM编程
date: '2020-09-22'
author: Yoha
location: Beijing
image: https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200828171746.jpeg
tags:
    - 读书笔记
    - JavaScript
meta:
  - name: title
    content: 高性能JavaScript——第二章
  - name: description
    content: 数据存取
  - name: keywords
    content: 数据存取, 高性能JavaScript
  - name: author
    content: Yoha
featured: true
---
# 第二章 数据存取

计算机科学中有一个经典的问题是通过改变数据的存储位置来获得最佳的读写性能，数据的存储位置关系到代码执行过程过程中数据的检索速度。

通常的建议是，如果在乎运行速度，那么尽量使用字面量和局部变量，减少数组项和对象成员的访问。为此有几种模式来定位和规避问题，以及优化代码。

## 管理作用域

作用域对JavaScript有许多影响，从确定哪些变量可以被函数访问，到却确定this的赋值。JavaScript作用域同样关系到性能，要理解速度和作用域的关系，首先要正确的理解作用域的工作原理。

每一个JavaScript函数都可以表示为一个对象，更确切地说，是Function对象的一个实例。

---

在这仔细说一下（非书中内容）：

其实一个普通的函数，就是通过new Function()来创建的。

```javascript
function fn(x, y) {
    return x + y;
}

let fn1 = new Function('x', 'y', 'return x + y;');
```

因此function是一个对象，并且fn.\_\_proto\_\_ === Function.prototype

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200828163310.jpg)

进一步深入：Function也是一个构造函数，因此是Function自己创造了自己。于是有：

Function.\_\_proto\_\_ === Function.prototype

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200828163640.jpg)

这个时候必上一张图：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200828171746.jpeg)

**这个图是真滴nice！！！**

---

Function对象同其他对象一样，拥有可以编程访问的属性，和一系列不能通过代码访问而仅供JavaScript引擎存取的内部属性。其中有一个内部属性[[Scope]]。

**内部属性[[Scope]]包含了一个函数被创建的作用域中对象的集合。*这个集合被称为作用域链*，它决定哪些数据能被函数访问**。函数作用域中的每个对象被称为一个可变对象，每个可变对象都以“键值对”的形式存在。当一个函数创建后，它的作用域链会被创建此函数的作用域中可访问的数据对象所填充。例如，思考下面的的全局函数：

```javascript
function add(num1, num2) {
    debugger
    let sum = num1 + num2;
    return sum;
}
```

当函数add()创建时，它的作用域链中就插入了一个对象变量，这个全局对象代表着在全局范围内定义的变量。该全局对象中包含诸如window、navigator和document等。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200914171625.jpg)

<center style='color: #ccc'>真想说一句:禁止套娃0.0</center>

再画一个简单的示意图:

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200914173848.jpg)

函数add的作用域将会在执行时用到。假设执行下面的代码

```javascript
add(5,10);
```

执行此函数时会创建一个称为**执行环境**(execution context,也可以称为执行上下文)的**内部对象**。一个执行环境定义了一个函数执行时的环境。函数每次执行时对应的执行环境都是独一无二的，所以多次调用同一个函数就会导致创建多个执行环境。当函数执行完毕，执行环境就会被销毁。

**每个执行环境都有自己的作用域**，用于解析标识符。当执行环境被创建时，它的作用域链初始化为当前运行函数的[[Scope]]属性中的对象。这些值按照它们出现在**函数中**的顺序，被复制到执行环境的作用域链中。这个过程一旦完成，一个被称为“**活动对象**(activation object)”的新对象就为执行环境创建好了。

简单的示意图如下：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200916210611.jpg)

活动对象作为函数运行时的变量对象，包含了所有局部变量、命名参数、参数集合以及this。**然后此对象被推入作用域链的最前端**。当执行环境被销毁，活动对象也随之销毁。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20200914220442.png)

在执行这样一段代码：

```javascript
function add(num1, num2) {
    let sum = num1 + num2;
    function add2(num3, num4) {
        debugger
        return num3 * 2 + num4 + sum;
    }
    let sum2 = add2(sum, 66);
    return sum2;
}

add(5, 10);
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20200914224820.png)

如上图，在调用add函数时，创建了一个执行环境，这个执行环境的作用域链初始化为当前运行函数add的[[Scope]]属性中的对象。然后再看一下，执行add2这个函数时所创建的执行环境，add2的执行环境被创建时也同样有自己的作用域，也同样把执行环境的作用域链初始化为当前运行函数add2的[[Scope]]属性中的对象。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20200914224834.png)

在函数的执行过程中，每遇到一个变量，都会经历一次标识符解析过程以决定从哪里获取或存储数据。该过程搜索执行环境的作用域链，查找同名的标识符。搜索过程从作用域链头部开始，也就是当前运行函数的**活动对象**。如果找到，就会使用这个标识符对应的变量；如果没找到，继续搜索作用域链中的下一个对象。搜索过程会持续进行，直到找到标识符，若无法搜索到匹配的对象，那么标识符视为未定义。在函数执行过程中，每个标识符都要经历这样的搜索过程。在前面的代码示例中，函数访问sum、num1、num2时都会产生搜索过程，正是这个过程影响了性能。

>如果名字相同的两个变量存在于作用于链的不同部分，那么标识符就是遍历作用域时最先找到的那个，也可以说，第一个变量遮蔽(shadow)了第二个。

## 标识符的解析性能

标识符的解析是由代价的，在执行环境的作用域链中，一个标识符所在的位置越深，它的读写速度也就越慢。全局变量总处于作用域链的最末端。也就是说，要尽可能的使用局部变量。

举个例子：

```javascript
function initUI() {
    let bd = document.body,
        links = document.getElementsByTagName('a'),
        i = 0,
        len = links.length;
        
    while(i < len) {
        update(links[i++]);
    }
    
    document.getElementById('g0-btn').onclick = function() {
        start()
    }
    
    bd.className = 'active';
}
```

这个函数引用了三次document,而document是个全局对象。可以优化一下,**把document对象的引用存储到局部变量doc中**。

```javascript
...
let doc = document,
    bd = doc.body,
    links = doc.getElementsByTagName('a'),
    i = 0,
    len = links.length;
...
```

## 改变作用域链

一般来说，一个执行环境的作用域链是不会改变的，但是有两个语句可以在执行时临时改变作用域链。第一个是with语句。

```javascript
function initUI() {
    with(document) {
        let bd = body,
            links = getElementsByTagName('a'),
    ...
    }
}
```

这样看来确实避免了多次写document，看上去更高效。而实际上产生了一个性能问题。**当代吗执行到with语句时，执行环境的作用域链临时被改变了。一个新的对象被创建，它包含参数指定的对象的所有属性。这个对象被推入作用域的首位，这就意味着函数的所有局部变量现在处于第二个作用域链对象中。因此访问的代价更高啦。**

第二个语句是try-catch语句的catch字句也具有同样的效果。当try代码块中发生错误，执行过程会自动跳转到catch子句，然后把异常对象推入一个变量对象并置于作用域的首位。在catch代码块内部，函数所有局部变量将会放在第二个作用域链对象中。

>注意：一旦catch子句执行完毕，作用域链就会返回到之前的状态。

一般推荐尽量简化代码使得catch子句对性能的影响最小。推荐的做法是将错误委托给一个函数来处理。

## 闭包、作用域和内存

闭包是JavaScript最强大的特性之一，它允许函数访问局部作用域之外的数据。然而，闭包的使用可能会导致性能问题。

>闭包指的是那些引用了另一个函数作用域中变量的函数。

```javascript
function assignEvents() {
    let id = 'xdi9592';
    
    document.getElementById('save-btn').onclick = function(event) {
        saveDocument(id);
    }
}
```

这个事件处理函数就是闭包，**它在assignEvents函数执行时创建**，并且能够访问所属作用域的id变量。为了让这个闭包访问id，必须创建一个特定的作用域。

当assignEvents()函数执行时，一个包含了id以及其他数据的活动对象被创建。它成为执行环境作用域链中的第一个对象，全局对象紧随其后。**当闭包被创建时，它的[[Scope]]属性倍初始化为这些对象**。如下图：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200921131146.jpg)

通常来说，函数的活动对象在函数执行完后，随着执行环境一同销毁。但是引入闭包后，由于闭包的[[Scope]]属性包含了与执行环境作用域链相同的对象引用，会导致函数的活动队对象无法被销毁。

当闭包代码执行时，会创建一个执行环境，它的作用域链与属性[[Scope]]中所引用的两个相同的作用域链对象一起被初始化，然后一个活动对象为闭包自身所创建。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200921171431.jpg)

>在闭包中用到两个标识符id和saveDocument，它们的位置在作用域链的第一个对象之后，这就会导致频繁访问跨作用域的标识符，每次访问都会带来性能问题。解决办法在之前提到过：把需要频繁访问的跨作用域的变量存储在局部变量中，然后直接访问局部变量。

## 原型

之前说到，访问对象内的成员的速度比访问字面量或者变量要慢。为了理解其原因，首先要理解JavaScript中对象的本质。javascript中的对象是基于原型的（可以看一下我说nice的那张图）。

因此，对象中可以存在两种成员类型：实例成员和原型成员，实例成员直接存在于对象实例中，原型成员则从对象原型继承过来。

```javascript
let book = {
    title: "High Performance JavaScript",
    publisher: "Yahoo! Press"
};
console.dir(book.toString());//"[object Object]"
```

这段代码中，对象book有两个实例成员：title、publisher。但其中并没有定于toString()方法，但方法可以顺利执行。这是因为toString()方法是有book对象从Object原型继承而来。

>book.\_\_proto\_\_ === Object.prototype;

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200922122720.jpg)

当book.toString()被调用时，会从对象实例中开始搜索名为"toString"的成员。如果在book中找不到toString的成员，那会继续搜索其原型对象，直到toString方法被找到并执行。

可以用hasOwnProperty()方法来判断对象是否包含特定的成员。要确定对象是否可以访问到特定的属性，可以使用in操作符。in操作符会在原型链上搜索。

```javascript
book.hasOwnProperty('title');//true
book.hasOwnProperty('toString');//false

Object.hasOwnProperty('toString');//true

console.log('title' in book);//true
console.log('toString' in book);//true
```

## 原型链

对象在原型链中的位置越深，找到它也就越慢。每深入一层原型链都会增加性能损失。搜索实例成员比从字面量或者局部变量中读取数据代价更大，再加上遍历原型链带来的开销，这让性能问题更加严重。

## 嵌套成员

由于对象成员可能包含其他成员，例如不太常见的写法：window.location.href。每次遇到点操作符，嵌套成员会导致JavaScript引擎搜索所有对象成员。对象成员嵌套越深，读取速度也就越慢。执行location.href总是比window.location.href要快。

如果这些属性不是实例属性，那么成员解析还要遍历原型链，这会花更多的时间。

## 缓存对象成员值

由于所有类似的性能问题都与对象成员有关，因此因该尽可能的避免使用他们。更确切的说，只在必要的时候使用对象成员。**比如，在同一个函数中没有必要多次读取同一个对象成员。**

```javascript
function hasEitherClass(element, className1, className2) {
    return element.className == className1 || element.className == className2;
}
```

上面这段代码中，element.className被读取了两次。很显然，在该函数语句中它的值并未改变，却执行了两次对象成员查找。可以把值保存在局部变量中来减少一次查找。

```javascript
function hasEitherClass(element, className1, className2) {
    let currentClassName = element.className;
    return currentClassName == className1 || currentClassName == className2;
}
```

>注：这种优化方法并不推荐用于对象的成员方法。因为许多对象方法使用this来判断执行环境，把一个对象方法保存在局部变量导致this绑定到window，而this值的改变会使得JavaScript引擎无法正确解析它的对象成员，进而导致程序出错。

## 总结

- 访问字面量和局部变量的速度最快，相反，访问数组元素和对象成员相对较慢。
- 由于局部变量存在于作用域链的起始位置，因此访问局部变量比访问跨作用域变量更快。变量在作用域链中的位置越深，访问所需时间越长。由于全局变量总处于作用域链的最末端，因此访问速度也是最慢的。
- 避免使用with语句，因为它会改变执行环境作用域链。同样tyr-catch语句的catch子语句也有同样的影响，因此要小心使用。
- 嵌套的对象成员会明显影响性能。
- 属性或方法在原型链中的位置越深，访问它的速度越慢。
- 通常来说，可以通过把常用的对象成员、数组元素、跨作用域变量保存在局部变量中来改善JavaScript性能，因为局部变量的访问速度最快。

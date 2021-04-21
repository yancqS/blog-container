---
title: 高性能JavaScript——第四章
description: 算法和流程控制
date: '2020-11-01'
author: Yoha
location: Beijing
image: https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201110205703.jpg
tags:
    - 读书笔记
    - JavaScript
meta:
  - name: title
    content: 高性能JavaScript——第四章
  - name: description
    content: 算法和流程控制
  - name: keywords
    content: 算法和流程控制, 高性能JavaScript
  - name: author
    content: Yoha
featured: true
---
# 第四章 算法和流程控制

## 循环性能

循环的类型：
- for循环
- while循环
- do-while循环
- for-in循环

在以上四种循环类型中，只有for-in循环比其他几种要慢一些。主要是因为每次迭代操作会同时搜索是实例或者原型属性，for-in循环的每次迭代都会产生更多的开销。

### 减少迭代的动作量

一个典型的数组处理可以采用三种循环中的任何一种。最常见的写法如下：

```javascript
for(let i = 0; i < arr.length; i++) {
    process(arr[i])
}


let j = 0;
while(j < arr.length) {
    process(arr[j++])
}

let k = 0;
do {
    process(arr[k++])
} while (k < arr.length)
```

优化循环的第一步是要减少对象成员及数组项的查找次数。正如第二章所讨论的，在大多数的浏览器中，这些操作比使用局部变量和字面量要花费更多的时间。上面的例子中每次循环都要查找item.length，这样做比较耗时，由于该值在循环过程中并未改变，因此产生了不必要的性能损失。所以优化如下：

```javascript
for(let i = 0, len = arr.length; i < len; i++) {
    process(arr[i]);
}

let j = 0, count = arr.length;
while(j < count) {
    process(arr[j++]);
}

let k = 0, num = arr.length;
do {
    process(arr[k++])
} while (k < num);
```

这样重写后的循环运行前对数组的长度进行一次属性查找。这使得控制条件可直接读取局部变量，所以速度更快。

测试如下：

```javascript
let arr = [];
for(let i = 0; i < 10000000; i++) {
    arr[i] = i;
}

let sum = 0;

function process(num) {
    if(num%3 === 0) sum += num;
}

console.time('arr.length')
for (let i = 0; i < arr.length; i++) {
    process(arr[i])
}
console.timeEnd('arr.length')

console.time('len')
for (let i = 0, len = arr.length; i < len; i++) {
    process(arr[i])
}
console.timeEnd('len')
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201102220113.png)

另外一种方法还可以是颠倒数组的顺序来提高循环性能。通常，数组项的顺序与所要执行的任务无关，因此从最后一项向前处理是个备选方案。

### 减少迭代的次数

循环体运行时会带来一次小的性能开销，这增加了总体运行时间。减少迭代次数能获得更加显著的性能提升。最广为人知的一种限制循环迭代次数的模式被称为“达夫设备(Duff's Device)”。

“Duff's Device”是一个循环体展开技术，它使得一次迭代中实际执行了多次迭代的操作。一个典型的实现如下：

```javascript
let iterations = Math.floor(item.length / 8),
    startAt = item.length % 8,
    i = 0;
    
    
/*书中的代码有问题，需补充下面一句代码*/
if(startAt === 0) iterations--;
    
do {
    switch(startAt) {
        case 0: process(item[i++]);
        case 7: process(item[i++]);
        case 6: process(item[i++]);
        case 5: process(item[i++]);
        case 4: process(item[i++]);
        case 3: process(item[i++]);
        case 2: process(item[i++]);
        case 1: process(item[i++]);
    }
    startAt = 0;
} while(--iterations)
```

>注意：每一个case是都没有break关键字。

Duff's Device背后的理念是：每次循环中最多可调用8次process()。循环迭代的次数为总数除以8.由于不是所有的数字都能被8整除，变量startAt用来存放余数，表示第一次循环中应调用多少次process()。比如：如果是12次循环，那么第一次循环会调用process()4次，第二次循环调用process()调用8次，用两次循环替代了12次循环。

>关于达夫设备可以看一下这片知乎回答[达夫设备(Duff's Device)效率真的很高吗？](https://www.zhihu.com/question/35676976?sort=created)。
>个人认为：达夫设备能实现的优化效果日趋在减弱，时代在变化，语言在发展，硬件设备在变化，编译器性能优化，除非特殊的需求下，一般还是没必要做像这种层次的性能考量的。不过，这种奇妙的 switch-case 写法经常研究一下还是很有乐趣的。

## 基于函数的迭代

forEach()方法：此方法遍历一个数字的所有成员，并在每个成员上执行一个函数。要执行的函数作为参数传给forEach，并在调用时传递3个参数，分别是：当前数组项的值、索引以及数组本身。

```javascript
console.time('foreach');
arr.forEach((item, index) => {
    process(item);
})
console.timeEnd('foreach');
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201103234444.png)

尽管基于函数的迭代提供了一个更为便利的迭代方法，但它仍然比基于循环的迭代要慢一些。**对于每个数组项调用外部方法所带来的开销是速度慢的主要原因。**

## 条件语句

其他语言对应该使用if-else语句还是switch语句的传统观点同样适用于javascript。

### if-else 对比 switch

使用if-else还是switch，最流行的方法是基于测试条件的数量来判断：条件数量越大，越倾向于使用switch而不是if-else。这通常归结于代码的易读性。

事实证明，大多数情况下switch比if-else运行的要快，但只有当条件数量很大时才快的明显。这两个语句的主要性能区别是：当条件增加时，if-else性能负担增加的程度比switch要多。因此，我们自然倾向于在条件数量较少时使用if-else，而在条件数量较大时使用switch，这从性能方面考虑也是合理的。

>大多数语言对switch语句的实现都采用了branch table（分支表）索引进行优化。在JavaScript中，switch语句比较值时使用全等操作符，不会发生类型转换的损耗。

### 优化if-else

优化if-else的目标是：最小化到达正确分支所需判断的条件数量。最简单的优化方法是确保最可能出现的条件放在首位。

另一种减少判断次数的方法是把if-else组织成一系列嵌套的if-else语句。使用单个庞大的if-else通常会导致运行缓慢，因为每个条件都要判断。可以使用二分法把值域分成一系列的区间，然后逐步缩小范围。

## 查找表

有些时候优化条件语句的最佳方案是避免使用if-else和switch。当有大量离散值需要测试时，if-else和switch比使用查找表慢很多。JavaScript中可以使用数组和普通对象来构建查找表，通过查找表访问数据比用if-else或switch快很多。

使用查找表相对于if-else和switch，不仅速度快，而且有时代码的可读性也更好。看下面的例子：

```javascript
switch(value) {
    case 0:
        return res0;
    case 1:
        return res1;
    case 2:
        return res2;
    case 3:
        return res3;
    case 4:
        return res4;
    case 5:
        return res5;
    case 6:
        return res6;
    case 7:
        return res7;
    case 8:
        return res8;
    case 9:
        return res9;
    default:
        return res10;
}
```

switch表达式代码所占的空间可能与它的重要性不成比例。整个结构可以用一个数组作为查找表来替代：

```javascript
let results = [res0, res1, res2, res3, res4, res5, res6, res7, res8, res9, res10];

return results[value];
```

当你使用查找表时，必须完全抛弃条件判断语句。这个过程编程数组项查询或者对象成员查询。查找表的一个主要优点是：不用书写任何条件判断语句，即使候选值数量增加时，也几乎不会产生额外的性能开销。

**当单个键和单个值之间存在逻辑映射时，查找表的优势就能体现出来。switch语句更适合于每个键都需要对应一个独特的动作或一系列动作的场合。**


## 递归

阶乘函数就是一个经典的递归：

```javascript
function factorial(n) {
    if(n === 0) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}
```

递归函数的潜在问题是终止条件不明确或者缺少终止条件会导致函数长时间运行，并使得用户界面处于假死状态。此外，递归函数还会受到浏览器的“调用栈大小限制”。

当遇到调用栈大小限制时，第一步应先检查代码中的递归实例。有两种递归模式值得注意。第一种：直接递归，比如上面的阶乘函数。另外一种称为“隐伏模式”，它包含两个函数：

```javascript
function first() {
    second();
}
function second() {
    first();
}
first();
```

这样两个函数相互调用，形成一个无限循环。

如果终止条件没问题，那么肯能是算法中包含了太多层递归，为了能在浏览器中安全的工作，可以使用**迭代、Memoization，或者结合两者使用**。

### 迭代

任何递归能实现的算法同样可以用迭代来实现。迭代算法通常包含几个不同的循环，分别对应计算过程的不同方面。使用优化后的循环替代长时间运行的递归函数可以提升性能，因为运行一个循环比反复调用一个函数的开销要少的多。

比如，归并排序算法是最常见的递归实现的算法。用如下JS代码实现一个简单的归并排序：

```javascript
function merge(left, right) {
    let result = [];
    while(left.length > 0 && right.length > 0) {
        if(left[0] < right[0]) {
            result.push(left.shift())
        } else {
            result.push(right.shift())
        }
    }
    return result.concat(left).concat(right)
}

function mergeSort(items) {
    if(item.length == 1) return items;
    let middle = Math.floor(item.length / 2),
        left = items.slice(0, middle),
        right = items.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}
```

mergeSort()函数会导致很频繁的自调用。一个长度为n的数组最终会调用2*n - 1次。这个归并排序算法同样可以用迭代实现，比如：

```javascript
function mergeSort(arr) {
    let len = arr.length;
    let lim, work = [];
    let i, j, k;
    if (len == 1) {
        return arr;
    }
    for (i = 0; i < len; i++) {
        work.push([arr[i]]);
    }
    work.push([]);
    for (lim = len; lim > 1;) {//lim为分组长度
        for (j = 0, k = 0; k < lim; j++, k = k + 2) {
          work[j] = merge(work[k], work[k + 1]);
        }
        work[j] = [];
        lim = Math.floor((lim + 1) / 2);
    }
    return work[0];
}
```

### Memoization

减少工作量就是最好的性能优化方案。代码要处理的事情越少，其运行速度也就越快。因此避免重复的工作是有意义的。Memoization正是一种避免重复工作的方法，它缓存前一个计算结果供后续计算使用，避免了重复工作。这使得它成为递归算法中有用的技术。

比如经典的斐波那契数列 `0 1 1 2 3 5 8 13 21 34 55 89....`

要求实现：fibonacci(1) 输出 0, fibonacci(2) 输出 1, fibonacci(3) 输出 1, fibonacci(10) 输出 34(第10个)

递归实现：

```javascript
function __fibonacci(n) {
    if (typeof n !== 'number' && n > 0) return null;
    if (n == 1) return 0;
    if (n == 2) return 1;
    return __fibonacci(n - 1) + __fibonacci(n - 2);
}
```

利用Memoization缓存结果：

```javascript
function _fibonacci(n) {
    if (typeof n !== 'number' && n > 0) return null;
    let res = [0, 1];
    if (n <= 2) return res[n - 1];
    let index = 3;
    while (index <= n) {
        res[index - 1] = res[index - 2] + res[index - 3];
        index++
    }
    return res[n - 1]
}
```

其实还可以继续优化，因为按照要求我们没必要维护一个长度为n的数组。

优化后：

```javascript
function fibonacci(n) {
    if (typeof n !== 'number' && n > 0) return null;
    let res = [0, 1];
    if (n <= 2) return res[n - 1];
    let index = 3;
    while (index <= n) {
        [res[0], res[1]] = [res[1], res[0] + res[1]]
        index++
    }
    return res[1]
}
```

当`n=40`时，这三种方法运算速度的比较如下：

```javascript
let n = 40
console.time('__fibonacci')
console.log(__fibonacci(n))
console.timeEnd('__fibonacci')

console.time('_fibonacci')
console.log(_fibonacci(n))
console.timeEnd('_fibonacci')

console.time('fibonacci')
console.log(fibonacci(n))
console.timeEnd('fibonacci')
```

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201110205703.jpg)

## 小结

javascript和其他编程语言一样，代码的写法和算法会影响运行时间。与其它语言不同的是，JavaScript可用资源有限，因此优化技术更为重要。

- for、while和do-while循环性能特性相当，并没有一种循环类型明显快于或慢于其他类型
- 避免使用for-in循环，除非需要遍历一个属性数量未知的对象
- 改善循环性能的最佳方式是减少每次迭代的运算量和减少循环迭代次数
- 通常来说，switch总数比if-else快，但并不总是最佳解决方案
- 在判断条件比较多时，使用查找表比if-else和switch更快
- 浏览器的调用栈大小限制了递归算法在JavaScript中的应用
- 如果遇到栈溢出的错误，可以将递归算法改为迭代算法，或使用Memoization来避免重复计算

<comment />
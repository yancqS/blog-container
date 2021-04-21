---
title: CommonJS 与 ES6 Module的区别
date: "2020-06-19"
author: Yoha
tags:
    - 前端开发
    - JavaScript
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017105512.jpeg
meta:
  - name: title
    content: CommonJS 与 ES6 Module的区别
  - name: description
    content: CommonJS 与 ES6 Module的区别
  - name: keywords
    content: CommonJS, ES6 Module, 区别
  - name: author
    content: Yoha
featured: true
---
# CommonJS 与 ES6 Module的区别

>主要参考书籍：《webpack实战：入门、进阶与调优》(微信读书)

## 静态和动态

cjs与esm最本质的区别在于前者对模块依赖的解决是“动态的”。而后者是“静态的”。在这里“动态”的含义是，模块依赖关系的建立发生在代码运行阶段；而“静态”则是模块依赖关系的建立发生在代码编译阶段。

先看一个cjs的例子

```javascript
//calculator.js
module.exports = {
  name: 'calculator'
};

//index.js
const name = require('./calculator.js').name
```

当index.js加载calculator.js时，会执行calculator.js中的代码，并将其module.exports对象作为require函数的返回值进行返回。并且require的模块路径可以动态指定，支传入一个表达式，我们甚至可以通过if语句判断是否加载某个模块。因此，在cjs模块被执行前，并没有办法确定明确的依赖关系，模块的导入、导出发生在代码的运行阶段。

同样的例子，我们对比一下esm的写法：

```javascript
//calculator.js
export const name = 'calculator';

//index.js
import { name } from './calculator.js'
```

esm的导入、导出语句都是声明式的，它不支持导入的路径是一个表达式，并且导入导出的语句必须位于模块的顶层作用域(比如不能放在if语句中)。因此，我们说esm是一种静态的模块结构，在ES6代码的编译阶段就可以分析出模块的依赖关系。

他相比于cjs来说具备以下几点优势：
  - 死代码检测和排除
  - 模块变量类型检查
  - 编译器优化。在cjs等动态模块系统中，无论采用哪种方式，本质上导入的都是一个对象，而esm支持直接导入变量，减少了引用层级，程序效率更高。

## 值拷贝和动态映射

在导入一个模块时，对于cjs来说获取的是一份导出值的拷贝；而在esm中则是值的动态映射，并且这个映射是只读的。

### cjs

```javascript
//calculator.js
var count = 0;
module.exports = {
  count: count,
  add: function(a,b) {
    count += 1;
    return a + b;
  }
}

//index.js
var count = require('./calculator.js').count;
var add = require('./calculator.js').add;

console.log(count);//0  (这里是对calculator.js中count值的拷贝)
add(2,3);
console.log(count);//0  (calculator.js中变量值得改变不会对这个拷贝值造成影响)
count += 1;
console.log(count);//1  (拷贝的值可以改变)
```

### esm

```javascript
//calculator.js
let count = 0;
const add = function(a,b) {
  count += 1;
  return a + b;
}
export { count, add }

//index.js
import { count, add } from './calculator.js'

console.log(count);//0  (对calculator.js中count值的映射)
add(2,3);
console.log(count);//1  (实时反映calculator.js中count值的变化)
//count += 1; //不可更改，会抛出SyntaxError: "count" is read-only
```

我们不可以对esm导入的变量进行更改，可以将这种映射关系理解为一面镜子，从镜子中可以实时观察到原有的事物，但是并不可以操纵镜子中的镜像。


<comment />
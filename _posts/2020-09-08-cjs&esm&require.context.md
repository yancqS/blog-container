---
title: 了解cjs、esm以及require.context
date: "2020-09-08"
author: Yoha
tags:
    - Javascript
    - 前端
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201016234622.jpeg
meta:
  - name: title
    content: 了解cjs、esm以及require.context
  - name: description
    content: 了解cjs、esm以及require.context
  - name: keywords
    content: CommonJS, ESModule, require.context
  - name: author
    content: Yoha
featured: true
---
# 了解cjs、esm以及require.context()

之前写了一篇文章——[CommonJS 与 ES6 Module的区别](https://yancqs.github.io/blog/2020/06/19/cjs-esm-import-diff/),主要写了一下cjs和esm特性的一些区别。

这篇文章的内容是对上一篇的一些补充，和在深入了解cjs和esm收获的一些知识。

## cjs模块的导入和导出

### cjs模块导出

在cjs中，通过module.exports可以导出模块中的内容，如：

```javascript
module.exports = {
    name: 'yoha',
    add: (a, b) => a + b;
}
```

cjs模块内部会有一个module对象用于存放当前模块的信息。在每个模块最开始定义了一下对象：

```javascript
let module = {
    exports: {}
}
```

验证一下：

```javscript
//addSum.js
console.log(module);
```

```javscript
//index.js
console.log(require('./addSum.js'), 'addSum');
```

>注意：导出模块语句不代表模块的末尾，在module.exports或exports后面的代码依旧会照常执行。

控制台打印：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200902131627.jpg)

由此可知：其一，require函数返回的值是module.exports的值；其二，在cjs模块内部最开始就会有一个module对象，还默认有一个exports属性。

在最上面的代码中我们导出了一个对象，包含name和add两个属性。为了书写方便，cjs也支持另一种简化的导出方式——直接使用exports。

```javascript
exports.name = 'yoha';
exports.add = (a, b) => a + b;
```

在实现效果上这段代码和最上面的module.exports没有任何不同。其内在机制是将exports指向了module.exports，而module.exports在初始化时是个空对象。可以简单的理解为cjs在每个模块首部默认添加了：

```javascript
let module = {
    exports: {}
}
let exports = module.exports;
```

因此，为exports.add赋值就相当于在module.exports对象上添加了一个add属性。同时，这样的特性，如果使用不当，也会带来一些问题。

1. 不要直接给exports赋值，否则会导致其失效。

```javascript
exports = {
    name: 'yohhhhh'
}
```

这样直接对exports进行赋值操作，使exports指向了内存的另外一个地址（新对象的地址），而module.exports却仍然是原来的空对象，因此name属性并不会导出。

>注：本来exports是指向module.exports这个对象的内存地址的。

2. 在module.exports 和 exports 不恰当的混用。

```javascript
exports.add = (a, b) => a + b;
module.exports = {
    name: 'yoha'
}
```

上面的代码先通过exports导出了add属性，然后通过module.exports重新赋值为另外一个对象，这就导致原本拥有的add属性的对象丢失。最后只导出具有那么属性的对象。

### cjs模块导入

上面说了cjs模块的导出，在cjs中使用require进行模块的导入。如：

```javascript
//addSum.js
module.exports = {
    add: (a, b) => a + b
}
//index.js
const Add = require('./addSum.js');
let sum = Add.add(2,3);
console.log(sum);//5
```

我们在index.js中导入了addSum模块，并且调用了其add函数。我们在require一个模块时会有两种情况：

1. require的模块的是第一次被加载。这个时候首先执行该模块，然后导出内容。
2. require的模块曾被加载。这个时候该模块的代码不会被再次执行，而是直接导出上次执行完得到的结果。

这个是因为，我们在前面提到，模块会有一个module对象来存放信息，这个对象中会有一个属性loaded用于记录该模块是否被加载过。它的默认值时false，当模块第一次被加载后会置为true，后面再次加载时检查到module.loaded为true，则不会再次执行模块代码。

## esm模块的导入和导出

### esm模块导出

esm模块的导出主要有两种形式：命名导出和默认导出。

一个模块可以有多个命名导出：

```javascript
//addSum.js
export let name = 'yoha';
export let age = 18;
export let add = (a, b) => a + b;
```

上面这个esm模块用export命令对外部输出了3个变量，除了上面这样的写法，还有一种写法：

```javascript
let name = 'yoha';
let age = 18;
let add = (a, b) => a + b;
export {name, age, add};
```

这两种写法是等价的。

export除了输出变量，还可以输出函数或者class。通常情况下，export输出的变量就是本来的名字，但是可以用as关键字重命名。

```javascript
function v1() {};
function v2() {};
export {
    v1 as streamV1,
    v2 as streamV2,
    v2 as streamLastV2
}
```

重命名后，v2可以用不同的名字输出两次。

需要注意的是，**export命令规定的是对外的接口，必须与模块内部变量建立一一对应的关系。**

```javascript
//error
export 1;
//error
let a = 1;
export a;
//error
function f() {};
export f;

/*===========*/

//correct
export let a = 1;
//correct
let a = 1;
export {a};

//correct
let a = 1;
export {a as num};

//correct
function f() {};
export {f};

//correct
export function f() {};
```

此外，我们还可以用export default命令为模块指定默认输出。其他模块加载该模块时，import命令可以为默认导出指定任意名字。

```javascript
//default.js
export default function(){
    console.log('foo');
}

//导入
import customName from './default.js'
```

这个时候也可以注意到：默认导出模块在引入时import命令后面不适用大括号。因为一个模块只能有一个默认输出，因此export default命令只能使用一次，所以import命令后面才不同加大括号，因为只可能对应一个方法。

本质上，export default就是输出一个叫作default的变量或者方法，然后系统允许我们为它取任意的名字。因此：

>**export default就是输出一个叫作default的变量或者方法,这一点在后面会被证明。也和require('xxx').default有着莫大的关系。**

```javascript
function add(x,y) {
    return x + y;
}
export {add as default};
//等同于
//export default add;

import {default as xxx} from 'module'
//等同于
//import xxx from 'module';
```

正因为export default命令其实只是输出一个叫作default的变量，所以它后面不能跟变量声明语句。

```javascript
export let a = 10;//correct


let b = 10;
export default b;//correct

export default let c = 5;//error
```

### esm模块导入

import是静态执行的，因此不能使用表达式和变量。

import导入模块也可以用as关键字对导入的变量重命名。

## import 引入 cjs模块

Node采用cjs模块格式，模块的输出都定义在module.exports属性上面。在node环境中，使用import命令加载cjs模块，node会自动将module.exports属性当作模块的默认输出，即等同于export default。

```javascript
//addSum.js
module.exports = {
    name: 'yoha',
    add(a,b) {
        return a + b;
    }
}

//index.js
import customName from './addSum.js'
//也可以是 import {default as customName} from './addSum.js';
console.log(customName);
```
输出为下图：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200904184927.jpg)

如果采用整体输入的写法，import * as customName from './addSum.js',default会取代module.exports作为输入的接口。

```javascript
import * as customName from './addSum.js'
/*
customName = {
    get default() { return module.exports; }
    get name() { return this.default.name }.bind(customName)
    get add() { return this.default.add }.bind(customName)
}
*/
```

上面的代码中, this.default取代了module.exports属性。**node会自动为customName添加default属性，通过customName.default属性获取module.exports。**

```javascript
//a.js
module.exports = function a() {
    return 10;
}

//b.js
import custom from './a.js';
custom();//10

//c.js
import * as custom from './a.js';
custom.default();//10
custom();//throw error: custom is not a function
```

由于esm模块是编译时确定输出接口，cjs模块时运行时确定输出接口，因此采用import命令加载cjs模块时，**不允许**采用下面的写法。

```javascript
import {readfile} from 'fs';
```

上面的代码不正确，因为fs时cjs格式，只有在运行时才能确定readfile接口，而import命令要求编译时就确定这个接口。解决办法是改为整体输入。

```javascript
import * as express from 'express';
const app = express.default();

import express from 'express';
const app = express();
```

## require 引入 esm模块

采用require命令加载esm时，esm所有输出的接口都会成为输入对象的属性。

```javascript
//addSum.js
export let a = 100;
export function add(a,b) {
    return a + b;
}
export {add as add_bak};
export default {
    name: 'yoha'
}

//index.js
let result = require('./addSum.js');
console.log(result);
```
输出为下图： 

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200905094249.jpg)

## require.context() 和 require('xx').default

到这个地方require('xx').default是什么意思应该很明确了：就是在用require引入ES默认导出模块时需要做的。

下面的重点就是**require.context()**。

require.context()是webpack提供的一个方法，可以创建一个特定的上下文，主要用来实现自动化导入模块。可以给这个方法传入四个参数：一个要搜索的目录，一个标记表示是否还搜索其子目录， 以及一个匹配文件的正则表达，还有一个是控制模块的加载方式。


>传递给require.context()的参数必须是字面量。

语法如下：

```javascript
require.context(directory, useSubdirectories = true, regExp = /^\.\/.*$/, mode = 'sync')
```

- sync 直接打包到当前文件，同步加载并执行
- lazy 延迟加载会分离出单独的 chunk 文件
- lazy-once 延迟加载会分离出单独的 chunk 文件，加载过下次再加载直接读取内存里的代码。
- eager 不会分离出单独的 chunk 文件，但是会返回 promise，只有调用了 promise 才会执行代码，可以理解为先加载了代码，但是我们可以控制延迟执行这部分代码。

现在的目录结构是在一个文件夹中有很多图片(png或者svg)，这些图片都需要引进来。

let *context* = require.context('./portalImg/static', false, /\.(png\|svg\|gif)$/); 这个函数执行后返回的一个函数**webpackContext**，这个函数接受一个request参数。并且这个函数拥有3个静态属性id、keys、resolve。如下图：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200908205715.jpg)

- id 是context module的模块 id. 它可能在你使用 module.hot.accept 时会用到。
- keys是一个函数，它返回一个数组，由所有可能被此 context module 处理的request组成。（看例子就会明白）
- resolve是一个函数，它返回 request 被解析后得到的模块 id。


有关源码：

```javascript
var map = {
    "./airbloom.svg": "./src/assets/icons/airbloom.svg",
    "./crown.svg": "./src/assets/icons/crown.svg",
    "./store.svg": "./src/assets/icons/store.svg",
    ...
};


function webpackContext(req) {
    var id = webpackContextResolve(req);
    return __webpack_require__(id);
}
function webpackContextResolve(req) {
    var id = map[req];
    if(!(id + 1)) { // check for number or string
        var e = new Error("Cannot find module '" + req + "'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    }
    return id;
}
webpackContext.keys = function webpackContextKeys() {
    return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./packages/@situation/app/portal2/src/views/components/portalImg/static sync \.(png|svg|gif)$";
```

执行context.keys()得到：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200908210628.jpg)

执行context.resolve()返回了一个字符串代表着传入参数的文件相对于整个工程的相对路径。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200908211549.jpg)

~~并且发现这个路径在require.context()执行后返回的函数webpackContext的作用域链中可以找到，因此大胆推测context.resolve()方法在内部是通过map来返回对应的路径的。并且这个作用域和context module的模块 id关联了起来(不确定这种说法对不对)。~~

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200908212728.jpg)

*context*作为一个函数,也接受一个req参数,这个和resolve方法的req参数是一样的,即匹配的文件名的相对路径。context函数返回的是文件打包后的相对路径。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200908215946.jpg)

我看到有的文章说context()返回的是es模块。我想应该是因为引入的文件是通过export或者export default暴露出去的，或者是采用loader在打包时处理了某种类型的文件。(我再查查0.0)

## 最后

路漫漫其修远兮，吾将上下而求索

## 参考文章

- [require('./expample.js).default详解](https://www.cnblogs.com/cangqinglang/p/10445256.html)
- 阮一峰老师-《ES6标准入门（第三版）》
- [依赖管理](https://webpack.docschina.org/guides/dependency-management/)
- [深入理解webpack的require.context](https://juejin.im/post/6844903895999709198)
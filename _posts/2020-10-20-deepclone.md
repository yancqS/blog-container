---
title: JSON.parse(JSON.stringify(obj))实现深拷贝的缺点
description: JSON.parse(JSON.stringify(obj))实现深拷贝的缺点
date: '2020-10-20'
author: Yoha
location: Beijing
image: https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201104182622.jpg
tags:
    - 前端开发
meta:
  - name: title
    content: JSON.parse(JSON.stringify(obj))实现深拷贝的缺点
  - name: description
    content: JSON.parse(JSON.stringify(obj))实现深拷贝的缺点
  - name: keywords
    content: 深拷贝, JSON.parse(JSON.stringify(obj))实现深拷贝的缺点
  - name: author
    content: Yoha
featured: true
---
# JSON.parse(JSON.stringify(obj))实现深拷贝的缺点

浅拷贝(shallowCopy)只是增加了一个指针指向已存在的内存地址;

深拷贝(deepCopy)是增加了一个指针并且申请了一个新的内存用于存放复制的对象，使这个增加的指针指向这个新的内存;

## JSON.parse(JSON.stringify(obj))深拷贝的问题

- 如果obj里面存在时间对象,JSON.parse(JSON.stringify(obj))之后，时间对象变成了字符串。
- 如果obj里有RegExp、Error对象，则序列化的结果将只得到空对象。
- 如果obj里有函数、undefined,则序列化的结果会把函数、undefined丢失。
- 如果obj里有NaN、Infinity和-Infinity，则序列化的结果会变成null。
- JSON.stringify()只能序列化对象的**可枚举的自有属性**。如果obj中的对象是有构造函数生成的， 则使用JSON.parse(JSON.stringify(obj))深拷贝后，会丢弃对象的constructor。
- 如果对象中存在循环引用的情况也无法正确实现深拷贝。
- 不能处理循环引用

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201104185513.jpg)


```javascript
let person = {};
Object.defineProperties(person, {
    'name': {
        configurable: true,
        enumerable: false,
        writable: true,
        value: 'test'
    },
    'age': {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 10
    }
});

let mySymbol = Symbol();
let obj = {
    data0: 1,
    data1: new Date(),
    data2: new RegExp('\\W+'),
    data3: new Error('1'),
    data4: undefined,
    data5: function () {
        console.log(1);
    },
    data6: NaN,
    data7: person,
    data8: {
        data_1: 3,
        data_2: {
            sub_data_1: 'heelo'
        },
        data_3: [1, 2, 3],
    },
    [mySymbol]: {
        a: 'symbol'
    }
}
console.log(obj);
console.log(JSON.parse(JSON.stringify(obj)));
```

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201104113808.jpg)

为了解决上述JSON.parse(JSON.stringify(obj))实现深拷贝的缺点，可以通过递归实现一个深拷贝。

## 递归实现深拷贝

```javascript
function cloneDeep(target) {
    if (typeof target === 'object' && target !== null) {
        if (target.__proto__.constructor === Date) return new Date(target);
        if (target.__proto__.constructor === RegExp) return new RegExp(target);
        if (target.__proto__.constructor === Map) return new Map(target);
        if (target.__proto__.constructor === Set) return new Set(target);
        let res = new target.constructor();
        for (let i of Reflect.ownKeys(target)) {
            res[i] = cloneDeep(target[i]);
        }
        return res;
    } else {
        return target;
    }
}
```



>用`new target.constructor ()`构造函数新建一个空的对象，而不是使用{}或者[],这样可以保持原形链的继承

测试结果：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201104143254.jpg)

## 循环引用

其实上面的递归实现深拷贝还存在一个问题：如果`target.property = target`,这样会形成了一个环(看着更像是套娃)。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201104144536.jpg)

那这个问题怎么解决呢？最开始的想法是如果存在这种循环引用的情况，可以找个地方先暂存一下。克隆之前，先去找是否存在一样(引用地址相同)的引用类型，如果有直接返回，没有再克隆。那么Map就很容易想到啦。

Map对象保存键值对。任何值(对象或者原始值) 都可以作为一个键或一个值。

```javascript
let person = {};
Object.defineProperties(person, {
    'name': {
        configurable: true,
        enumerable: false,
        writable: true,
        value: 'test'
    },
    'age': {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 10
    }
});

let mySymbol = Symbol();
let obj = {
    data0: 1,
    data1: new Date(),
    data2: new RegExp('\\W+'),
    data3: new Error('1'),
    data4: undefined,
    data5: function () {
        console.log(1);
    },
    data6: NaN,
    data7: person,
    data8: {
        data_1: 3,
        data_2: {
            sub_data_1: 'heelo',
            sym: Symbol('symm')
        },
        data_3: [1, 2, 3],
    },
    [mySymbol]: {
        a: 'symbol'
    },
    data10: Symbol('test'),
    newMap: new Map([['age', 10]]),
    newSet: new Set([1, 2, 3])
}

/*造成循环引用*/
obj.data9 = obj;

console.log(obj);
console.log(cloneDeep(obj));


function cloneDeep(target, map = new Map()) {
    if (typeof target === 'object' && target !== null) {
        let res = new target.constructor();

        if (map.get(target)) {
            return target;
        }
        map.set(target, res);

        if (target.__proto__.constructor === Date) return new Date(target);
        if (target.__proto__.constructor === RegExp) return new RegExp(target);
        if (target.__proto__.constructor === Map) return new Map(target);
        if (target.__proto__.constructor === Set) return new Set(target);

        for (let i of Reflect.ownKeys(target)) {
            res[i] = cloneDeep(target[i], map);
        }
        return res;
    } else {
        return target;
    }
}
```

测试结果：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20201104182622.jpg)

到这其实对日期对象(`new Date()`)、正则对象(`new RegExp()`)、`Map`、`Set`、`Symbol`、`function`、`undefined`、`null`、`object`、`Array`、`new Error()`的拷贝。下面对代码结构优化一下，不希望出现那么多的if-else。

```javascript
function cloneDeep(target, map = new Map()) {
    if (typeof target === 'object' && target !== null) {
        let res = new target.constructor();

        if (map.get(target)) {
            return target;
        }
        map.set(target, res);

        let tagType = target.__proto__.constructor.name;

        switch (tagType) {
            case 'Date':
                return new Date(target);
            case 'RegExp':
                return new RegExp(target);
            case 'Map':
                return new Map(target);
            case 'Set':
                return new Set(target);
            default:
                break;
        }

        for (let i of Reflect.ownKeys(target)) {
            res[i] = cloneDeep(target[i], map);
        }
        return res;
    } else {
        return target;
    }
}
```

## 参考文章

- [JSON.parse(JSON.stringify(obj))实现深拷贝的弊端](https://juejin.im/post/6844904130247573517)
- [深拷贝系列 ———— 自己通过递归实现一个深拷贝](https://juejin.im/post/6844904004170809351)
- [JS中如何进行对象的深拷贝](https://zhuanlan.zhihu.com/p/30216256)
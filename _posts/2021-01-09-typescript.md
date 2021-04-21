---
title: TypeScript学习记录(一)
description: TypeScript学习记录(一)
date: '2021-01-09'
author: Yoha
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210109223210.jpg
tags:
    - TypeScript
meta:
  - name: title
    content: TypeScript学习记录(一)
  - name: description
    content: TypeScript学习记录(一)
  - name: keywords
    content: TypeScript
  - name: author
    content: Yoha
featured: true
---
# TypeScript学习记录(一)

## 前言

前几天学习了一下Vue3的组合式API，发现Vue3对TypeScript的支持真的好，就是丝滑~。之前对于TS或多或少有了一些了解，今天做个整理。

## 环境搭建

- 安装typescript

```
npm install -g typescript
```

>可以通过 `tsc -v` 判断是否安装成功

tsc就是typescript compiler(编译器)。通过`tsc xxx.ts`就会将ts文件编译为js文件，至于是哪个版本的文件可以在tsconfig.json文件中进行配置。默认是ES3。

- 生产配置文件(非必需)

```
tsc --init
```

执行上面的命令:point_up_2:会自动生成tsconfig.json文件。

>生成的tsconfig.json文件默认如下

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */
    // "noUncheckedIndexedAccess": true,      /* Include 'undefined' in index signature results */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "skipLibCheck": true,                     /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
  }
}
```

关于这个文件的具体介绍学习会单独写一篇文章。需要打开的配置如下(非固定，按照个人情况)：

```json
{
    "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
        "declaration": true,
        "outDir": "./build",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    }
}
```

关于这个`"declaration": true`选项提一嘴，是为了生产对应的描述文件，以`.d.ts`为后缀名。

- 关于编辑器

个人使用的是vscode。为了每次编写完成ts文件，不再重复的执行`tsc xxx.ts`,在vscode下可开启监视任务，这个也是tsc提供的命令`tsc -w`。vscode对于typescript的支持也非常完备。开启步骤如下：

`Terminal -> Run Task` 就会出现下图：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210109222436.png)

选择 `typescript` 出现下图：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210109222534.png)

然后选择`tsc: watch`，即可开启监视任务。

## 什么时Typescript

Google一下，我就不粘贴啦。但是还是放一张图吧，很直观：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210109223210.jpg)

正式进入主题。

## 数据类型

JavaScript的类型分为两种：原始数据类型和对象类型。原始数据类型包括：数值、字符串、布尔值、`undefined`、`null`以及ES6新增的`Symbol`和[`BigInt`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)。

TypeScript支持与JavaScript几乎相同的数据类型，此外还提供了枚举类型。

### 布尔值

布尔值时最基础的数据类型,在TypeScript中，使用`boolean`定义布尔值类型：

```ts
let isDone: boolean = false
```

注意，使用构造函数`Boolean`创造的对象**不是**布尔值：

```ts
let createdByNewBoolean: boolean = new Boolean(1);

// Type 'Boolean' is not assignable to type 'boolean'.
//   'boolean' is a primitive, but 'Boolean' is a wrapper object. Prefer using 'boolean' when possible.
```

事实上`new Boolean()`返回的是一个`Boolean`对象：

```ts
let createdByNewBoolean: Boolean = new Boolean(1);
```

直接调用`Boolean`也可以返回一个`boolean`类型：

```ts
let createdByBoolean: boolean = Boolean(1);
```

在 TypeScript 中，`boolean` 是 JavaScript 中的基本类型，而 `Boolean` 是 JavaScript 中的构造函数。其他基本类型（除了 null 和 undefined）一样，不再赘述。

### 数值

和JavaScript一样，TypeScript里的所有数字都是浮点数或者BigInt。 这些浮点数的类型是 number。 除了支持十进制和十六进制字面量，TypeScript还支持ECMAScript 2015中引入的二进制和八进制字面量。

```ts
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
let big: bigint = 100n;
let bigByBigInt: bigint = BigInt(10);
let notANumber: number = NaN;
let infinityNumber: number = Infinity;
```

### 字符串

使用`string`定义字符串类型

```ts
let myName: string = "Bob";
let myAge: number = 20;

//模板字符串
let sentence: string = `Hello, my name is ${myName},
I'll be ${myAge + 1} years old next month`;
```

### 空值

JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 void 表示没有任何返回值的函数：

```ts
function logName(): void {
  console.log('my name is bob');
}
```

声明一个 `void` 类型的变量没有什么用，因为你只能将它赋值为 `undefined` 和 `null`：

>Declaring variables of type void is not useful, because you can only assign null (only if `--strictNullChecks` is not specified) or undefined to them:

```ts
let unusable: void = undefined;
let unusable_null: void = null;
```

### Null 和 Undefined

在 TypeScript 中，可以使用 null 和 undefined 来定义这两个原始数据类型：

```ts
let u: undefined = undefined;
let n: null = null;
```

默认情况下，`null` 和 `undefined` 是所有其他类型的子类型，也就是说 `undefined` 类型的变量，可以赋值给 number 类型的变量：

>原文是这样的：By default `null` and `undefined` are subtypes of all other types. That means you can assign `null` and `undefined` to something like `number`.

```ts
// 这样是没问题的
let num: number = undefined;
```

>注意：如果在tsconfig.json中如果设置了`"strict": true`(默认为ture)，这个地方会报错的。

### any

任意值(any)用来表示允许赋值为任意类型。

- 什么是任意值类型

如果是一个普通类型，在赋值过程中改变类型是不被允许的：

```ts
let let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

但如果是`any`类型，则允许被赋值为任意类型。

```ts
let myFavoriteNumber: any = 'seven';
myFavoriteNumber = 7;
```

- 任意值的属性和方法

在任意值上访问任何属性都是允许的：

```ts
let anything: any = 'hello'
console.log(anyThing.myName);
console.log(anyThing.myName.firstName);
```

也允许调用任何方法：

```ts
let anyThing: any = 'Tom';
anyThing.setName('Jerry');
anyThing.setName('Jerry').sayHello();
anyThing.myName.setFirstName('Cat');
```

可以认为，**声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值**。

- 未声明类型的变量

**变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型：**

```ts
let something;
something = 'seven';
something = 7;

something.setName('Tom');
```

等价于

```ts
let something: any;
something = 'seven';
something = 7;

something.setName('Tom');
```

### Never

`never`类型表示的是那些永远都不存在的类型。例如， `never`类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 `never` 类型，当它们被永不为真的类型保护所约束时。

`never`类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是`never`的子类型或可以赋值给`never`类型（除了`never`本身之外）。 即使 `any` 也不可以赋值给 `never`。

```ts
function error(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
```

### Unknown

我们可能需要描述编写应用程序时不知道的变量类型。 这些值可能来自动态内容，例如 来自用户，或者我们可能要有意接受我们API中的所有值。 在这些情况下，我们希望提供一种类型，该类型告诉编译器和将来的读者此变量可以是任何变量，因此我们将其赋予`unknown`类型。

```ts
let notSure: unknown = 4;
notSure = "maybe a string instead";

// OK, definitely a boolean
notSure = false;
```

>关于unknown类型和any类型的区别可以看这篇文章：[写TypeScript时，什么时候用any？什么时候用unkown？](https://www.zhihu.com/question/355283769)

下文摘自一个回答：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20210112185425.jpg)

any的意思是，程序员认为aaa可以是**任何**类型(动态的)，所以aaa.xxx中不管xxx是什么，都能通过语法检查，毕竟它是动态的，有的时候有.xxx有的时候没有.xxx都是可能的。

unknown的意思是，程序员目前**不知道**uuu的类型(未知的)，所以一般需要在用之前断言一下，才能通过语法检查。断言错了咋办？如上面的例子就断言错误，那就是断言者自己的问题了。

>any 和 unknown 的最大区别是, unknown 是 top type (任何类型都是它的 subtype) , 而 any 即是 top type, 又是 bottom type (它是任何类型的 subtype ) ,这导致 any 基本上就是放弃了任何类型检查.


### Array

TypeScript像JavaScript一样可以操作数组元素。 有两种方式可以定义数组。 第一种，可以在元素类型后面接上 []，表示由此类型元素组成的一个数组; 第二种方式是使用数组泛型，Array<元素类型>：

```ts
let list: number[] = [1, 2, 3];
let list_2: Array<number> = [1, 2, 3];
```

### Tuple

元组类型允许表示一个**已知元素数量和类型**的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为 string和number类型的元组。

```ts
let tom: [string, number] = ['Tom', 25];
```

当赋值或访问一个已知索引的元素时，会得到正确的类型：

```ts
let tom: [string, number];
tom[0] = 'Tom';
tom[1] = 25;

tom[0].slice(1);
tom[1].toFixed(2);
```

也可以只赋值其中一项：

```ts
let tom: [string, number];
tom[0] = 'Tom';
```

但是当直接对元组类型的变量进行初始化或者赋值的时候，需要提供所有元组类型中指定的项。

```ts
let tom: [string, number];
tom = ['Tom', 25];
```

```ts
let tom: [string, number];
tom = ['Tom'];

// Property '1' is missing in type '[string]' but required in type '[string, number]'.
```

当添加越界的元素时，它的类型会被限制为元组中每个类型的联合类型：

>联合类型后面会解释。

```ts
let tom: [string, number];
tom = ['Tom', 25];
tom.push('male');
tom.push(true);

// Argument of type 'true' is not assignable to parameter of type 'string | number'.
```

### Enum

枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等。

使用enum关键字来定义：

```ts
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
```

枚举成员会被赋值为从 `0` 开始递增的数字，同时也会对枚举值到枚举名进行反向映射：

### Objct

### 类型断言

>未完

## 参考文章/资源

- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [TypeScript中文文档](https://www.tslang.cn/docs/home.html)
- [TypeScript 入门教程](https://ts.xcatliu.com/)
- [tsconfig.json 配置详解](https://blog.csdn.net/wu5229485/article/details/104814671)
- [tsconfig.json官方文档](https://www.staging-typescript.org/tsconfig)

<comment />
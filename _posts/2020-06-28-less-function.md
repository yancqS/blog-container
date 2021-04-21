---
title: less内置函数
date: "2020-06-28"
author: Yoha
tags:
    - CSS
    - Less
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017113243.jpeg
meta:
  - name: title
    content: less内置函数
  - name: description
    content: less内置函数
  - name: keywords
    content: less
  - name: author
    content: Yoha
featured: true
---
# Less内置函数

## Logical Functions

- if

  Examples:

  ```less
  @some: foo;
  div {
    margin: if((2>1), 0, 3px);
    color: if((iscolor(@some)), @some, black);
  }
  ```

  Result:

  ```css
  div {
    margin: 0;
    color: black;
  }
  ```

  布尔表达式也是支持的：

  ```less
  if(not (true), foo, bar);
  if((true) and (2 > 1), foo, bar);
  if((false) or (isstring("boo!")), foo, bar);
  ```

- boolean

  Example:

  ```less
  @bg: black;
  @bg-light: boolean(luma(@bg) > 50%);

  div {
    background: @bg;
    color: if(@bg-light, black, white);
  }
  ```

  Result:

  ```css
  div {
    background: black;
    color: white;
  }
  ```

## String Function

- escape

  - 不转义编码的字符: \,、\/、\?、\@、 \&、 \+、 \'、 \~、 \!、 \$
  - 最常见的转义编码字符: \\<space\\>、 \#、 \^、 \(、 \)、 \{、 \}、 \|、 \:、 \>、 \<、 \;、 \]、 \[ 和 \=.

  Example:

  ```less
  escape('a=1');
  ```

  Resule:

  ```css
  a%3D1
  ```

- e

  字符串将作为参数并按原样返回其内容，但不带引号。它可用于输出无效的CSS语法的CSS值，或使用Less不能识别的专有语法.

  Example:

  ```less
  @mscode: "ms:alwaysHasItsOwnSyntax.For.Stuff()" 
  filter: e(@mscode);
  ```

  Result:

  ```css
  filter: ms:alwaysHasItsOwnSyntax.For.Stuff();
  ```

- %format

  >函数 %(string, arguments...) 格式化一个字符串

  第一个参数是带占位符的字符串. 所有占位符始于百分号%后跟字母s,S,d,D,a, 和 A. 剩下的参数是替换占位符的表达式. 如果你需要输出百分号, 用双百分号转义%%.

  如果你需要把特殊字符转义成 utf-8转义码请使用大写字母占位符，该占位符会转义所有的特殊字符除了\( \) \' \~ \!。空格会被转义成%20。小写字母占位符会保留特殊字符的原样。

  占位符:

  - d, D, a, A - 能被任何类型参数替换(颜色值, 数字, 转义值, 表达式, ...).如果你在字符串中结合使用,整个字符串参数都会替换进去——包括它的引号. 然后, 然后引号会被替换到字符串参数的原有位置, 也许会被转义或者还是不变的，取决于占位符是大写字母还是小写字母。
  - s, S - 能被除了颜色值以为任何类型参数替换. 如果你在字符串中结合使用, 只会替换成字符串参数的值，-而字符串参数引号都被忽略。

  Example:

  ```less
  format-a-d: %("repetitions: %a file: %d", 1 + 2, "directory/file.less");
  format-a-d-upper: %('repetitions: %A file: %D', 1 + 2, "directory/file.less");
  format-s: %("repetitions: %s file: %s", 1 + 2, "directory/file.less");
  format-s-upper: %('repetitions: %S file: %S', 1 + 2, "directory/file.less");
  ```

  Result:

  ```css
  format-a-d: "repetitions: 3 file: "directory/file.less"";
  format-a-d-upper: "repetitions: 3 file: %22directory%2Ffile.less%22";
  format-s: "repetitions: 3 file: directory/file.less";
  format-s-upper: "repetitions: 3 file: directory%2Ffile.less";
  ```

- replace
  
  >用另一个字符串替换文本

  参数：
  - string 搜索和替换用的字符串
  - pattern 一个字符串或者能搜索的正则表达式
  - replacement 匹配模式成功的替换字符串
  - flags (可选的) 正则表达式匹配标识（全匹配还是...）

  Example:

  ```less
  replace("Hello, Mars?", "Mars\?", "Earth!");
  replace("One + one = 4", "one", "2", "gi");
  replace('This is a string.', "(string)\.$", "new $1.");
  replace(~"bar-1", '1', '2');
  ```

  Result:

  ```css
  "Hello, Earth!";
  "2 + 2 = 4";
  'This is a new string.';
  bar-2;
  ```

## List Function(重点)

- length
  
  参数： list - 逗号或者空格隔开的值集合。 返回： 集合的值个数.

  >返回集合中的值的数目

  示例：length(1px solid red); 输出：3

  Example:

  ```less
  @list: 'banana', 'tomato', 'potato', 'peach';
  n: length(@list);
  ```

  Result: n:4;

- extract

  参数： list - 逗号或者空格隔开的值集合。 index - 用于返回集合中指定位置值的整型数字。 返回： 集合指定位置处的值。

  示例： extract(8px dotted red, 2); 输出： dotted

  Example:

  ```less
  @list: apple, pear, coconut, orange;
  value: extract(@list, 3);
  ```

  Result:

  ```css
  value: coconut;
  ```

- range

  参数：
  - start:可选的，起始值，比如1或者1px
  - end: 终止值
  - step: 步长

  Example:
  
  ```less
  value: range(4);
  value1: range(10px, 30px, 10);
  ```

  Result:
  
  ```css
  value: 1 2 3 4;
  value1: 10px 20px 30px;
  ```

- each

  参数：
  - list:用逗号或空格分隔的值列表。
  - rules:规则集

  Example:

  ```less
  @selectors: blue, green, red;
  each(@selectors, {
    .sel-@{value} {
      a: b;
    }
  })
  ```

  Result:

  ```css
  .sel-blue {
    a: b;
  }
  .sel-green {
    a: b;
  }
  .sel-red {
    a: b;
  }
  ```
  
  默认情况下，每个列表集的每个规则集都绑定到@value, @key和@index变量。 对于大多数列表，将为@key和@index分配相同的值(数字位置，从1开始)。 但是, 也可以将规则集本身用作结构化列表。 如：

  ```less
  @set: {
    one: blue;
    two: green;
    three: red;
  }
  .set {
    each(@set, {
      @{key}-@{index}: @value;
    })
  }
  ```

  这将输出：

  ```css
  .set {
    one-1: blue;
    two-2: green;
    three-3: red;
  }
  ```

  在each()函数中并不是一定要使用@value, @key和@index。在Less 3.7中, Less通过each()函数引入了匿名混合的概念，该概念可能会在以后扩展到语法的其他部分。匿名混合以#()或.()的形式使用，就像常规的mixin一样以.或者#开头。 在each()中，可以像这样使用它：

  ```less
  .set-2() {
    one: blue;
    two: green;
    three: red;
  }
  .set-2 {
    // Call mixin and iterate each rule
    each(.set-2(), .(@v, @k, @i) {
      @{k}-@{i}: @v;
    });
  }
  ```

  输出结果为：

  ```css
  .set-2 {
    one-1: blue;
    two-2: green;
    three-3: red;
  }
  ```

  each()函数将采用匿名混入中定义的变量名,并按照他们的顺序依次绑定到@value，@key和@index。如果只写each(@list, .(@value){}),则@key和@index都不会被定义。

  通过range和each来模拟for循环：

  ```less
  each(range(4), {
    .col-@{value} {
      height: (@value * 50px);
    }
  })
  ```

  输出为:

  ```css
  .col-1 {
    height: 50px;
  }
  .col-2 {
    height: 100px;
  }
  .col-3 {
    height: 150px;
  }
  .col-4 {
    height: 200px;
  }
  ```

## Math Function

- ceil

  >向上取整

  ceil(2.1px) => 3px

- floor

  >向下取整

  floor(2.6px) => 2px

- percent

  >将一个浮点数转为百分比

  percent(0.5) => 50%

- round

  参数：
  - number:一个浮点数
  - decimalPlaces,可选, 四舍五入到的小数位数. 默认为0

  >四舍五入

  round(1.67) => 2

  round(1.67, 1) => 1.7

- sqrt

  >求平方根

  sqrt(25cm) => 5cm

  sqrt(18.6%) => 4.312771730569565%;

- abs

  >取绝对值

  abs(-18%) => 18%

- sin、asin、cos、acos、tan、atan

  >三角函数

  sin(1)

  sin(1deg)

  sin(grad)

- pi

  pi() => 3.141592653589793

- pow

  >求幂

  ```less
  pow(0cm, 0px)
  pow(25, -2)
  pow(25, 0.5)
  pow(-25, 0.5)
  pow(-25%, -0.5)
  ```

  输出为：

  ```text
  1cm
  0.0016
  5
  NaN
  NaN%
  ```

- mod

  >求模

  mod(0cm, 0px) => NaNcm

  mod(11cm, 6px) => 5cm

  mod(-26%, -5) => -1%

- min、max

  接受一个或多个参数。

  >求最小值和最大值

## Type Function

- isnumber
- isstring
- iscolor
- iskeyword
- isurl
- ispixel
- isem
- ispercentage
- isunit
- isruleset

Example:

```less
isunit(11px, px);  // true
isunit(33px, rem); // false
isunit(4rem, rem); // true
isunit(56px, "%"); // false
isunit(7.8%, '%'); // true

@rules: {
    color: red;
}

isruleset(@rules);   // true
isruleset(#ff0);     // false
isruleset(blue);     // false
```

## Misc Function

- color

  解析颜色，将代表颜色的字符串输出为为一种颜色。

  ```less
  color("#ccc")
  //输出为：#ccc
  ```

- image-size

  从文件获取图像尺寸

  ```less
  image-size("file.jpg")
  //输出为：10px 20px
  ```

- image-width、image-height

  返回文件获取图像尺寸的宽度和高度

  ```less
  image-width("file.png"); //输出为 10px
  image-height("file.png"); //输出为 20px
  ```

- convert

  将数字从一个单位转换为另一个单位。

  第一个参数包含一个带单位的数字，第二个参数包含一个单位。 如果单位兼容，则将转换数字。 如果它们不兼容，则第一个参数将原样返回。

  兼容单位组：

  - lengths: ***m, cm, mm, in, pt, pc***
  - time: ***s, ms***
  - angle: ***rad, deg, grad, turn***

  ```less
  convert(9s, "ms")
  convert(14cm, mm)
  convert(8, mm) // 不兼容单位类型
  ```

  输出为：

  ```text
  9000ms
  140mm
  8
  ```

- data-uri

  参数:
  - mimetype:(可选)MIME类型字符串
  - url:内联文件的URL

  如果没有mimetype，data-uri函数将根据文件名后缀进行推测。 文本和svg文件编码为utf-8，其他所有文件编码为base64。

  Example:

  ```less
  data-uri('../data/image.jpg');
  //output:url('data:image/jpeg;base64,bm90IGFjdHVhbGx5IGEganBlZyBmaWxlCg...');
  //output in browser:url('../data/image.jpg');

  data-uri('image/jpeg;base64', '../data/image.jpg');
  //output:url('data:image/jpeg;base64,bm90IGFjdHVhbGx5IGEganBlZyBmaWxlCg...');

  data-uri('image/svg+xml;charset=UTF-8', 'image.svg');
  //url("data:image/svg+xml;charset=UTF-8,%3Csvg%3E%3Ccircle%20r%3D%229%22%2F%3E%3C%2Fsvg%3E");
  ```

- default

  仅在守卫条件(guard conditions,就是当...,when())内可用，并且仅在没有其他混合(minxin)匹配时返回true, 否则但会false.

  Example:
  
  ```less
  .mixin(1)                   {x: 11}
  .mixin(2)                   {y: 22}
  .mixin(@x) when (default()) {z: @x}

  div {
    .mixin(3);
  }

  div.special {
    .mixin(1);
  }
  ```

  输出为:

  ```css
  div {
    z: 3;
  }
  div.special {
    x: 11;
  }
  ```

  Example2:

  ```less
  .mixin(@value) when (ispixel(@value)) {width: @value}
  .mixin(@value) when not(default())  {padding: (@value / 5)}

  div-1 {
    .mixin(100px);
  }

  div-2 {
    color:color('#ccc');
    .mixin(100%);
  }
  ```

  Output:

  ```css
  div-1 {
    width: 100px;
    padding: 20px;
  }
  div-2 {
    color: #ccc;
  }
  ```

  >个人理解是:对div-1来说,.mixin(100px),满足了守卫条件when (ispixel(@value)),就有了第一个mixin,进而就满足了when not(default()). div-2由于不满足第一个守卫条件,导致第二个mixin中的default()返回true,使得第二个mixin中的when not(default())不成立.

  因此有了下面的例子验证:

  Example2:

  ```less
  .mixin(@value) when (ispixel(@value)) {width: @value}
  .mixin(@value) when (default())  {padding: (@value / 5)}

  div-1 {
    .mixin(100px);
  }

  div-2 {
    color:color('#ccc');
    .mixin(100%);
  }
  ```

  Output:

  ```css
  div-1 {
    width: 100px;
  }
  div-2 {
    color: #ccc;
    padding: 20%;
  }
  ```

- unit

  删除或更改尺寸单位

  参数:
  - dimension 一个数字,带不带单位均可
  - unit(可选) 要更改的单位，如果省略，将删除该单位。

  Example:

  ```less
  unit(5, px)//输出为: 5px
  unit(5em)//输出为: 5
  ```

- get-unit

  返回一个数字的单位

  参数:
  - number: 一个数字,带不带参数均可
  
  ```less
  get-unit(5px) //输出为: px
  get-unit(5) //输出为'',就是啥都没有
  ```

## 最后

其实还有一些颜色相关的函数,比较简单,可以用到的时候查一下.

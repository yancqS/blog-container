---
title: 高性能JavaScript——第一章
tags:
    - 读书笔记
date: "2020-08-28"
author: Yoha
location: Beijing
image: https://gitee.com/yancqs/blogImage/raw/master/blogImage/3378128262-5d07af0750999.png
meta:
  - name: title
    content: 高性能JavaScript——第一章
  - name: description
    content: 高性能JavaScript——第一章
  - name: keywords
    content: 高性能JavaScript， 加载和执行, async, defer
  - name: author
    content: Yoha
featured: true
---
# 第一章 加载和执行

>高性能JavaScript读书笔记

- \<script\>标签每次出现都会霸道地让页面等待脚本的**解析**和**执行**。无论当前的JavaScript代码是内联的还是包含在外链文件中，页面的下载和渲染都必须停下来等待脚本的执行完成。因为脚本执行的过程可能会修改页面内容。

例如：


```html
<html>
    <head>
        <title>Script Example</title>
    </head>
    <body>
        <p>
            <script type="text/javascript">
                document.write('The date is ' + (new Date()).toDateString());
            </script>
        </p>
    </body>
</html>
```

- 由于脚本会阻塞页面其他资源的下载，因此推荐将所有的script标签尽可能的放到body标签的底部，以减少对整个页面下载的影响。

- 如果把内嵌脚本放在引用外联样式表的\<link\>标签之后会导致页面阻塞去等待样式表的下载。这样做是为了确保内嵌脚本再执行时能获得最精准的样式信息。因此，建议**永远不要把内嵌脚本紧跟在\<link\>标签后面。**

## 延迟的脚本

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/3378128262-5d07af0750999.png)

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200827171836.jpg)

上图中的图片：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200827171908.jpg)

## 动态脚本元素

```javascript
let script = document.createElement('script');
script.type = 'text/javascript';

script.onload = () => {
    console.log('loaded');
};

script.src = './script.js';
document.getElementsByTagName('head')[0].appendChild(script);
```

这个新创建的script元素加载了script.js文件。文件在该元素被添加到页面时开始下载。这种技术的重点在于：无论何时启动下载，文件的下载和执行过程都不会阻塞页面的其他进程。

## XMLHttpRequest脚本注入

另一种无阻塞脚本的方法是使用XMLHttpRequest(XHR)对象获取脚本并注入页面中。此技术会先创建一个XHR对象，然后用它下载JavaScript文件，最后通过创建动态script元素将代码注入到页面中。


```javascript
let xhr = new XMLHttpRequest();
xhr.open('get', 'script.js', true);
xhr.onreadystatechange = function() {
    if(xhr.readyState == 4) {
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.text = xhr.responseText;
            document.body.appendChild(script);
        }
    }
}
xhr.send(null);
```
## 小结

管理浏览器中的JavaScript代码是个棘手的问题，因为代码执行过程会阻塞浏览器的其他进程，比如用户界面绘制。每次遇到script标签，页面都必须停下来，等待代码下载（如果是外链文件）并执行，然后继续处理其他部分。尽管如此，还是有几种方法能减少JavaScript对性能的影响：

- \<\/body\>闭合标签之前，将所有的script标签放到页面底部。这能确保在脚本执行前页面已经渲染完成。
- 合并脚本。页面的script标签越少，加载也就越快，响应速度也就越迅速。无论外链文件还是内嵌脚本都是如此。
- 有多种无阻塞下载JavaScript的方法：
    - 使用script标签的defer属性；
    - 使用动态创建的script标签元素来下载并指代码；
    - 使用XHR对象下载JavaScript代码并注入到页面中。

## 参考文章

- [defer和sync的区别](https://segmentfault.com/q/1010000000640869)


<comment />
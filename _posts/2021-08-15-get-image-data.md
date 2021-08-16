---
title: 如何对图片主题色进行提取
description: 如何对图片主题色进行提取
date: '2021-08-15'
author: Yoha
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210815223336.jpeg
tags:
    - JavaScript
    - 转载
meta:
  - name: title
    content: 如何对图片主题色进行提取
  - name: description
    content: 如何对图片主题色进行提取
  - name: keywords
    content: 图片主题色提取, canvas
  - name: author
    content: Yoha
featured: true
---
# 如何对图片主题色进行提取

## 前言

本文转载于公众号『前端森林』，对作者**前端森林**表示感谢。

并非原文转载，里面部分代码及文字按照个人风格做了修改，但最终效果一致。

## 网易云特效

在网易云听歌时，发现了一个很有意思的特效：就是切换歌曲时，会根据当前封面替换背景色。

首先我构思了很多它可能的实现方式：

- 机器学习对图片进行色彩分析
- 前端提取图片主色调，做渐变处理
- 封面背景图做高斯模糊

对于第一种，他不在我的知识范围内，这里就不展开说明了。

第二种的话，一般都是利用`canvas`来实现。

第三种相对来说，从技术层面来看，实现上是最为简单的。

做了猜测分析后，我默默打开了熟悉的 Chrome 控制台，打开了网易云音乐的源代码：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210815222737.png)

好家伙，果然是第三种实现方式。

本来到这里，本文就该结束了。但之前也有朋友问过我`如何对前端图片主题色进行提取`的问题，正好之前也做过类似的需求，这里就展开做个说明吧。

我们这里以一个图片网站为例，来展示实际业务中应用较广的场景：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210816101641.png)

在弱网下，图片加载速度较慢，此时在图片完全加载之前，提取图片的主色调，然后填充为背景色。这样用户体验能有较大的提升。

那具体是怎么实现的呢？

我们这里采用`canvas`来实现，具体分为三步：

- 获取图片数据
- 对图片数据进行处理
- 对颜色列表排序

这里我们使用的测试图片为：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210815223336.jpeg)

相对来说，主色调较为明显，也便于测试～

## 获取图片数据

我们知道图片是由一个个像素点组成的。通过 canvas 的`getImageData()`方法恰好可以获取图片的像素数据：

```js
function getImage(url) {
    return new Promise(resolve => {
        let img = new Image();
        img.onload = () => {
            resolve(img);
        }
        img.src = url;
    })
};

async function getColor(url) {
    const img = await getImage(url);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const PXdata = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    console.log(PXdata);
}
```

输出结果如下：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210815223825.png)

> Uint8ClampedArray (canvas元素专有类型)之前[文章](https://yancqs.github.io/blog/2020/12/31/arraybuffer/)有提及。

获取了图片数据，下一步就要对其进行相应的处理。

## 对图片数据进行处理

getImageData() 方法返回 ImageData 对象，该对象拷贝了画布指定矩形的像素数据。

对于 ImageData 对象中的每个像素，都存在着四方面的信息，即 RGBA 值：

- R - 红色 (0-255)
- G - 绿色 (0-255)
- B - 蓝色 (0-255)
- A - alpha 通道 (0-255; 0 是透明的，255 是完全可见的)

展开上一步得到的数据：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210815224231.png)

> ImageData对象可参考[ImageData](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData)

知道了规律，那让我们来对数据做一下处理：主要就是对颜色进行分组，并统计每种颜色分别出现的次数：

```js
function getCountColor(data) {
    let rgba = [];
    let rgbaStr = '';
    let colorList = {};
    for(let i = 0; i < data.length; i+=4) {
        rgba[0] = data[i];
        rgba[1] = data[i + 1];
        rgba[2] = data[i + 2];
        rgba[3] = data[i + 3];

        rgbaStr = rgba.join();

        if(colorList[rgbaStr]) {
            colorList[rgbaStr] += 1;
        } else {
            colorList[rgbaStr] = 1;
        }
    }
    console.log(colorList)
}
```

输出结果为：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210815225302.png)

到这里，我们就得到了每种颜色分别出现的次数。

## 对颜色进行排序

最后一步，对上面得到的色值对象做一个排序：

```js
for(let prop in colorList) {
    arr.push({
        color: prop,
        count: colorList[prop]
    })
}
arr.sort((a, b) => b.count - a.count);
```

排序后得到如下结果：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210815225555.png)

到这里我们就得到了图片色值出现次数从大到小的排序数组，我们来看排在第一位的`rgba(51,8,51,255)`。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20210815231654.jpeg)

最终代码：

```html
// index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>取主题色</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        html, body {
            height: 100%;
            width: 100%;
        }
        img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    </style>
</head>
<script src="./index.js"></script>
<script>
    (async (url) => {
        let data = await getColor(url);
        document.body.style.background = 'rgba(' + data.color + ')';
    })("./img/wukong.jpeg")
</script>
<body>
    <img src="./img/wukong.jpeg" alt="">
</body>
</html>
```

```js
// index.js
function getImage(url) {
    return new Promise(resolve => {
        let img = new Image();
        img.onload = () => {
            resolve(img);
        }
        img.src = url;
    })
};

async function getColor(url) {
    const img = await getImage(url);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const PXdata = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return getCountColor(PXdata);
}

function getCountColor(data) {
    let rgba = [];
    let rgbaStr = '';
    let colorList = {};
    let arr = [];
    for(let i = 0; i < data.length; i+=4) {
        rgba[0] = data[i];
        rgba[1] = data[i + 1];
        rgba[2] = data[i + 2];
        rgba[3] = data[i + 3];

        rgbaStr = rgba.join();

        if(colorList[rgbaStr]) {
            colorList[rgbaStr] += 1;
        } else {
            colorList[rgbaStr] = 1;
        }
    }
    for(let prop in colorList) {
        arr.push({
            color: prop,
            count: colorList[prop]
        })
    }
    arr.sort((a, b) => b.count - a.count);
    return arr[0];
}
```

## 最后

最后还是回到文章最开始提到的网易云音乐的播放器特效。不管它的实现方式是怎么样的，它的这种产品创意是值得我们学习的。

我们平时在浏览国内外的一些网站或者使用一些 app 时，总能遇到一些让你拍手称赞的效果。而这些特效往往又与前端分不开。
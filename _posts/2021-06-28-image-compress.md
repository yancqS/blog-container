---
title: JS 图片压缩
description: JS 图片压缩
date: '2021-06-28'
author: Yoha
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210628224652.png
tags:
    - JavaScript
    - 转载
meta:
  - name: title
    content: JS 图片压缩
  - name: description
    content: JS 图片压缩
  - name: keywords
    content: JS, 图片压缩
  - name: author
    content: Yoha
featured: true
---
# JS 图片压缩

## 背景

文章转载于[了解JS压缩图片，这一篇就够了](https://segmentfault.com/a/1190000023486410)。跟着文章的思路梳理了一下图片压缩的方法，以及Image对象、data URL、Canvas和 File (Blob)之间的转化关系。对文章作者**wuwhs**表示感谢。

本文代码github地址：

下面正文开始。

## 前言

公司的移动端业务需要在用户上传图片是由前端压缩图片大小，再上传到服务器，这样可以减少移动端上行流量，减少用户上传等待时长，优化用户体验。

`JavaScript` 操作压缩图片原理不难，已有成熟 `API`，然而在实际输出压缩后结果却总有意外，有些图片竟会越压缩越大，加之终端（手机）类型众多，有些手机压缩图片甚至变黑。

<img src="https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210628222235.png" style="zoom:67%;" />

所以本文将试图解决如下问题

- [x] 弄清楚Image对象、data URL、Canvas和File(Blob)之间的转化关系

- [x] 图片压缩的关键

- [ ] 超大图片压缩黑屏问题

## 转化关系

在实际应用中有可能使用的情境：大多时候我们直接读取用户上传的 `File` 对象，读写到画布（`canvas`）上，利用 `Canvas` 的 `API` 进行压缩，完成压缩之后再转成 `File（Blob）` 对象，上传到远程图片服务器；不妨有时候我们也需要将一个 `base64` 字符串压缩之后再变为 `base64` 字符串传入到远程数据库或者再转成 `File（Blob）` 对象。一般的，它们有如下转化关系：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210628224652.png)

## 具体实现

> 代码的具体实现做了部分修改，但不影响功能实现。

下面将按照转化关系图中的转化方法一一实现。

### file2DataUrl(file)

用户通过页面标签 `<input type="file" />` 上传的本地图片直接转化 [`data URL`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs) 字符串形式。可以使用 [`FileReader`](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader) 文件读取构造函数。`FileReader` 对象允许 `Web` 应用程序异步读取存储在计算机上的文件（或原始数据缓冲区）的内容，使用 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 或 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象指定要读取的文件或数据。该实例方法 `readAsDataURL` 读取文件内容并转化成 `base64` 字符串。在读取完后，在实例属性 `result` 上可获取文件内容。

```js
class ImageCompress {
  //...
  file2DataUrl(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result)
      }
      reader.readAsDataURL(file);
    })
  }
  //...
}
```

> 关于FileReader可参考：[FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)

`Data URL` 由四个部分组成：前缀（`data:`）、指示数据类型的 `MIME` 类型、如果非文本则为可选的 `base64` 标记、数据本身：

```
data:<mediaType>,<data>
```

比如一张png格式图片，转化为 `base64` 字符串形式：

```
data:image/png;base64,UklGRpQIAABXRUJQVlA4IIgIAADwLgCdASrIAJYAPu1qrlKppSQi...DWHRNsAW
```

### file2Image(file)

若想将用户通过本地上传的图片放入缓存并 `img` 标签显示出来，除了可以利用以上方法转化成的 `base64` 字符串作为图片 `src`，还可以直接用 `URL` 对象，引用保存在 `File` 和 `Blob` 中数据的 `URL`。使用对象 `URL` 的好处是可以不必把文件内容读取到 `JavaScript` 中 而直接使用文件内容。为此，只要在需要文件内容的地方提供对象 `URL` 即可。

```js
class ImageCompress {
  //...
  file2Image(file) {
    return new Promise(async (resolve, reject) => {
      let img = new Image();
      let URL = window.webkitURL || window.URL;
      if (URL) {
        let url = URL.createObjectURL(file);
        img.onload = function () {
          URL.revokeObjectURL(url);
          resolve(img);
        };
        img.src = url;
      } else {
        const dataUrl = await this.file2DataUrl(file);
        img.onload = function () {
          resolve(img);
        };
        img.src = dataUrl;
      }
    })
  }
  //...
}
```

注意：要创建对象 `URL`，可以使用 `window.URL.createObjectURL()` 方法，并传入 `File` 或 `Blob` 对象。如果不再需要相应数据，最好释放它占用的内容。但只要有代码在引用对象 `URL`，内存就不会释放。要手工释放内存，可以把对象 `URL` 传给 `URL.revokeObjectURL()`。

### url2Image(url)

通过图片链接（`url`）获取图片 `Image` 对象，由于图片加载是异步的，因此放到`resolve`中回传获取到的 `Image` 对象。

```js
class ImageCompress {
  //...
  url2Image(url){
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = function() {
        resolve(img);
      }
    });
    img.src = url;
  }
  //...
}
```

### image2Canvas(image)

利用 [`drawImage()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage) 方法将 `Image` 对象绘画在 `Canvas` 对象上。

`drawImage` 有三种语法形式：

- void ctx.drawImage(image, dx, dy);
- void ctx.drawImage(image, dx, dy, dWidth, dHeight);
- void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

> s* 代表 source（原图片）信息，d* 代表 destination（转化后canvas）的信息。

参数：

- `image`: 绘制到上下文的元素；
- `sx`: 绘制选择框左上角以 `Image` 为基准 `X` 轴坐标；
- `sy`: 绘制选择框左上角以 `Image` 为基准 `Y` 轴坐标；
- `sWidth`: 绘制选择框宽度；
- `sHeight`： 绘制选择框宽度；
- `dx`:  `Image` 的左上角在目标 `canvas` 上 `X` 轴坐标；
- `dy`:  `Image` 的左上角在目标 `canvas` 上 `Y` 轴坐标；
- `dWidth`:  `Image` 在目标 `canvas` 上绘制的宽度；
- `dHeight`:  `Image` 在目标 `canvas` 上绘制的高度；

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210629102252.jpeg)

```js
class ImageCompress {
  //...
  image2Canvas(img) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  }
  //...
}
```

### canvas2DataUrl(canvas, quality, type)

`HTMLCanvasElement` 对象有 `toDataURL(type, encoderOptions)` 方法，返回一个包含图片展示的 [`data URL`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs) 。同时可以指定输出格式和质量。

参数分别为：

- `type` 图片格式，默认为 `image/png`。
- `encoderOptions` **在指定图片格式为 `image/jpeg` 或 `image/webp` 的情况下**，可以从 `0` 到 `1` 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 `0.92`，其他参数会被忽略。

```js
class ImageCompress {
  //...
  canvas2DataUrl(canvas, quality, type) {
    return canvas.toDataURL(type || 'image/jpeg', quality || 0.8);
  }
  //...
}
```

> HTMLCanvasElement具体可参考：[HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement)

### dataUrl2Image(url)

图片链接也可以是 `base64` 字符串，直接赋值给 `Image` 对象 `src` 即可。

```js
class ImageCompress {
  //...
  dataUrl2Image(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = function() {
        resolve(img);
      }
    });
    img.src = url;
  }
  //...
}
```

### dataUrl2Blob(dataUrl, type)

将 `data URL` 字符串转化为 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象。主要思路是：先将 `data URL` 数据（`data`） 部分提取出来，用 `atob` 对经过 `base64` 编码的字符串进行解码，再转化成 `Unicode` 编码，存储在`Uint8Array`（8位无符号整型数组，每个元素是一个字节） 类型数组，最终转化成 `Blob` 对象。

```js
class ImageCompress {
  //...
  dataUrl2Blob(dataUrl, type) {
    let data = dataUrl.split(',')[1];
    let mimePattern = /^data:(.*);base64,/;
    let mime = dataUrl.match(mimePattern)[1];
    let binStr = atob(data); // base64解码
    let len = binStr.length;
    let arr = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], { type: type || mime });
  }
  //...
}
```

### canvas2Blog(canvas, quality, type)

`HTMLCanvasElement` 有 [`toBlob(callback, [type], [encoderOptions])`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob) 方法创造 `Blob` 对象，用以展示 `canvas` 上的图片；这个图片文件可以被缓存或保存到本地，由用户代理端自行决定。第二个参数指定图片格式，如不特别指明，图片的类型默认为 `image/png`，分辨率为 `96dpi`。第三个参数用于针对`image/jpeg` 格式的图片进行输出图片的质量设置。

```js
class ImageCompress {
  //...
  canvas2Blog(canvas, quality, type) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        resolve(blob);
      }, type || 'image/jpeg', quality || 0.8);
    })
  }
  //...
}
```

### blob2DataUrl(blob)

将 `Blob` 对象转化成 `Image` 对象，可通过 `URL` 对象引用文件，也支持引用 `Blob` 这样的类文件对象，同样，这里复用上面 `file2Image` 方法即可：

```js
class ImageCompress {
  //...
  blob2DataUrl(blob) {
    return this.file2DataUrl(blob)
  }
  //...
}
```

### upload(url, file, callback)

```js
class ImageCompress {
  //...
  upload(url, file, callback) {
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    fd.append('file', file);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // 上传成功
          callback && callback(xhr.responseText);
        } else {
          throw new Error(xhr);
        }
      }
    }
    xhr.open('POST', url, true);
    xhr.send(fd);
  }
  //...
}
```

## 图片上次本地服务器

```js
// app.js
const express = require('express');
const multer = require('multer');
const dest = '/Users/<your path>/uploads/';
const upload = multer({ dest });
const fs = require('fs');
const path = require('path');

const app = express();

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.header('Access-Control-Allow-Methods', 'POST');

  next();
})

app.post('/upload', upload.any(), (req, res, next) => {
  res.send(`上传成功: 文件大小为${Math.floor(req.files[0].size / 1000)}K`);
  let { name, ext } = path.parse(req.files[0].originalname);
  fs.rename(`${dest}${req.files[0].filename}`,
            `${dest}${name}_${new Date().getTime()}${ext || '.' + req.files[0].mimetype.slice(6)}`,
            (err) => {
    					if (err) throw new Error(err);
    					console.log('重命名完成');
  					});
})

app.listen(3000, () => {
  console.log('file upload server is running in 3000 port');
})
```

## 实现简易的图片压缩

基本的图片压缩思路：首先将上传图片转化成 `Image` 对象，再将写入到 `Canvas` 画布，最后由 `Canvas` 对象 `API` 对图片的大小和尺寸输出调整，实现压缩目的。

```js
class ImageCompress {
  REGEXP_IMAGE_TYPE = /^image\//;
  defaultOption = {
    file: null,
    quality: 0.8
  };
  isImage = type => this.REGEXP_IMAGE_TYPE.test(type);

  constructor(options) {
    this.options = Object.assign({}, this.defaultOption, options);
    this.file = this.options.file;
    this.init();
  }

  async init() {
    let file = this.file;
    let options = this.options;

    if (!file || !this.isImage(file.type)) {
      console.error('请上传图片');
    }

    if (!this.isImage(options.mimeType)) {
      options.mimeType = file.type;
    }

    let image = await this.file2Image(file);
    options.container && document.querySelector(options.container).appendChild(image);
    // 压缩前的调用函数，外部传入
    options.beforeCompress && options.beforeCompress(file);
    let canvas = this.image2Canvas(image);
    let blob = await this.canvas2Blog(canvas, options.quality, options.mimeType);
    let compress_img = await this.file2Image(blob);
    options.container && document.querySelector(options.container).appendChild(compress_img);
    // 压缩成功后的调用函数，外部传入
    options.successCompress && options.successCompress(blob);
    options.upload_url && this.upload(options.upload_url, blob, console.log);
  }


  file2Image(file) {//...}

  file2DataUrl(file) {//...}

  image2Canvas(img) {//....}

  canvas2Blog(canvas, quality, type) {//...}

  upload(url, file, callback) {//...}
}
```

这个简易图片压缩的构造函数的使用方法：

```html
<body>
  <div class="setting_zone">
    <div>
      <input type="file" onchange="handleChange(event)" />
    </div>
  </div>

  <div class="imgList"></div>
</body>
<script src="./src/main.js"></script>
<script>
  function handleChange(e) {
    let file = e.target.files[0];
    let options = {
      file,
      quality: 0.4,
      mimeType: 'image/webp',
      container: '.imgList',
      upload_url: 'http://127.0.0.1:3000/upload',
      width: 200,
      height: 150,
      beforeCompress: function(file) {
        console.table([
          {beforeCompress: file.size, mimeType: file.type}
        ])
      },
      successCompress: function(blob) {
        console.table([
          {afterCompress: blob.size, mimeType: blob.type}
        ])
        console.log('压缩率为：', ((file.size - blob.size) / file.size * 100).toFixed(2) + '%');
      }
    }
    
    new ImageCompress(options);
  }
</script>
```

到这其实建议的图片压缩上传就完成了。但是在原文中提出一些问题：

- 压缩输出图片寸尺固定为原始图片尺寸大小，而实际可能需要控制输出图片尺寸，同时达到尺寸也被压缩目的；
- `png` 格式图片同格式压缩，压缩率不高，还有可能出现“不减反增”现象；
- 有些情况，其他格式转化成 `png` 格式也会出现“不减反增”现象；
- 大尺寸 `png` 格式图片在一些手机上，压缩后出现“黑屏”现象；

## TODO

- 图片等比缩放（假如options中的width和height比例与原图宽高比不同）
- 复现一下大尺寸png图片压缩失败的情况

## 参考文章

- [了解JS压缩图片，这一篇就够了](https://segmentfault.com/a/1190000023486410)
- [聊聊JS的二进制家族：Blob、ArrayBuffer和Buffer](https://zhuanlan.zhihu.com/p/97768916)
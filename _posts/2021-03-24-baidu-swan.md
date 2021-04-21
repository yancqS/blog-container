---
title: 百度小程序——基础原理篇
description: 百度小程序——基础原理篇
date: '2021-03-24'
author: Yoha
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210325224201.jpg
tags:
    - 百度小程序
meta:
  - name: title
    content: 百度小程序
  - name: description
    content: 百度小程序
  - name: keywords
    content: 百度小程序, 小程序
  - name: author
    content: Yoha
featured: true
---
# 百度小程序——基础原理篇

## 背景

出于兴趣和业务需要的双重要求，开始学习一下百度智能小程序的开发。本文侧重原生百度小程序的学习，后续会涉及到小程序框架**okam**的学习。

## 简介

智能小程序，是百度提供的一种技术解决方案。开发者基于此开发出来的服务，在各类宿主环境（手机 App、车载系统、IOT 设备等）中，可做到用户无感知安装过程即点即用。

小程序使用了双线程模型,包括逻辑层和渲染层。逻辑层作为一个单独的线程执行js代码，控制小程序数据的生成和处理；渲染层使用WebView线程，处理页面的渲染和用户的事件交互行为。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/tutorial_intro_2-2.png)

## 基本原理

### 概览

小程序开发包括全局配置文件、页面配置文件。开发者可通过app.json和app.js文件对小程序进行全局配置；通过.css、.js、.json和.swan文件进行页面配置。具体结构如下：

```
├── app.js
├── app.json
├── app.css
├── project.swan.json
└──  pages
    └── index
        ├── index.swan
        ├── index.css
        ├── index.js
        └── index.json
    └── detail
        ├── detail.swan
        ├── detail.css
        ├── detail.js
        └── detail.json
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210315162241.png)

我们可以看到以下几类的文件：
1. `.json`为后缀的JSON配置文件，配置了智能小程序所有页面的路径和界面展现样式等；
2. `.swan`结尾的SWAN模板文件，用来描述当前这个页面的文件结构，类似于网页中的HTMK文件；
3. `.css`结尾的CSS文件，描述页面样式；
4. `.js`结尾的JS文件，处理这个页面和用户的交互。

### 全局app.json

`app.json`是小程序全局配置文件，设置SWAN的界面、路径、多Tab等。

**app.json配置项列表**


属性 | 类型 | 必填 | 描述
---|---|---|---
pages | `Array.<string>` | 是 | 设置页面路径
window | Object | 否 | 设置页面展现
preloadRule | Object | 否 | 分包预下载规则
tabBar | Object | 否 | 底部tab栏的表现
requiredBackgroundModes | `Array.<string>` | 否 | 需要在后台使用的能力，如「音乐播放」
subPackages | `Array.<string>` | 否 | 分包结构配置
networkTimeout | Object | 否 | 网络超时
permission | Object | 否 | 小程序接口权限相关设置
routes | `Array.<object>` | 否 | 小程序自定义路由相关设置
dynamicLib | Object | 否 | 引入动态库

配置项各个字段的详细举例：

- pages

pages 接受一个数组，每一项都是一个字符串，指定 SWAN App 都有哪些页面。每一项代表页面的 [路径 + 文件名] ，默认第一项为 SWAN App 首页。

SWAN 中新增或减少页面的话，需要在 pages 中进行配置。

配置项中不需要加文件后缀名， SWAN 会自动解析。

```json
/* app.json */
{
    "pages": [
        "pages/home/index",
        "pages/my/index"
    ],
}
```

>开发者工具在 app.json 的 pages 中填写页面路径可自动生成文件夹。

- tabBar

用于设置客户端底部的 tab 栏：可通过 tabBar 设置 tab 的颜色、个数、位置、背景色等内容。

属性 | 类型 | 必填 | 描述
---|---|---|---
backgroundColor | HexColor | 是 | tab 的背景色
borderStyle | String | 否 | tabBar | 边框颜色。有效值 black/white 两种边框颜色，默认值为 black
color | HexColor | 是 | tab上文字的默认颜色
list | Array | 是 | tab 的列表，列表个数 2~5 个。<br>list 接受一个数组，tab 按数组的顺序排序，每个项都是一个对象，其属性值如下：<br>- pagePath：已在 pages 中定义的页面路径；类型：String；必填项。<br>- text：tab 上显示的文字信息；类型：String；必填项。<br>- iconPath：图片路径，icon 大小限制为 40kb，建议尺寸为 78px*78px，不支持网络图片；类型：String；非必填项。<br>- selectedIconPath：选中时的图片路径，icon 规格同上；类型：String；非必填项
selectedColor | HexColor | 是 | tab 上的文字选中时的颜色

```json
/* app.json */
{
    "tabBar": {
        "backgroundColor": "#fff",
        "borderStyle": "black",
        "color": "#000",
        "selectedColor": "#ff7800",
        "list": [
            {
            "pagePath": "pages/home/index",
            "text": "首页",
            "iconPath": "",
            "selectedIconPath": ""
        }, {
            "pagePath": "pages/my/index",
            "text": "我的",
            "iconPath": "",
            "selectedIconPath": ""
        }]
    }
}
```

还支持[自定义tabbar](https://smartprogram.baidu.com/docs/develop/framework/process/#tabbar)

- window


属性 | 类型 | 默认值 | 描述
---|---|---|---
navigationBarBackgroundColor | HexColor | #000000 | 导航栏背景颜色，如#000000
navigationBarTextStyle | String | white | 导航栏标题颜色，目前有效值 black/white
navigationBarTitleText | String	| |导航栏标题文字内容
navigationStyle | String | default | 导航栏样式，有效值：default(默认样式) custom(自定义导航栏)，只保留右上角胶囊按钮
backgroundColor	| HexColor | #ffffff | 背景颜色
enablePullDownRefresh | Boolean | false | 是否开启下拉刷新
onReachBottomDistance | Number | 50 | 页面上拉触底事件触发时距页面底部距离（单位：px）
textSizeAdjust | String | auto | 小程序页面是否禁止响应字体大小的设置，有效值：auto(默认响应)、none(不响应)
backgroundTextStyle | String | dark | 下拉背景字体、loading 图的样式，有效值 dark/light	
backgroundColorTop | HexColor | #ffffff | 顶部窗口的背景色，仅 iOS 支持	
backgroundColorBottom | HexColor | #ffffff | 底部窗口的背景色，仅 iOS 支持

>这些在每个页面的`.json`文件中也可以配置。会覆盖全局的配置(app.json)。

```json
/* app.json */
{
    "window": {
        "navigationBarBackgroundColor": "#00ff00",
        "navigationBarTextStyle": "black",
        "navigationBarTitleText": "智能小程序",
        "backgroundTextStyle": "light",
        "backgroundColor": "#fff"
    },
}

/* pages/home/index.json */

{
    /* 默认不做配置 */
}

/* pages/my/index.json */
{
    "navigationBarTitleText": "智能小程序示例-我的",
    "navigationBarBackgroundColor": "#0000ff",
    "navigationBarTextStyle": "white",
    "backgroundColor": "#ffff00"
}
```

页面表现如下：

首页（未做配置）

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210315191348.png)

我的（pages/my/index.json）

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210315191550.png)

- requiredBackgroundModes

>未测试

申明需要后台运行的能力，类型为数组。

>未测试

代码示例：audio后台音乐播放
```json
{
    "requiredBackgroundModes": ["audio"]
}
```

- networkTimeout

>未测试

各类网络请求的超时时间


属性 | 类型 | 必填 | 默认值 | 说明
---|---|---|---|---
request | Number | 否 | 10000 | swan.request 的超时时间（单位：毫秒）。
connectSocket | Number | 否 | 60000 | swan.connectSocket 的超时时间（单位：毫秒）。
uploadFile | Number | 否 | 60000 | swan.uploadFile 的超时时间（单位：毫秒）。
downloadFile | Number | 否 | 60000 | swan.downloadFile 的超时时间（单位：毫秒）。

```json
/* app.json */
{
    "networkTimeout": {
        "request": 30000,
        "connectSocket": 10000,
        "uploadFile": 10000,
        "downloadFile": 10000
    }
}
```

- permission

>未测试

小程序接口权限相关设置。

属性 | 类型 | 必填 | 默认值 | 说明
---|---|---|---|---
scope.userLocation | PermissionObject| 否 | | 位置相关权限声明

**PermissionObject结构**

属性 | 类型 | 必填 | 默认值 | 说明
---|---|---|---|---
desc | String | 是 | 小程序获取权限时展示的接口用途说明。最长 30 个字符

示例代码：

```json
/* app.json */
{
    "permission": {
        "scope.userLocation": {
            // 高速公路行驶持续后台定位
            "desc": "你的位置信息将用于小程序位置接口的效果展示" 
        }
    }
}
```

- routes

>未测试

routes 为一个数组，数组中每一项代表一组路由规则，具体包含字段为：

属性 | 类型 | 必填 | 描述 | 示例
---|---|---|---|---
path | String | 是 | 访问路径 | "home"
page | String | 是 | 页面源码文件路径，从小程序包根目录开始的文件路径 | "pages/home/index"

代码示例：

```json
/* app.json */
{
    "routes": [
        {
            // 投放入口，scheme中的path
            "path": "home", 
            // 真实的物理存储路径
            "page": "pages/home/home" 
        },
        {
            "path": "list",
            "page": "pages/list/list"
        },
        {
            "path": "foo/bar",
            "page": "pages/list/list"
        }
    ]
}
```

URL Scheme 是一种 App 间的调起协议。App 内部注册协议后，当用户在浏览器或其他 App 内点击相应的 scheme 链接，就能够调起 App 并打开 App 内的相关页面。
下面是“智能小程序示例”小程序的调起 scheme：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210315202251.png)

### 全局app.js

app.js中存放全局的JavaScript逻辑。

```js
App({
    onLaunch(options) {
        // do something when launch
    },
    onShow(options) {
        // do something when show
    },
    onHide() {
        // do something when hide
    },
    globalData: 'SWAN'
});
```
App 函数用来注册一个智能小程序。接受一个 Object 作为参数，用以指定智能小程序的生命周期函数等。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210323203005.png)

整个小程序只有一个App实例，是页面共享的。开发者可以通过getApp()方法获取到全局唯一的App示例，代码如下:

```js
//xxx.js
const appInstance = getApp();
console.log(appInstance);
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210316201029.png)

注意：
- App() 必须在 app.js 中注册，且不能注册多个；
- 不要在 App() 内的函数中调用 getApp() 函数，可以通过 this 获取 app 实例；
- 不要在 onLaunch 中调用 getCurrentPages() ，因为此时 page 还没有生成。

### 小程序页面.js文件

在SWAN模板中书写一下代码：

```swan
<view>{{ me }}</view>
<button bind:tap="setName">点击变值</button>
```

在js中可以对视图中的行为进行监听，并触发页面变化：

```js
Page({
    setName() {
        this.setData({
            me: 'aaa'
        })
        //this.data.me = 'aaa' 不会触发视图的变化
    }
})
```

### 小程序页面.swan文件

这部分是每个智能小程序页面的展现模板，类似于 Web 开发中的 HTML，SWAN 模板中使用的标签均为 SWAN 组件规定的标签。标签可以拥有属性，需要注意的是，swan 中的属性是大小写敏感的，也就是说 class 和 Class 在 swan 中是不同的属性。

- 基础数据绑定

```swan
<!-- xxx.swan -->
<view>
    hi, {{name}}
</view>
```

```js
Page({
    data: {
        name: 'baiduStu'
    }
})
```

- 循环 && 条件

开发者可以通过在元素上添加s-for、s-if指令来进行渲染和视图层的逻辑判断。

```swan
<!-- xxx.swan -->
<view s-for="name in names">
    {{name.name}}
</view>
<button bind:tap="toggleShow">toggle show</button>
<view s-if="show">{{show}}</view>
```

```js
Page({
    data: {
        names: [
            {name: 'hhhh'},
            {name: 'gggg'},
            {name: 'dddd'},
        ],
        show: false
    },
    toggleShow() {
        this.setData({
            show: !this.data.show
        })
    }
})
```

- 事件

开发者可以使用`bind: + 事件名`来进行事件绑定。

目前支持的事件类型有：


类型 | 触发条件
---|---
touchstart | 手指触摸开始
touchmove | 手指触摸后进行移动
touchend | 手指触摸结束
touchcancel | 手指触摸动作被打断，如来电提醒等
tap | 手指触摸后马上离开动作

当开发者绑定方法到事件，事件触发时，SWAN 会给触发的方法传递**事件对象**，事件对象因事件不同而不同。

>还有其他事件，后面会有介绍

开发者可以通过**dataset**在组件中自定义数据，并在事件发生时，由 SWAN 所在事件对象中，传递给绑定函数。

```swan
<!-- xxx.swan -->
<view data-swan="{{test}}" bind:tap="viewtap">dataset-test</view>
```

```js
Page({
    data: {
        test: 1,
        Test: 2
    },
    viewtap: function (event) {
        // 输出1(大小写敏感)
        console.log('value is:', event.currentTarget.dataset.swan);
    }
});
```

### 小程序页面栈

>框架以栈的形式维护了当前的所有页面。开发者可以使用 [getCurrentPages()](https://smartprogram.baidu.com/docs/develop/framework/app_service_routegetCurrentPages/) 函数获取当前页面栈。

getCurrentPages 全局函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。

### 路由方式

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210317191414.png)

### Page

Page() 函数用来注册一个页面。接受一个 object 参数，其指定页面的初始数据、生命周期函数、事件处理函数等。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210317191914.png)

### 自定义组件

#### 创建自定义组件

开发者可以将页面内的功能模块抽象成自定义组件，在智能小程序的各个页面中进行使用，提升代码复用度，节省开发成本。

>一个自定义组件由 4 个文件 (.swan .css .js .json) 组成

```
// 包含自定义组件custom的项目结构
├── app.js
├── app.json
├── project.swan.json
└── components
    └── custom
        ├── custom.swan
        ├── custom.css
        ├── custom.js
        └── custom.json

```

要编写一个自定义组件，首先需要在 json 文件中进行自定义组件声明（在 json 文件中将 component 字段设为 true 可将这一组文件设为自定义组件）：


```json
/* custm.json */
{
    "component": true
}
```

同时，类似于页面开发。开发自定义组件，可以在 swan 文件中编写组件模板，在 css 文件中引入样式，它们的写法和页面的写法类似。

```swan
<!-- custom.swan -->
<view class="name" bind:tap="onTap">
    {{name}}{{age}}
</view>
```

```css
/* custom.css */
.name {
    color: black;
}
```

在自定义组件的 js 文件中，需要使用 **Component()** 来注册组件，并提供组件的属性定义、内部数据和自定义方法。

>全局app.js用App()来注册，小程序页面用Page()来注册。

```js
/* custom.js */
Component({
    properties: {
        name: { // 属性名
            type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: '', // 属性初始值（必填）
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
                console.log(`name has been changed:${newVal}`)
            }
        }
    },

    data: {
        age: 20
    }, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},

    detached: function () {},

    methods: {
        onTap: function () {
            this.setData({
                name: this.data.name.split('').reverse().join('')
                // 更新属性和数据的方法与更新页面数据的方法类似
            });
        }
    }
});
```

- 使用自定义组件

需要在页面json文件中配置：

```json
{
    "usingComponents": {
        "custom": "/componrnts/custom/custom"
    }
}
```

这样在页面的 swan 文件中，就可以像使用基础组件一样使用自定义组件。节点名即自定义组件的标签名，节点属性即传递给组件的属性值。

```swan
<!-- xxx.swan -->
<view>
    <custom name="swanApp"></custom>
</view>
```

#### 组件模板和样式

- 组件模板

在组建模板中可以提供一个`<slot>`节点，用于承载组件引用时提供的子节点。

```swan
<!-- custom.swan -->
<view>
    {{name}}{{age}}
    <!-- 如果组件引用时没有子节点 可以给出默认值 -->
    <slot>default value/node</slot>
</view>
```

```swan
<!-- xxxx.swan -->
<view>
    <custom name="swanApp">
        <text>custom slot</text>
    </custom>
</view>
```

通过 name 属性可以给 slot 命名。一个视图模板的声明可以包含一个默认 slot 和多个命名 slot。外层组件或页面的元素通过 slot="name" 的属性声明，可以指定自身的插入点。

```swan
<!-- custom.swan -->
<view>
    <slot name="slot1"></slot>
    <slot name="slot2"></slot>
</view>
```

```swan
<!-- xxx.swan -->
<view>
    <custom>
        <view slot="slot1">我是slot1</view>
        <view slot="slot2">我是slot2</view>
    </custom>
</view>
```

>和Vue的slot基本一样

在 slot 声明时应用 if 或 for 指令，可以让插槽根据组件数据动态化。

```swan
<view>
    <slot s-if="!visible" name="subcomponent"></slot>
</view>
```

- 模板数据绑定

与普通的 SWAN 模板类似，可以使用数据绑定，这样就可以向子组件的属性传递动态数据。

```swan
<view>
    <custom prop-a="{{dataFieldA}}" prop-b="{{dataFieldB}}">
        <view>这里是插入到组件slot中的内容</view>
    </custom>
</view>
```

在以上例子中，组件的属性 propA 和 propB 将收到页面传递的数据。页面可以通过 setData 来改变绑定的数据字段。

- 数据环境

插入slot的内容,**其数据环境为声明时的环境**。

代码示例：

组件：

```swan
<!-- custom自定义组件 -->
<view class="component-range">
    <slot name="inner"></slot>
</view>
```

```js
Component({
    data: {
        name: 'swan-inner'
    }
});
```

使用组件的页面或组件：

```swan
<view>
    <custom>
        <view slot="inner">{{name}}</view>
    </custom>
</view>
```

```js
Page({
    data: {
        name: 'swan-outer'
    }
});
```

渲染结果：

```swan
<view>
    <view class="component-range">
        <view>swan-outer</view>
    </view>
</view>
```

但是：如果 slot 声明中包含 s-bind 或 1 个以上 var- 数据前缀声明，该 slot 为 scoped slot。scoped slot 具有独立的数据环境。 **scoped slot 通常用于组件的视图部分期望由外部传入视图结构，渲染过程使用组件内部数据**。

代码示例：

组件：

```swan
<!-- custom自定义组件 -->
<view class="component-range">
    <slot name="inner" var-name="name"></slot>
</view>
```

```js
Component({
    data: {
        name: 'swan-inner'
    }
});
```

使用组件的页面或组件：

```swan
<view>
    <custom>
        <view slot="inner">{{name}}</view>
    </custom>
</view>
```

```js
Page({
    data: {
        name: 'swan-outer'
    }
});
```

渲染结果：

```swan
<view>
    <view class="component-range">
        <view>swan-inner</view>
    </view>
</view>
```

- 外部样式类

当组件希望接受外部传入的样式类时，可以在 Component 中用 **externalClasses** 字段定义若干个外部样式类。

```js
/* 组件 custom.js */
Component({
    externalClasses: ['external-class']
});
```

```swan
<!-- 组件 custom.swan -->
<view class="external-class">这段文本的颜色由组件外的 class 决定</view>
```

组件的使用者可以像使用其他属性一样，指定这个样式类对应的 class 。

```swan
<!-- 使用组件的页面或者组件 -->
<custom external-class="red-text" />
```

```css
.red-text {
    color: red;
}
```

#### Component 构造器

[具体的Component构造器可定义的字段与方法](https://smartprogram.baidu.com/docs/develop/framework/custom-component_comp/)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210318170103.png)

框出来的是**组件**的生命周期。

事实上，一个自定义组件也可以视为一个页面，故**页面也可以使用 Component 构造器构造**，拥有与普通组件一样的定义字段与实例方法，其必要配置项（ json ）与正常自定义组件一致，即需要有component: true字段。但是**页面的生命周期方法（即 on 开头的方法），应写在 methods 定义段中**。

#### 组件间通信与事件

- 通过 dispatch 方法与父组件通信

>未测试

通过 dispatch 方法，子组件可以向组件树的上层派发消息。消息将沿着组件树向上传递，直到遇到第一个处理该消息的组件，则停止。
通过 messages 可以声明组件要处理的消息，messages 是一个对象，key 是消息名称，value 是消息处理的函数，接收一个包含 target（派发消息的组件）和 value（消息的值）的参数对象。

```js
/* 父组件逻辑 */
Component({
    messages: {
        'childmessage': function (e) {
            console.log('childmessage', e);
        }
    }
});

/* 子组件逻辑 */
Component({
    created() {
        this.dispatch('childmessage', {
            name: 'swan'
        });
    }
});

```

- 通过 triggerEvent 方法与父组件通信

自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名和 detail 对象。

```js
/* custom.js */
Component({
    attached: function () {
        this.triggerEvent('myEvent', 2021);
    },
})
```

```swan
<!-- 引用组件的页面swan文件 -->
<custom name="yanhaha" dataA="{{number1}}" bind:tap="increNum" bind:myEvent="listener">
    <view slot="slot1">我是slot1</view>
    <text slot="default">custom slot</text>
    <view slot="slot2">我是slot2-{{test}}</view>
</custom>
```

```js
// 引用组件的页面js文件
Page({
    //...
    listener(e) {
        console.log(e,'listener');
    },
    //...
})
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210319213719.png)

- 通过 this.selectComponent 方法获取子组件示例对象

```swan
<!-- 使用组件的页面 -->
<custom id="customid" name="yanhaha" dataA="{{number1}}" bind:tap="increNum" bind:myEvent="listener">
    <view slot="slot1">我是slot1</view>
    <text slot="default">custom slot</text>
    <view slot="slot2">我是slot2-{{test}}</view>
</custom>
```

```js
//使用该组件的逻辑
Page({
    onLoad: function () {
        const res = this.selectComponent('#customid');
        console.log(res, 'selectComponent');
    },
})
```

#### 组件生命周期

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210322112902.png)

当前自定义组件可用的全部生命周期及其描述如下表所示：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210322113827.png)

```js
Component({
    pageLifeTimes: {
        show() {
            //组件所在页面被展示时触发
        },
        hide() {
            //组件所在页面被隐藏时触发
        }
    }
})
```

#### behaviors

behaviors 用于组件间代码共享，类似于一些编程语言中的“mixins”或“traits”。
- 每个 behavior 可以包含一组属性、数据、生命周期函数和方法，组件引用它时，它的属性、数据和方法会被合并到组件中，生命周期函数也会在对应时机被调用。
- 每个组件可以引用多个 behavior 。 同时该 behavior 也可以引用其它 behavior 。
- **behavior 需要使用 Behavior() 构造器定义**。

```js
//my-behavior.js
module.exports = Behavior({
    behaviors: [],
    properties: {
        myBehaviorProperty: {
            type: String,
            value: 'behavior'
        }
  },
  data: {
      myBehaviorData: {}
  },
  attached: function(){},
  methods: {
      myBehaviorMethod: function(){}
  }
});
```

组件引用：

```js
Component({
    //...
    behaviors: [require('my-behavior')],
    //...
})
```

**字段的覆盖和组合规则**

- 如果有同名的属性或方法，组件本身的属性或方法会覆盖behavior中的属性或方法
- 如果引用了多个behavior，在定义段中靠后的behavior中的属性或方法会覆盖靠前的属性或方法
- 如果有同名的数据字段，如果数据是对象类型，会进行对象合并；如果是非对象类型则会进行相互覆盖
- 生命周期函数不会相互覆盖，而是在对应触发时机被逐个调用。如果同一个behavior被一个组件多次引用，它定义的生命周期函数只会执行一次。

#### 数据监听器

>数据监听器可以用于监听和响应任何属性和数据字段的变化。

假如存在这样一种场景：`this.data.sum`永远是`this.data.dataA`和`this.data.dataB`的和。此时，可以使用数据监听器进行如下实现：

```js
Component({
    properties: {
        dataA: {
            type: Number,
            value: 0,
        },
        dataB: {
            type: Number,
            value: 0,
        }
    },
    observers: {
        "dataA, dataB": function (dataA, dataB) {
            this.setData({
                sum: dataA + dataB
            })
        }
    },
})
```

数据监听器还可以支持监听属性或内部数据的变化，可以同时监听多个。

```js
Component({
    observers: {
        'some.subfield': function(subfield) {
            // 使用 setData 设置 this.data.some.subfield 时触发
            // （除此以外，使用 setData 设置 this.data.some 也会触发）
            subfield === this.data.some.subfield
        },
        'arr[12]': function(arr12) {
            // 使用 setData 设置 this.data.arr[12] 时触发
            // （除此以外，使用 setData 设置 this.data.arr 也会触发）
            arr12 === this.data.arr[12]
        },
    }
});
```

如果需要监听所有子数据字段的变化，可以使用通配符`**`。

```js
Component({
    observers: {
        'some.field.**': function(field) {
            // 使用 setData 设置 this.data.some.field 本身或其下任何子数据字段时触发
            // （除此以外，使用 setData 设置 this.data.some 也会触发）
            field === this.data.some.field
        },
    },
    data: {
        some: {
            field: {
                subfield: [1, 2, 3]
            }
        }
    },
    attached: function() {
        // 会触发 observers
        this.setData({
            'some.field': {}
        });
        
        // 会触发 observers
        // this.setData({
        //     'some.field.xxx': {}
        // });

        // 会触发 observers
        // this.setData({
        //     'some': {}
        // });
    }
});
```

当然，仅使用通配符`**`可以监听全部`setData`。

```js
Component({
    observers: {
        '**': function(value) {
            // 数据发生变化即触发，这里的 value 是 properties 和 data 的合集
        }
    }
})
```

#### 抽象节点

关于抽象节点：在自定义组件中的一些节点，其对应的自定义组件不是由自定义组件自身决定的，而是由自定义组件的调用者确定的。这个时候就可以把节点声明为“抽象节点”。

```swan
//selectable-group.swan
<view s-for="{{labels}}">
  <label bindtap="itemTap" data-index="{{index}}">
    <selectable2 disabled="{{false}}" selected="{{selected[index]}}" name="{{name}}"></selectable2>
    {{item}}
  </label>
  <text>{{item}}</text>
</view>
```

其中，“selectable2”不是在`json`文件中的`usingComponents`字段声明的组件。而是在`componentGenerics`中声明的**抽象节点**。抽象节点也可以指定默认组件。

```js
//selectable-group.json
{
    "component": true,
    "usingComponents": {},
    "componentGenerics": {
        "selectable2": {
            "default": "/components/checkbox/checkbox"
        }
    }
}

//或者不指定默认组件
{
    "component": true,
    "usingComponents": {},
    "componentGenerics": {
        "selectable2": true
    }
}
```

应该如何使用包含抽象节点的组件呢？

```swan
<!-- index.swan -->
<view>selectable-group with custom-radio</view>
<selectable-group generic:selectable="custom-radio" />

<view>selectable-group with custom-checkbox</view>
<selectable-group generic:selectable="custom-checkbox" />

<view>selectable-group with default component</view>
<selectable-group />
```

```json
//index.json
{
    "navigationBarTitleText": "代码片段示例",
    "usingComponents": {
        "selectable-group": "/components/selectable-group/selectable-group",
        "custom-radio": "/components/radio/radio",
        "custom-checkbox": "/components/checkbox/checkbox"
    }
}
```

在使用`selectable-group`组件时，需要用`generic:selectable="xxxx"`来指定具体`selectable2`要渲染成哪一个组件。

#### 自定义组件扩展

>自定义组件的扩展其实就是提供了修改自定义组件定义段的能力。

代码示例：

```js
// behavior.js
module.exports = Behavior({
    definitionFilter(defFields) {
        defFields.data.from = 'behavior'
    }
})

// component.js
Component({
    data: {
        from: 'component'
    },
    behaviors: [require('./behavior.js')],
    ready() {
      // 此处会发现输出 behavior 而不是 component
      console.log(this.data.from) 
    }
});
```

Behavior() 构造器提供了新的定义段 definitionFilter，用于支持自定义组件扩展。 definitionFilter 是一个函数，在被调用时会注入两个参数：
- 第一个参数是使用该 behavior 的 component/behavior 的定义对象；
- 第二个参数是该 behavior 所使用的 behavior 的 definitionFilter 函数列表。

```js
// behavior3.js
module.exports = Behavior({
    definitionFilter(defFields, definitionFilterArr) {}
});

// behavior2.js
module.exports = Behavior({
    behaviors: [require('./behavior3.js')],
    definitionFilter(defFields, definitionFilterArr) {
        // definitionFilterArr[0](defFields)
    }
});

// behavior1.js
module.exports = Behavior({
    behaviors: [require('./behavior2.js')],
    definitionFilter(defFields, definitionFilterArr) {}
});

// component.js
Component({
    behaviors: [require('./behavior1.js')]
});
```

上述代码中声明了 1 个自定义组件和 3 个 behavior，每个 behavior 都使用了 definitionFilter 定义段。按照声明的顺序会有如下事情发生：
- 当进行 behavior2 的声明时就会调用 behavior3 的 definitionFilter 函数，其中 defFields 参数是 behavior2 的定义段， definitionFilterArr 参数即为空数组，因为 behavior3 没有使用其他的 behavior 。
- 当进行 behavior1 的声明时就会调用 behavior2 的 definitionFilter 函数，其中 defFields 参数是 behavior1 的定义段， definitionFilterArr 参数是一个长度为 1 的数组，`definitionFilterArr[0]` 即为 behavior3 的 definitionFilter 函数，因为 behavior2 使用了 behavior3。用户在此处可以自行决定在进行 behavior1 的声明时要不要调用 behavior3 的 definitionFilter 函数，如果需要调用，在此处补充代码 `definitionFilterArr[0](defFields)` 即可，`definitionFilterArr` 参数会由基础库补充传入。
- 同理，在进行 component 的声明时就会调用 behavior1 的 definitionFilter 函数。

简单概括，definitionFilter 函数可以理解为当 A 使用了 B 时，A 声明就会调用 B 的 definitionFilter 函数并传入 A 的定义对象让 B 去过滤。此时如果 B 还使用了 C 和 D，那么 B 可以自行决定要不要调用 C 和 D 的 definitionFilter 函数去过滤 A 的定义对象。

### 语法

#### 模板语法

- 数据绑定

SWAN模板中的动态数据都从逻辑层Page中data对象中来。数据绑定和许多模板引擎一样，数据包裹在双大括号里面。双向绑定的数据需包裹在`{= =}`中。

代码示例：

```swan
<scroll-view
    scroll-top="{= scrollTop =}"
    scroll-into-view="{= scrollIntoView =}"
>
    <view id="one" class="color-a">A</view>
    <view id="two" class="color-b">B</view>
</scroll-view>

<view class="c-{{className}}">{{value}}</view>

<!-- 控制属性不需要大括号包裹 -->
<view s-if="flag">如果为flag为true，你看得到我。</view>

<!-- 运算 -->

<!-- 普通变量 -->
<text>{{name}}</text>

<!-- 属性访问 -->
<text>{{person.name}}</text>
<text>{{persons[1]}}</text>

<!-- 一元否定 -->
<text>{{!isOK}}</text>
<text>{{!!isOK}}</text>

<!-- 二元运算 -->
<text>{{num1 + num2}}</text>
<text>{{num1 - num2}}</text>
<text>{{num1 * num2}}</text>
<text>{{num1 / num2}}</text>
<text>{{num1 + num2 * num3}}</text>

<!-- 二元关系 -->
<text>{{num1 > num2}}</text>
<text>{{num1 !== num2}}</text>

<!-- 三元条件 -->
<text>{{num1 > num2 ? num1 : num2}}</text>

<!-- 括号 -->
<text>{{a * (b + c)}}</text>

<!-- 数值 -->
<text>{{num1 + 200}}</text>

<!-- 字符串 + 三元条件 -->
<text>{{item ? ',' + item : ''}}</text>

<!-- 三元运算 -->
<checkbox checked="{{flag ? true : false}}"></checkbox>

<!-- 数组字面量 -->
<text>{{ ['john', 'tony', 'lbj'] }}</text>
```

- 循环

`s-for`默认情况下(`s-for="persons"`)下标索引是为 index，数组当前变量名默认为 item。也可以通过使用 `s-for-index` 来指定下标索引，`s-for-item` 来指定数组当前变量名。或者通过`s-for="p,index in persons"`简写的方式，指定下标索引和数组当前变量名。

如果列表中的项目会动态地增加、删除，并且希望列表中的项目保持自己的特征和状态，需要在`s-for`指令声明中指定`trackBy`。

trackBy 后跟的值可以是 s-for 的 array 中 item 本身或者其属性（如 `item.id`），该值需要是列表中唯一的字符串或数字，且不能动态改变。比如：`s-for="list trackBy item"`。

当数据更新触发重新渲染时，将自动跟踪项的变更，原先列表内的项位置会移动，新添加的项会被渲染，以确保组件保持自身的状态，并且省去一部分重新渲染带来的消耗。

>注意：当循环渲染自定义组件列表时，**不**指定 trackBy 而动态增删数组中的元素，可能会导致调用错误的 attached detached 生命周期函数。

- 条件

`s-if`可以实现以下操作：
- 为元素指定条件，当条件成立时元素可见，反之不可见
- 为`s-if`增加一个额外分支条件块
- 为`s-if`增加一个不满足条件的分支块，`s-else`指令没有值

>注意：`s-if`与`s-else`之间加入多余标签会报错。

>注意：`s-if`与`s-for`不可在同一标签下同时使用。

```swan
<view s-if="is4G">4G</view>
<view s-elif="isWifi">Wifi</view>
<view s-else>Other</view>
```

**block s-if**

block 虚拟组件，在渲染时不会包含自身，只会渲染其内容。可以用来渲染一组组件或者标签。

- 模板

SWAN 提供模板 template 的用法，旨在提高工程化和代码可维护性，可以在模板中定义代码片段，并被外界注入值，然后在合适的时机调用。

`name` 属性，定义了模板的名字。通过 `is` 属性，声明需要使用的模板，`data` 是所需要传入到模板的值，注意对象字面量的使用方法，对象字面量是三个大括号包裹。

代码示例：

```swan
<!-- template-demo.swan-->
<template name="person-card">
    <view>
        <text>位置: {{pos}}</text>
        <text>姓名: {{name}}</text>
    </view>
</template>

<template name="odd">
   <view> odd </view>
</template>


<template name="even">
   <view> even </view>
</template>

<template is="person-card" data="{{{...person}}}" />


<block s-for="{{[1, 2, 3, 4, 5]}}">
   <view>{{item}}</view>
   <template is="{{item % 2 == 0 ? 'even' : 'odd'}}"/>
</block>
```

- 事件处理

与浏览器的 DOM 事件类似，智能小程序的视图中事件分为`冒泡事件`和`非冒泡事件`。

冒泡事件如下表，不在列表的事件均为非冒泡事件。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210323151359.png)

事件绑定在组件上，与属性的写法相同（以 key、value 的形式）。
- key 以 bind 或 catch 开头，衔接事件类型，例如 bindtap、catchtouchcancel 。也可以在 bind 和 catch 后可以紧跟一个冒号，如`bind:tap`、`catch:touchstart`，其功能不变。
- **bind 与 catch 的区别是 bind 事件绑定不会阻止冒泡事件向上冒泡，catch 事件绑定可以阻止冒泡事件向上冒泡；**
- value 对应的是在 Page 中定义同名的函数，否则在事件触发时执行函数会抛出异常。

代码示例：

```swan
<view id="wrap" bindtap="handleTap1">
    wrap
    <view id="module" catchtap="handleTap2">
        module
        <view id="text" bindtap="handleTap3">
            text
        </view>
    </view>
</view>
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210323153031.png)

**事件的捕获**

捕获阶段是位于冒泡阶段之前，在捕获阶段中，事件到达节点的顺序与冒泡阶段恰好相反。在捕获阶段监听的方式是采用`capture-bind`、`capture-catch`关键字，后者将中断捕获阶段和取消冒泡阶段。

代码示例：capture-bind

```swan
<view id="wrap" bind:touchstart="handleTap1" capture-bind:touchstart="handleTap2">
    wrap
    <view id="inner" bind:touchstart="handleTap3" capture-bind:touchstart="handleTap4">
        text
    </view>
</view>
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210323153748.png)

代码示例：capture-catch

```swan
<view id="wrap" bind:touchstart="handleTap1" capture-catch:touchstart="handleTap2">
    wrap
    <view id="inner" bind:touchstart="handleTap3" capture-bind:touchstart="handleTap4">
        text
    </view>
</view>
```

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210323153905.png)

**事件对象**

默认当组件触发事件时，逻辑层绑定事件的处理函数会收到一个默认参数，即事件对象。下面是事件对象详细属性列表：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210323161102.png)

>注意：target 和 currentTarget 的区别是 `currentTarget` 为当前事件所绑定的组件，而 `target` 则是触发该事件的源头组件。

**target**


属性 | 类型 | 说明
---|---|---
dataset | Object | **触发事件**组件上由data-开头的自定义属性组成的集合
id | String | **触发事件**组件的id
offsetTop | Int | 元素向上偏移的像素值
offsetLeft | Int | 元素向左偏移的像素值

**currentTarget**


属性 | 类型 | 说明
---|---|---
dataset | Object | **事件绑定的**组件上由data-开头的自定义属性组成的集合
id | String | **事件绑定**的组件的id
offsetTop | Int | 元素向上偏移的像素值
offsetLeft | Int | 元素向左偏移的像素值

**dataset**

在组件的事件被触发时，可以传递自定义的数据。

书写方式： 以 data- 开头，多个单词由连字符-链接，不能有大写(大写会自动转成小写)，最终的 - 在 dataset 中会将连字符转成驼峰式写法。如组件上`data-car-color`属性值的读取方式是: event.currentTarget.dataset.carColor。

**touch**

属性 | 类型 | 说明
---|---|---
identifier | Number | 触摸点的标识符
clientX, clientY | Number | 距离页面可显示区域（屏幕除去导航条）左上角的 X 轴与 Y 轴的距离
pageX, pageY | Number | 距离文档左上角的 X 轴与 Y 轴的距离

**changedTouch**

数据格式同 touches，指的是有变化的触摸点，如 touchstart（开始），touchmove（变化），touchend，touchcancel（结束）等。

点击事件的 detail 带有的 x, y 同 pageX, pageY 代表距离文档左上角的距离。

**注意**

请不要在组件中绑定 onClick、onAnimationstart、onDrag 等 HTML 原生事件，这会导致小程序的事件绑定不生效。

- 文件作用域

在 JavaScript 文件中声明的变量和函数只在该文件中有效；不同的文件中可以声明相同名字的变量和函数，且不会互相影响。通过全局函数 getApp() 可以获取全局的应用实例，如果需要全局的数据可以在 App() 中设置。

- 引用

SWAN可以通过 `import` 和 `include`来引用模板文件。

**import**

通过`import`和`template`配合使用，可以将代码分离以及复用。

例如：

首先，在person-card.swan中定义了一个叫person-card的template：

```swan
<!-- person-card.swan-->
<template name="person-card">
    <view>
        <text>位置: {{pos}}</text>
        <text>姓名: {{name}}</text>
    </view>
</template>
```

然后，在index.swan里引用文件person-card.swan，并使用它的模板：

```swan
<!-- index.swan-->
<import src="./person-card.swan" />
<template is="person-card" data="{{person}}" />
```

```js
// index.js
Page({
    data: {
        person: {
            pos: 'Baidu',
            name: 'SWAN'
        }
    }
});
```

>import 具有递归的特性。 例如：C 引用 B，B 引用 A，在 C 中可以使用 B 定义的 template，在 B 中可以使用 A 定义的 template ，**C 也可以使用 A 定义的 template**

**include**

通过`include`可以将目标模板整个（除了 template）引入到当前的位置，相当于`inline`。

```swan
<!-- index.swan -->
<include src="header.swan"/>
<view> body </view>
<include src="footer.swan"/>

<!-- header.swan -->
<view> header </view>

<!-- footer.swan -->
<view> footer </view>
```

#### SJS语法参考

>基本和JS的一致，不在赘述。需要看的是[这个地方](https://smartprogram.baidu.com/docs/develop/framework/sjs_start/)

### 框架接口

#### setData机制

setData 函数用于将数据，从逻辑层发送到视图层，当开发者调用 setData 后，数据的变化会引起视图层的更新。

参数说明：


属性 | 类型 | 必填 | 描述
---|---|---|---
data | Object | 是 | 要改变的数据
callback | Function | 否 | setData引起的界面更新渲染完毕后的回调函数

说明：
- Object 以`key: value`的形式表示，将`this.data`中的`key`对应的值改变成`value`；`key`可以以**数据路径**的形式给出，支持改变数组中的某一项或对象的某个属性，如`array[2].message`、`a.b.c.d`，并且不需要在`this.data`中预先定义；
- **直接修改`this.data`而不用`this.setData(Object[, callback])`是无法改变页面状态的，还会造成数据不一致；**
- 不要把`data`中的任何一项的`value`设为`undefined`,否则会有一些潜在的问题；
- `data`的键名必须遵守camelCase(驼峰式)命名规范，**不得**使用kebab-case(短横线隔开式)规范。
- 仅支持设置可JSON化的数据


#### 模块化

可以将一些公共的代码抽离成为一个单独的 js 文件，作为一个模块。模块可以通过 module.exports、exports 或者 export 对外暴露接口，使用 require 或者 import 进行导入。

#### AOP

- AOP.after

App.after 可以增加 APP 级的切面，触发的时机是在所拦截的对应生命周期方法执行之后。

方法参数：Object

属性名 | 类型 | 必填 | 说明
---|---|---|---
methods | Object | 否 | 所有需要拦截的生命周期方法的合集

可拦截的所有方法：
- onLaunch
- onShow
- onHide
- onError
- onPageNotFound

```js
// app.js
App({
    onShow() {
        console.log('normal onShow');
    }
});

App.after({
    methods: {
        onShow() {
            console.log('after app onshow');
        }
    }
});
/**
 * 打印结果
 * normal onShow
 * after app onshow
 */
```

- Page.after

Page.after 可以增加 Page 级的切面，触发的时机是在所拦截的对应生命周期方法执行之后，也可以拦截所有页面上发生的事件（对于要拦截的事件，在 swan 文件上必须显示绑定了相应事件）。

方法参数：Object

属性名 | 类型 | 必填 | 说明
---|---|---|---
url | String | 否 | 要增加切面的页面的URL规则，当URL参数不填时，则默认拦截所有页面
methods | Object | 否 | 所有要拦截的生命周期方法的集合
events | Object | 否 | 所有要拦截的事件的集合

可以拦截的所有方法：
- onLoad
- onReady
- onShow
- onHide
- onUnload
- onForceReLaunch
- onPullDownRefresh
- onReachBottom
- onPageScroll
- onTabitemTap
- onURLQueryChange

代码示例：

```js
// 为url中含有page/index的page实例增加切面
Page.after({

    url: /pages\/index/,    //正则

    // 拦截页面中的生命周期onShow
    methods: {
        onShow(context) {
            console.log('message after normal show function');
        }
    },

    // 拦截页面中，属性有data-tag="1"的节点的tap事件
    events: {
        '[data-tag="1"]:tap': function (context) {
            console.log('message after a tag is tapped');
        }
    }
});
```

- swan.after

swan.after 可以拦截所有当前运行小程序对于 API 的调用，默认传入function时，只在 API 函数调用的返回阶段拦截。如果传入 Object，则可以选择拦截的阶段（例如: 返回阶段、回调调用阶段）。

方法参数：Object

属性名 | 类型 | 必填 | 说明
---|---|---|---
[key] | String | 否 | 要拦截的API名称
[value] | Object/Function | 否 | 拦截之后的处理器(如果为function,则默认在returning阶段调用)

API文档中所有swan调用均可以拦截。

代码示例：

```js
swan.after({
    // 默认在returning阶段进行拦截
    showToast:function(context) {
        console.log(context);
        console.log('swan after');
    }
    
    // 可以拦截success返回，fail返回，与returning
    showToast: {
        success() {
            console.log('swan after success');
        },
        fail() {
            console.log('swan after fail');
        },
        returning() {
            console.log('swan after returning');
        }
    }
});
```

### 页面声明周期

**原理图**

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210324204133.png)

- FCP：First Contentful Paint ，即首次有内容的绘制
- FMP：First Meaningful Paint ，即首次有意义的绘制

下列加载时间线屏幕截图直观的介绍了FCP与FMP的含义：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210324212911.png)

#### 首页初次渲染全过程

1. 初始化：渲染线程和逻辑线程同步的进行初始化，在逻辑线程初始化时收集App和Page的初始化数据，并且执行App.onLaunch回调中的相关逻辑。
2. notify：当渲染线程初始化后，向逻辑线程派发消息，请求获取初始化渲染数据。同时，如果开发者有配置骨架屏，小程序会优先加载骨架屏，此时即为FCP完成。如果骨架屏的高度撑满整个页面，那么我们认为此时为FMP完成，如果骨架屏信息不足以撑满整个屏幕，那么我们认为此次渲染非有效的FMP。
3. setInitData：逻辑线程将初始化渲染数据派发给渲染线程，渲染进程拿到这些初始化数据后，会初始化页面及自定义组件，最后将所有内容渲染到页面上。
4. setData：逻辑线程触发以上生命周期后，逻辑层一般执行了众多的setData，每次setData均会使得逻辑线程向渲染线程传送数据，引起页面的重新渲染。其中首次的setData，是在逻辑线程达到Inited状态后，将业务相关的数据通过setData发送到渲染线程，触发渲染线程Rerender，并可以触发FMP。

## 参考文章

- [百度小程序官网](https://smartprogram.baidu.com/docs/develop/tutorial/intro/)


<comment />
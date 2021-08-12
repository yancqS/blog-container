---
title: 为什么设备欺骗变得几乎不可能
description: 为什么设备欺骗变得几乎不可能
date: '2021-08-12'
author: Yoha
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210802155602.png
tags:
    - JavaScript
    - 转载
    - 翻译
meta:
  - name: title
    content: 为什么设备欺骗变得几乎不可能
  - name: description
    content: 为什么设备欺骗变得几乎不可能
  - name: keywords
    content: 设备欺骗
  - name: author
    content: Yoha
featured: true
---

# 为什么设备欺骗变得几乎不可能

原文链接：[Why mimicking a device is becoming almost impossible](https://multilogin.com/why-mimicking-a-device-is-almost-impossible/)

如果你看过昆汀·塔伦蒂诺（Quentin Tarantino）的电影《无耻混蛋》，你可能还记得一个酒吧场景，一名英国的间谍作为纳粹官员的卧底，一个无意识的手势暴露了他的身份。

虽然他穿着纳粹制服，德语说得很好，但他的一个小细节暴露了自己：他的手指。 再点三品脱时，他不用拇指、食指和中指（像德国人那样），而是用无名指、中指和食指。 餐桌旁的另一名官员立即认出这个微妙的细节是明显的英语国家。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210802155602.png)

我们任何一个需要在网上工作的人都面临同样的状况。如果你忽略了一些看似次要的关键点而放松警惕，那么就很容易导致身份泄露。在本文，我们将进入设备检测的世界，并展示为什么以及如何模仿设备变得几乎不可能。

在深入探讨之前，让我们快速了解一下为什么系统会尝试检测设备——这也是人们尝试检测或模拟设备的原因。

### 为什么系统会尝试检测设备？

在浏览器的早期和随后的“浏览器战争”中，多如牛毛的浏览器供应商意味着开发人员需要了解是哪个供应商开发的哪个客户端连接到他们的网站，然后他们开始根据检测到的浏览器来定制和优化响应 . 从这个意义上说，这是技术上的需要。

我们的老朋友 User-Agent 字符串是从这些日子里幸存下来的——但现在的检测和预防技术都更加先进。

在检测方面，大多数网站都采用检测机制来帮助服务客户。例如，Netflix 为每个设备（从移动设备到智能电视）支持数百种不同分辨率的视频格式。 如果没有设备检测，这怎么可能？

同样，想想为笔记本电脑和桌面设备提供功能齐全的产品的公司，他们向移动用户只提供有限的版本。

### 但是……为什么个人和机器人试图模仿设备？

到目前为止，我们提出的问题将我们带到了这里，答案就是问题。 因为一些人或机器人想要获得更多特定于某些设备的元素，或者想要摆脱所谓的“设备贫民窟”（例如，他们不想因为是移动设备而限制可能性）。 同样，一些居心叵测的人希望利用某些安全措施对某些设备不那么严格这一事实。

如果网站无法向移动设备显示验证码（即使超过了某些费率限制），或者如果公司仅向某些类型的设备提供特定折扣或产品，谁能阻止人们使用设备欺骗？

于是便有了如今一场隐喻性的“军备竞赛”在那些试图检测设备的人和那些试图阻止检测的人之间脱颖而出。虽然这导致了对机器学习或人工智能等先进技术的更大投资，但还有一些其他方法出乎意料地没有引起太多关注，比如谷歌的设备分类方法：Picasso。稍后我们将详细介绍它，但首先，我们不要忘记那些可以在一秒钟内给您信息的微小细节。

### 为什么设备欺骗并不总是有效？

从修改 User-Agent 字符串到采用更先进的技术，设备欺骗可以通过不同的方式进行——但这也意味着有不同的方式发现设备欺骗。

*你在使用手机吗？真的吗？*

许多人认为设备欺骗就像更改 User-Agent 字符串一样简单：我们对他们说，“言语是无力的； 拿出你的证据！”

例如，大多数的设备欺骗试图声称该设备是移动设备却立马露出了马脚。他们忘记了模仿特有设备的特征，比如不支持触摸。

你能想象不支持触摸的智能手机吗？

试试下面的解决办法：

```js
var touch_capable = ( 'ontouchstart' in window ) || 
           ( navigator.maxTouchPoints > 0 ) || 
           ( navigator.msMaxTouchPoints > 0 );

if(touch_capable) {
  alert("Supported");
} else {
	alert("Not Supported");
}
```

正如我们所说，特定于设备的功能和信息是必不可少的。 如果你声称你的设备是 Apple iPhone 6，那么你必须了解特定于设备的详细信息，至少是 iPhone 6 的屏幕尺寸。

你见过屏幕分辨率为1920×1080的iPhone 6吗？ 我们没有，检测系统也没有！

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210802161709.png)

另一个例子：如果你成功通过了 navigator.platform 测试，没有人会觉得你有一台 MacBook 很奇怪：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210802161822.png)

但是，你不能说你同时使用 Max OS X 和 Windows！

欺骗设备时会忽略更多异常。 如果你曾经使用过移动浏览器（当然你使用过），你就会知道你无法调整浏览器窗口的大小。 它总是打开，最大化，覆盖整个屏幕。 这意味着对于检测系统来说，窗口的 X 和 Y 值应始终为 0，否则..

关于特定设备属性的例子还可以继续，但现在是时候微笑一下了。

*Emojis：你的感觉背叛了你吗？*

你是否意识到，尽管以相同的方式键入表情符号，但是在不同的设备中显示的方式有所不同呢？

例如，这里有一个微笑表情符号，使用`：`and `）`表示，系统将其转换为甜美的图片。🙂

看看这个甜美的表情符号在不同的系统和设备中有多么的不同。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210802161944.png)

假设你声称客户端运行在Android操作系统上。检测系统可以获取表情符号的哈希值，并将其与从正版安卓系统获得的哈希值进行比较。如果结果不一样，那么显然你正在欺骗你的设备。这是真正的魔法！

这是来自不同设备的 `U+1F600` 微笑表情符号的哈希值。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210802162227.png)

这里， sha256 是从 Windows 10 操作系统上不同版本的谷歌浏览器得到的相同表情符号的哈希值。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210802162254.png)

你的字体匹配吗？

每个系统都带有一些预装的字体，默认使用某些特定的字体。 例如，虽然 iOS 13 Academy 预装了 Engraved LET Plain:1.0 字体，但它没有 Al Bayan Bold。 但是，macOS Catalina 有！

同样，Tahoma 是 Windows XP 中的默认字体，自 Vista 以来，默认字体就一直是 Segoe UI。 微软[最新的 Windows 10 字体列表](https://docs.microsoft.com/en-us/typography/fonts/windows_10_font_list)附带了一个说明：

*请注意：并非所有桌面字体都会出现在 Windows 10 的非桌面版本中，例如 Xbox、HoloLens、SurfaceHub 等。*

因此，如果检测字体的检测系统没有检测到 Microsoft 页面上列出的字体，那么检测系统可以立即确定这不是普通的 Windows 10。

到目前为止，我们已经研究了一些会暴露设备欺骗的问题，但并不难找到解决方法。 通过覆盖浏览器配置和提供字体、表情符号和二进制属性，这是一个可以解决的问题，尽管需要付出很多努力和成本。

但是，凡事都有两面性。

> 应该是：前面主要说什么是设备欺骗，为什么要进行设备欺骗，如何进行设备欺骗，然后要过度到下面要说的如何发现或打击设备欺骗

2006 年，来自 Google 反滥用团队的 Elie Bursztein 公开分享了他的作品 Picasso，详细介绍了 Google 是如何打击 Google Play 中的设备欺骗的。

Picasso 旨在通过执行一些严重依赖于浏览器的操作系统和图形硬件的渲染操作来了解浏览器的设备分类。 通过使用随机种子，Picasso在每一轮中随机在画布上创建几何符号。 随机种子、圆形、宽度和高度等值是Picasso操作的要素。 因此，Picasso可以获得通过客户端不可克隆的功能（如操作系统和图形硬件）生成的图形输出。 

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210802172015.png)

除非数据库预先计算了使用正版设备获得的值，否则该系统没有任何意义。 该数据库稍后用作真正的参考。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210802172214.png)

我们必须在这里注意Picasso工作的一些要点。 例如，它使用 HTML Canvas生成图形。 人们倾向于认为Canvas是用来增加指纹熵以获得唯一性的。 [正如 Multilogin 工程师们几年前所证明的那样](https://www.youtube.com/watch?v=Tv0eeaMHfDw)，在设置中Canvas哈希值将与硬件保持一致，而不是保证独特的Canvas指纹。 2006 年，谷歌开始使用Canvas指纹的这一功能对设备进行分类，以尝试了解设备欺骗。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210802172300.png)

尽管这是相当古老的工作（2006 年），但它已被 Cloudflare 所采用。 当我们考虑到他们的市场份额有多大时，Picasso将成为设备欺骗不可预防的机制。

只要对方有一个由真实设备获得的预先计算的哈希组成的数据库，设备和操作系统欺骗就很难不被 Picasso 检测出来。 您不认为 Google 和 Cloudflare 有足够的数据集来检查设备的真实性吗？

长期以来，我们一直建议用户在Multilogin中创建浏览器配置文件时，确保选择与浏览器配置文件所匹配的正确操作系统。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210802172558.png)

尽管 Multilogin 采取了一些措施来防止检测系统，比如提供带有配置文件的字体、提供真实的画布结果等； 但最好的办法是尽可能保持真实。 离开操作系统对检测系统没有任何意义； 然而，检测虚假设置之间的不匹配意义重大！

The key rule is blending in the crowd for not being the person pointed to by finger. From a device spoofing perspective, as Rumi says, we would suggest: Seem as you are or be as you seem!
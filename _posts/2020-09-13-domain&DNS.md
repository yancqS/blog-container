---
title: 域名发散和域名收敛
date: "2020-09-13"
author: Yoha
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20200913170310.gif
tags:
    - 计算机知识
    - 转载
meta:
  - name: title
    content: 域名发散和域名收敛
  - name: description
    content: 域名发散和域名收敛
  - name: keywords
    content: 域名发散和域名收敛, 域名, DNS解析
  - name: author
    content: Yoha
featured: true
---
# 域名发散和域名收敛

## 关于域名

百度百科关于域名的概念是：

>域名（英语：Domain Name），又称网域，是由一串用点分隔的名字组成的Internet上某一台计算机或计算机组的名称，用于在数据传输时对计算机的定位标识（有时也指地理位置）。由于IP地址具有不方便记忆并且不能显示地址组织的名称和性质等缺点，人们设计出了域名，并通过**网域名称系统**（DNS，Domain Name System）来将域名和IP地址相互映射，使人更方便地访问互联网，而不用去记住能够被机器直接读取的IP地址数串。

全球13组根域名服务器以英文字母A到M依序命名，域名格式为“字母\.root-servers\.net”。**根域名服务器**（英语：root name server）是互联网域名解析系统（DNS）中最高级别的域名服务器，负责返回**顶级域**的权威域名服务器地址。全部已以任播技术在全球多个地点设立镜像站。

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200910164850.png)

### 域名结构

域名的结构（或者叫命名空间）是一个树状结构，有树就得有根，这个根是一个点‘\.’（dot）。
以 www\.example\.com 为例，完整的形式应该是 www\.example\.com\. ，注意最后一个点，就是根结点root ，只不过平时是浏览器或者系统的解析器自动帮我们补全了。**根节点之后就是顶级域名**，就是 \.cn \.com \.gov 这些，顶级域划分为通用顶级域 （com、org、net 等）和国家与地区顶级域（cn、hk、us、tw 等）。我们可以用dig命令查看一下顶级域名的解析路径，加上 +trace 参数选项，意思是追踪 DNS 解析过程，如下：
·
![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200910211544.png)

另外，上面两张 dig 命令贴图中间出现了很多次 **NS** ，NS 即是 NameServer，大部分情况下又叫权威名称服务器简称权威。
什么是权威呢，通俗点讲其实是某些域的权威，也就是权威上面有这些域的最新，最全的数据，所有这些域的数据都应该以此为准（只有权威可以增删改这些域的数据），就像上面  dig com +trace 的结果可以看到，com 的权威是上面的 13 个根域。同理，所有的顶级域（cn、org、net 等等）的权威都是根域。

域名又有顶级域名、二级域名、子域名和父域名的概念。

- 顶级域名

顶级域（或顶级域名），英语：Top-level domains，first-level domains（TLDs），也翻译为国际顶级域名。是互联网DNS等级之中的最高级的域，它保存于DNS根域的名字空间中。顶级域名是域名的最后一个部分，即是域名最后一点之后的字母，例如在http:\/\/example\.com这个域名中，顶级域是 \.com（或 \.COM），大小写视为相同。

- 二级域名

除了顶级域名，还有二级域名（SLD，second-level domain），就是最靠近顶级域名左侧的字段。如：http:\/\/zh\.wikipedia\.org中，wikipedia就是二级域名(有资料认为, 在顶级域名后面, 还存在一级域名, 那么zh就是二级域名)。

- 父域名和子域名

一个相对概念，很好理解。如 "www\.sina\.com\.cn" 和 "news\.sina\.com\.cn" 都是 sina\.com\.cn 的子域名（或称为二级域名），sina\.com\.cn 就是父域名。
同样，sina\.com\.cn 其实又可以看作是 \.com\.cn 的子域名；而 \.com\.cn 又是 \.cn 的一个子域名。

这个图把域名结构展示的比较清晰：

![](https://gitee.com/yancqs/blogImage/raw/master/blogImage/20200901212129.svg)

### 域名发散

这个很好理解，PC时代为了突破浏览器的域名并发限制，遵循这样一条定律：**http静态资源采用多个子域名**，目的是充分利用现代浏览器的多进程并发下载能力。由于浏览器的限制，每个浏览器允许对每个域名的连接数一般是有限的，附图一枚：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20200913150313.jpeg)

上图展示了各浏览器的并行连接数（同域名），可以看到在一些现代浏览器内每个 hostname 的最大连接数基本都是6个，IE 稍显傲娇，总体而言并发数不高。**所以 PC 时代对静态资源优化时，通常将静态资源分布在几个不同域，保证资源最完美地分域名存储，以提供最大并行度，让客户端加载静态资源更为迅速。**

另外，[为什么浏览器要做并发限制呢？](https://www.zhihu.com/question/20474326)

- 究其根本原因，在以前，服务器的负载能力差，稍微流量大一点服务器就容易就崩溃。 所以为了保护服务器不被强暴到崩溃，浏览器要对 max connections（最大并发数）进行限制。如果每个用户的最大并发数不限制的话，服务器的负载能力会大幅下降。
- 另外还有一个方面就是, 防止 DDOS 攻击。最基本的 DoS 攻击就是利用合理的服务请求来占用过多的服务资源，从而使合法用户无法得到服务的响应。

### 域名收敛

顾名思义，域名收敛的意思就是建议将静态资源只放在一个域名下面，而非域名发散情况下的多个域名下。上面也说到了，域名发散可以突破浏览器的域名并发限制，那么为要反其道而行之呢？因为因地制宜，不同情况区别对待，**域名发散是PC时代的产物，而现在进入移动互联网时代，通过无线设备访问网站，App的用户已占据了很大一部分比重，而域名发散正是在这种情况下提出的。**

## http请求过程

1. DNS域名解析
2. 发起TCP的3次握手
3. 建立TCP连接后发起http请求
4. 服务器响应http请求
5. ...

在这里第一步，也是关键的第一步DNS解析，**在移动端的http请求耗时中，DNS解析占据了大部分时间**。

### DNS解析

一个完整的DNS解析过程如下：

1. 首先拿到URL后，浏览器会寻找本地的DNS缓存，看看是否有对应的IP的地址，如果缓存中存在那就好啦；如果不存在，那就要想DNS server发送一个请求，找到你想要的IP地址。
2. 首先他会向你的ISP（互联网服务提供商）相关的DNS server发送DNS query。然后这些DNS进行递归查询（recursive）。所谓的递归查询就是说能够直接返回对应的IP地址，而不是其他的DNS server地址。
3. 如果上述的DNS server没有你要的域名地址，则会发送迭代查询，即会先从root nameserver找起。即假如你要查询 www\.example\.com\.,会先从包含根节点的13台最高级域名服务器开始。
4. 接着，以从右向左的方式递进，找到com\.，然后向包含com的TLD（顶级域名）nameserver发送DNS请求。接着找到包含example的DNS server。
5. 现在进入到了example.com部分，即现在正在查询的是权威服务器，该服务器里面包含了你想要的域名信息，也就是拿到了最后的结果record。
6. 递归查询的DNS server接收到这record之后，会将record保存一份到本地。如果下一次再请求这个domain时，就可以直接返回这个record。由于每条记录都会存在TLL，所以Server每隔一段时间都会发送一次请求，获取新的record。
7. 最后，再经由最近的DNS server将该条record返回。同样，你的设备也会存一份该record的副本。之后，就是TCP的事情了。下面是一张简化图：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20200913170310.gif)

大致流程是：\.=>com\.=>example\.com\.=>www\.example\.com\.=>IP adress

### TTL 为何

TTL是Time to Live的缩写，也就是生存时间值，表示DNS记录在DNS服务器上缓存的时间。

引用一个百度百科的[例子](https://baike.baidu.com/item/TTL/130248?fr=aladdin)：

>假设，有这样一个域名myhost\.baiwan-han\.com（其实，这就是一条DNS记录，通常表示在baiwan-han.com域中有一台名为myhost的主机）对应IP地址为1\.1\.1\.1，它的TTL为10分钟。这个域名或称这条记录存储在一台名为-ns\.baiwan-han\.com的DNS服务器上。此时如果有一个用户在浏览器中输入以下地址（又称URL）：myhost\.baiwan-han\.com 那么会发生些什么呢？

>该访问者指定的DNS服务器（或是他的ISP，互联网服务商，动态分配给他的)8\.8.\8\.8就会试图为他解释myhost\.baiwan-han\.com，当然8.8.8.8这台DNS服务器由于没有包含myhost\.baiwan-han\.com这条信息，因此无法立即解析，但是通过全球DNS的递归查询后，最终定位到-ns\.baiwan-han\.com这台DNS服务器，-ns\.baiwan-han\.com这台DNS服务器将myhost\.baiwan-han\.com对应的IP地址1\.1\.1\.1告诉8\.8\.8\.8这台DNS服务器，然有再由8\.8\.8\.8告诉用户结果。8\.8\.8\.8为了以后加快对myhost\.baiwan-han\.com这条记录的解析，就将刚才的1\.1\.1\.1结果保留一段时间，这就是TTL时间，在这段时间内如果用户又有对myhost\.baiwan-han\.com这条记录的解析请求，它就直接告诉用户1\.1\.1\.1，当TTL到期则又会重复上面的过程。

扯了这么多http请求，DNS解析,回到正题域名收敛上，从上面可以看到，DNS解析其实是一个很复杂的过程，在PC上，我们采用域名发散策略，是因为在PC端上，DNS解析通常而言只需要几十ms，可以接受。而移动端，2G网络，3G网络，4G网络/wifi强网，而且移动4G容易在信号不理想的地段降级成2G，通过大量的数据采集和真实网络抓包分析（存在DNS解析的请求），DNS的消耗相当可观，2G网络大量5-10s，3G网络平均也要3-5s（数据来源于淘宝）。下面附上在 2G，3G，4G， WIFI 情况下 DNS 递归解析的时间 （ms）：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20200913221702.png)

因为在增加域的同时，往往会给浏览器带来DNS解析的开销。所以在这种情况下，提出了域名收敛，减少域名数量可以降低 DNS 解析的成本。

下图是手机端页面加载数和域名分散数的关系（from Mobify Developer）:

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20200913221859.png)

在 2 个域名分散条件下，网页的加载速度提升较大，而第3个以后就比较慢了。所以，一般来说，域名分散的数量最好在 3 以下。

## SPDY

单纯的在移动端采用域名收敛并不能很大幅度的提升性能，很重要的一点是，**在移动端建连的消耗非常大，而SPDY协议可以完成多路复用的加密全双工通道，显著提升非wifi环境下的网络体验。**

俗话说，好刀配好鞘，好马配好鞍，当域名收敛配合SPDY才能最大程度发挥他们的效用，达到事半功倍。

>非原文：关于SPDY之后会在学习记录HTTP/2的时候详细说明。（这是一个flag=0.0）

>对所参考文章的作者表示感谢！！

## 参考文章

- [[前端性能]浅谈域名发散与域名收敛](https://cloud.tencent.com/developer/article/1136774)
- [3分钟弄明白顶级域名\|二级域名\|子域名\|父域名的区别](https://zhuanlan.zhihu.com/p/27290218)
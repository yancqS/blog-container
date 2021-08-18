---
title: How JavaScript works - Deep dive into WebSockets and HTTP/2 with SSE + how to pick the right path
description: How Javascript works
date: '2021-08-18'
author: Yoha
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210816143708.png
tags:
    - 翻译
    - 转载
    - JavaScript
meta:
  - name: title
    content: 深入理解WebSockets和带有SSE机制的Http/2以及正确的使用姿势
  - name: description
    content: 深入理解WebSockets和带有SSE机制的Http/2以及正确的使用姿势
  - name: keywords
    content: WebSockets, Http/2
  - name: author
    content: Yoha
featured: true
---
# How JavaScript works - Deep dive into WebSockets and HTTP/2 with SSE + how to pick the right path

> Javascript 工作原理 - 深入理解WebSockets和带有SSE机制的Http/2以及正确的使用姿势

This is post # 5 of the series dedicated to exploring JavaScript。

> 这是 Javascript 工作原理系列的第五章。

This time we’ll dive into the world of communication protocols, mapping and discussing their attributes and building parts on the way. We’ll offer a quick comparison of WebSockets and HTTP/2. At the end, we share some ideas on how to choose which way to go when it comes to network protocols.

> 这次我们将会深入通信协议的世界，列举并讨论它们的特点和内部构造。我们将会给出一份 WebSockets 和 HTTP/2 的快速比较 。在文末，我们将会分享一些有关如何正确地选择网络协议的见解。

## Intro

> 简介

Nowadays complex web apps that feature rich, dynamic UIs are taken for granted. And it’s not surprising — the internet has come a long way since its inception.

> 现在，复杂的网页程序拥有丰富的功能，动态交互能力被认为是理所当然的事情。而这并不令人感到惊讶－因为自互联网诞生以来，它已走过一段漫长的时间。

Initially, the internet wasn’t built to support such dynamic and complex web apps. It was conceived to be a collection of HTML pages, linking to one another to form the concept of “web” that contains information. Everything was largely built around the so-called request/response paradigm of HTTP. A client loads up a page and then nothing happens until the user clicks and navigates to the next page.

> 起初，互联网并不是用来支持如此动态和复杂的网页程序的。它本来设想是由大量的 HTML 页面组成的，每个页面链接到其它的页面，这样就形成了包含信息的网页的概念。一切都是极大地围绕着所谓的 HTTP 请求/响应模式来建立的。客户端加载一个网页，直到用户点击页面并导航到下一个网页。

Around 2005, AJAX was introduced and a lot of people started to explore the possibilities of making connections between a client and а server **bidirectional**. Still, all HTTP communication was steered by the client, which required user interaction or periodic polling to load new data from the server.

> 大约在 2005 年，引入了 AJAX，然后，很多人开始探索客户端和服务端双向通信的可能性。不变的是，所有的 HTTP 通信都是由客户端控制的，意即必须由用户交互或者定期轮询以从服务器加载数据。

## Making HTTP “bidirectional”

> 让 HTTP 支持双向通信

Technologies that enable the server to send data to the client “proactively” have been around for quite some time. “[Push](https://en.wikipedia.org/wiki/Push_technology)” and “[Comet](http://en.wikipedia.org/wiki/Comet_(programming))” to name a few.

> 支持服务器主动向客户端推送数据的技术已经出现了好一段时间了。比如 "[Push](https://en.wikipedia.org/wiki/Push_technology)" 和 "[Comet](http://en.wikipedia.org/wiki/Comet_(programming))" 技术。

One of the most common hacks to create the illusion that the server is sending data to the client is called **long polling**. With long polling, the client opens an HTTP connection to the server which keeps it open until a response is sent. Whenever the server has new data that has to be sent, it transmits it as a response.

> 长轮询是产生服务端主动向客户端发送数据这一错觉最常见的 hack 之一。通过长轮询，客户端打开了一个连接到服务端的 HTTP 连接，服务端保持该连接直到返回响应数据。当服务端有新数据需要发送时，它会把新数据作为响应发送给客户端。

Let’s see how a very simple long polling snippet might look like:

> 让我们看一下简单的长轮询代码片段：

```js
(function poll(){
   setTimeout(function(){
      $.ajax({ 
        url: 'https://api.example.com/endpoint', 
        success: function(data) {
          // Do something with `data`
          // ...

          //Setup the next poll recursively
          poll();
        }, 
        dataType: 'json'
      });
  }, 10000);
})();
```

This is basically a self-executing function that runs the first time automatically. It sets up the ten (10) second interval and after each async Ajax call to the server, the callback calls `ajax` again.

> 这是一个基础的自执行函数，第一次会自动运行。它每隔 10 秒钟异步请求服务器并且当每次发起对服务器的异步请求之后，会在回调函数里面再次调用 `ajax` 函数。

Other techniques involve [`Flash`](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/Socket.html) or `XHR multipart request` and the so-called `htmlfiles`.

> 其它技术涉及到 [`Flash`](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/Socket.html) 和 `XHR 多方请求`以及所谓的 `htmlfiles`。

All these workarounds share the same problem though: they carry the overhead of HTTP, which doesn’t make them well-suited for low-latency applications. Think multiplayer first-person shooter games in the browser or any other online game with a realtime component.

> 所有这些方案都有一个共同的问题：都带有 HTTP 开销，这样就会使得它们不适用于低延迟程序。试想一下浏览器中的第一人称射击游戏或者其它要求实时功能的在线游戏。

## The introduction of WebSockets

> webScokets 的出现

The [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) specification defines an API establishing “socket” connections between a web browser and a server. In plain words: there is a persistent connection between the client and the server and both parties can start sending data at any time.

> [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 规范定义了一个 API 用以在网页浏览器和服务器建立一个套接字连接。通俗地讲：在客户端和服务器保有一个永久连接，两边可以在任意时间开始发送数据。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210719200701.png)

The client establishes a WebSocket connection through a process known as the WebSocket **handshake**. This process starts with the client sending a regular HTTP request to the server. An `Upgrade` header is included in this request which informs the server that the client wishes to establish a WebSocket connection.

> 客户端通过 WebSocket 握手的过程来创建 WebSocket 连接。在这一过程中，首先客户端向服务器发起一个常规的 HTTP 请求。请求中会包含一个 `Upgrade` 的请求头，通知服务器客户端想要建立一个 WebSocket 连接。

Let’s see how opening a WebSocket connection looks like on the client side:

> 让我们看下如何在客户端创建 WebSocket 连接：

```js
// Create a new WebSocket with an encrypted connection.
var socket = new WebSocket('ws://websocket.example.com');
```

> WebSocket URLs use the `ws` scheme. There is also `wss` for secure WebSocket connections which is the equivalent of `HTTPS`.
>
> 网页套接字地址使用了 `ws` 协议。`wss` 是一个等同于 `HTTPS` 的安全的网页套接字连接。

This scheme just starts the process of opening a WebSocket connection towards `websocket.example.com`.

> 该协议开始启动打开到 `websocket.example.com` 的 WebSocket 连接的过程。

Here is a simplified example of the initial request headers.

> 下面是初始化请求头的简化例子。

```
GET ws://websocket.example.com/ HTTP/1.1
Origin: http://example.com
Connection: Upgrade
Host: websocket.example.com
Upgrade: websocket
```

If the server supports the WebSocket protocol, it will agree to the upgrade and will communicate this through the `Upgrade` header in the response.

> 如果服务器支持网页套接字协议，它将会同意升级请求，然后通过在响应里面返回 `Upgrade` 头来进行通信。

Let’s see how this can be implemented in Node.JS:

> 让我们看下 Node.js 的实现：

```js
// We'll be using the https://github.com/theturtle32/WebSocket-Node
// WebSocket implementation
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
  // process HTTP request. 
});
server.listen(1337, function() { });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
      // Process WebSocket message
  });

  connection.on('close', function(connection) {
    // Connection closes
  });
});
```

After the connection is established, the server replies by upgrading:

> 连接建立之后，服务器使用升级来作为回复：

```
HTTP/1.1 101 Switching Protocols
Date: Wed, 25 Oct 2017 10:07:34 GMT
Connection: Upgrade
Upgrade: WebSocket
```

Once the connection has been established, the `open` event will be fired on your WebSocket instance on the client side:

> 一旦连接建立，会触发客户端网页套接字实例的 `open` 事件。

```js
var socket = new WebSocket('ws://websocket.example.com');

// Show a connected message when the WebSocket is opened.
socket.onopen = function(event) {
  console.log('WebSocket is connected.');
};
```

Now that the handshake is complete the initial HTTP connection is replaced by a WebSocket connection that uses the same underlying TCP/IP connection. At this point, either party can start sending data.

> 现在，握手结束了，最初的 HTTP 连接被替换为 WebSocket 连接，该连接底层使用同样的 TCP/IP 连接。现在两边都可以开始发送数据了。

With WebSockets, you can transfer as much data as you like without incurring the overhead associated with traditional HTTP requests. Data is transferred through a WebSocket as ***messages***, each of which consists of one or more ***frames*** containing the data you are sending (the payload). In order to ensure the message can be properly reconstructed when it reaches the client each frame is prefixed with 4–12 bytes of data about the payload. Using this frame-based messaging system helps to reduce the amount of non-payload data that is transferred, leading to significant reductions in latency.

> 通过 WebSocket，你可以随意发送数据而不用担心传统 HTTP 请求所带来的相关开销。数据是以消息的形式通过 WebSocket 进行传输的，每条信息是由一个或者多个帧组成，帧包含你所传输的数据(有效载荷)。为了保证当消息到达客户端的时候被正确地重新组装出来，每一帧都会前置关于有效载荷的 4-12 个字节的数据。使用这种基于帧的信息系统可以帮助减少非有效载荷数据的传输，从而显著地减少延迟。

**Note**: It’s worth noting that the client will only be notified about a new message once all of the frames have been received and the original message payload has been reconstructed.

> 这里需要注意的是只有当所有的消息帧都被接收到而且原始的信息有效载荷被重新组装的时候，客户端才会接收到新消息的通知。

## WebSocket URLs

> WebSocket 地址

We briefly mentioned before that WebSockets introduce a new URL scheme. In reality, they introduce two new schemes: `ws://` and `wss://`.

> 前面我们简要地谈到 WebSockets 引进了一个新的地址协议。实际上，WebSocket 引进了两种新协议：`ws://` 和 `wss://`。

URLs have scheme-specific grammar. WebSocket URLs are special in that they do not support anchors ( `#sample_anchor` ).

> URL 地址含有协议指定的语法。WebSocket 地址特别之处在于，它不支持锚(`sample_anchor`)。

The same rules apply to WebSocket style URLs as to HTTP style URLs. `ws` is unencrypted and has port 80 as default, while `wss` requires TLS encryption and has port 443 as default.

> WebSocket 风格的地址和 HTTP 风格的地址使用相同的地址规则。`ws` 是未加密且默认是 80 端口，而 `wss` 要求 TSL 加密且默认 443 端口。

## Framing protocol

> 帧协议

Let’s take a deeper look at the framing protocol. This is what the [RFC](https://tools.ietf.org/html/rfc6455#page-27) provides us with:

> 让我们深入了解下帧协议。这是 [RFC](https://tools.ietf.org/html/rfc6455#page-27) 提供的：

```
 			0                   1                   2                   3
      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     +-+-+-+-+-------+-+-------------+-------------------------------+
     |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
     |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
     |N|V|V|V|       |S|             |   (if payload len==126/127)   |
     | |1|2|3|       |K|             |                               |
     +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
     |     Extended payload length continued, if payload len == 127  |
     + - - - - - - - - - - - - - - - +-------------------------------+
     |                               |Masking-key, if MASK set to 1  |
     +-------------------------------+-------------------------------+
     | Masking-key (continued)       |          Payload Data         |
     +-------------------------------- - - - - - - - - - - - - - - - +
     :                     Payload Data continued ...                :
     + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
     |                     Payload Data continued ...                |
     +---------------------------------------------------------------+
```

As of the WebSocket version specified by the RFC, there’s only a header in front of each packet. It’s quite a complex header, however. Here are its building blocks explained:

> 由于 WebSocket 版本是由 RFC 所规定的，所以每个包前面只有一个头部信息。然而，这个头部信息相当的复杂。这是其组成模块的说明：

- `fin` (*1 bit*): indicates if this frame is the final frame that makes up the message. Most of the time the message fits into a single frame and this bit will always be set. Experiments show that Firefox makes a second frame after 32K.

  > `fin`(1 位)：指示是否是组成信息的最后一帧。大多数时候，信息正好一帧所以该位通常有值。测试表明火狐的第二帧数据在 32K 之后。

- `rsv1`, `rsv2`, `rsv3` (*1 bit each*): must be 0 unless an extension is negotiated that defines meanings for non-zero values. If a nonzero value is received and none of the negotiated extensions defines the meaning of such a nonzero value, the receiving endpoint must fail the connection.

  > `rsv1`，`rsv2`，`rsv3`(每个一位)：必须是 0 除非使用协商扩展来定义非 0 值的含义。如果收到一个非 0 值且没有协商扩展来定义非零值的含义，接收端会中断连接。

- `opcode` (*4 bits*): says what the frame represents. The following values are currently in use:
  
  - `0x00`: this frame continues the payload from the previous.
    
  - `0x01`: this frame includes text data.
    
  - `0x02`: this frame includes binary data.
    
  - `0x08`: this frame terminates the connection.
    
  - `0x09`: this frame is a ping.
    
  - `0x0a`: this frame is a pong.
    
    (As you can see, there are enough values unused; they’ve been reserved for future use).
  
  > `opcode`(4 位)：帧表示的数据。目前可用的值：
  >
  > - `0x00`：该帧接续前面一帧的有效载荷。
  > - `0x01`：该帧包含文本数据。
  > - `0x02`：该帧包含二进制数据。
  > - `0x08`：该帧中断连接。
  > - `0x09`：该帧是一个 ping。
  > - `0x0a`：该帧是一个pong。
  >
  > 正如你所看到的，有相当一部分值未被使用；它们是保留以备将来使用的。
  
- `mask` (*1 bit*): indicates if the connection is masked. As it stands right now, every message from a client to a server *must be masked* and the spec would want to terminate the connection if it’s unmasked.

  > `mask`(1 位)：指示该连接是否被遮罩。正其所表示的意义，每一条从客户端发往服务器的信息都必须被遮罩，然后如果信息未遮罩，根据规范会中断该连接。

- `payload_len` (*7 bits*): the length of the payload. WebSocket frames come in the following length brackets:
  0–125 indicates the length of the payload. 126 means that the following two bytes indicate the length, 127 means the next 8 bytes indicate the length. So the length of the payload comes in ~7bit, 16bit, and 64bit brackets.

  > `payload_len`(7 位)：有效载荷的长度。WebSocket 帧有以下长度分类：
  >
  > 0-125 表示有效载荷的长度。126 意味着接下来两个字节表示有效载荷长度，127 意味着接下来的 8 个字节表示有效载荷长度。所以有效载荷的长度大概有 7 位，16 位和 64 位这三个等级。

- `masking-key` (*32 bits*): all frames sent from the client to the server are masked by a 32-bit value that is contained within the frame.

  > `masking-key` (32 位)：所有从客户端发往服务器的帧都由帧内的一个 32 位值所遮罩。

- `payload`: the actual data which most likely is masked. Its length is the length of the `payload_len`.

  > `payload`：一般情况下被遮罩的实际数据。其长度取决于 `payload_len` 的长度。

Why are WebSockets frame-based and not stream-based? I don’t know and just like you, I’d love to learn more, so if you have an idea, feel free to add comments and resources in the responses below. Also, a good [discussion on the topic is available on HackerNews](https://news.ycombinator.com/item?id=3377406).

> 为什么 WebSocket 是基于帧而不是基于流的呢？我和你一样不明白，我也想多学点，如果你有任何想法，欢迎在下面的评论区添加评论和资源。另外，[HackerNews](https://news.ycombinator.com/item?id=3377406) 上面有关于这方面的讨论。

## Data on the frames

> 帧数据

As mentioned above, the data can be fragmented into multiple frames. The first frame that transmits the data has an opcode on it that indicates what sort of data is being transmitted. This is necessary because JavaScript has pretty much nonexistent support for binary data at the time the specification was started. `0x01` indicates utf-8 encoded text data, `0x02` is binary data. Most people will transmit JSON in which case you’d probably want to choose the text opcode. When you emit binary data it will be represented in a browser specific [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

> 正如之前提到的，数据可以被拆分为多个帧。第一帧所传输的数据里面含有一个操作码表示传输的数据类型。这是必须的，因为当规范起草的时候，JavaScript 并不能很好地支持二进制数据。`0x01` 表示 utf-8 编码的文本数据，`0x02` 表示二进制数据。大多数人在传输 JSON 数据的时候都会选择文本操作码。当你传输二进制数据的时候，它会以浏览器指定的 [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) 来表示。

The API for sending data through a WebSocket is very simple:

> 通过 WebSocket 来传输数据的 API 是非常简单的：

```js
var socket = new WebSocket('ws://websocket.example.com');
socket.onopen = function(event) {
  socket.send('Some message'); // Sends data to server.
};
```

When the WebSocket is receiving data (on the client side), a `message` event is fired. This event includes a property called `data` that can be used to access the contents of the message.

> 当 WebSocket 正在接收数据的时候（客户端），会触发 `message` 事件。该事件会带有一个 `data` 属性，里面包含了消息的内容。

```js
// Handle messages sent by the server.
socket.onmessage = function(event) {
  var message = event.data;
  console.log(message);
};
```

You can easily explore the data in each of the frames in your WebSocket connection using the Network Tab inside Chrome DevTools:

> 你可以很容易地利用 Chrome 开发者工具的网络选项卡来检查 WebSocket 连接中的每一帧的数据。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210721214111.png)

## Fragmentation

> 数据分片

Payload data can be split up into multiple individual frames. The receiving end is supposed to buffer them up until the `fin` bit is set. So you can transmit the string “Hello World” in 11 packages of 6 (header length) + 1 byte each. Fragmentation is not allowed for control packages. However, the specification wants you to be able to handle [interleaved](https://en.wikipedia.org/wiki/Interleaving_(data)) control frames. That’s in case TCP packages arrive in arbitrary order.

> 有效载荷数据可以被分成多个独立的帧。接收端会缓冲这些帧直到 `fin` 位有值。所以你可以把字符串『Hello World』拆分为 11 个包，每个包由 6(头长度) + 1 字节组成。数据分片不能用来控制包。然而，规范想要你有能力去处理[交错](https://en.wikipedia.org/wiki/Interleaving_(data))控制帧。这是为了预防 TCP 包无序到达客户端。

The logic for joining frames is roughly the following:

- receive the first frame
- remember opcode
- concatenate frame payload together until the `fin` bit is set
- assert that the opcode for each package is zero

> 连接帧的大概逻辑如下：
>
> - 接收第一帧
> - 记住操作码
> - 连接帧有效载荷直到 `fin` 位有值
> - 断言每个包的操作码都为 0

The primary purpose of fragmentation is to allow sending a message that is of unknown size when the message is started. With fragmentation, a server may choose a reasonable size buffer and, when the buffer is full, write a fragment to the network. A secondary use case for fragmentation is for multiplexing, where it is not desirable for a large message on one logical channel to take over the whole output channel, so the multiplexing needs to be free to split the message into smaller fragments to better share the output channel.

> 数据分片的主要目的在于允许开始时传输不明大小的信息。通过数据分片，服务器可能需要设置一个合理的缓冲区大小，然后当缓冲区满，通过网络发送一个数据分片。数据分片的第二个用途即多路复用，逻辑通道上的大量数据占据整个输出通道是不合理的，所以利用多路复用技术把信息拆分成更小的数据分片以更好地共享输出通道。

## What is Hearbeating?

> 心跳包

At any point after the handshake, either the client or the server can choose to send a ping to the other party. When the ping is received, the recipient must send back a pong as soon as possible. That’s a heartbeat. You can use it to make sure that the client is still connected.

> 握手之后的任意时刻，客户端和服务器可以随意地 ping 对方。当接收到 ping 的时候，接收方必须尽快回复一个 pong。此即心跳包。你可以用它来确保客户端是否仍然保持连接。

A ping or pong is just a regular frame, but it’s a **control frame**. Pings have an opcode of `0x9`, and pongs have an opcode of `0xA`. When you get a ping, send back a pong with the exact same Payload Data as the ping (for pings and pongs, the max payload length is **125**). You might also get a pong without ever sending a ping. Ignore it if it happens.

> ping 或者 pong 虽然只是一个普通帧，但却是一个控制帧。Ping 包含 `0x9` 操作码，而 Pong 包含 `0xA` 操作码。当你接收到 ping 的时候，返回一个和 ping 携带同样有效载荷数据的 pong(ping 和 pong 最大有效载荷长度都为 125)。你可能接收到一个 pong 而未曾发送一个 ping。如果有发生这样的情况请忽略它。

Heartbeating can be very useful. There are services (like load balancers) that will terminate idle connections. Plus, it’s not possible for the receiving side to see if the remote side has terminated. Only at the next send would you realize that something went wrong.

> 心跳包非常有用。利用服务（比如负载均衡器）来中断空闲的连接。另外，接收端不可能知道服务端是否已经中断连接。只有在发送下一帧的时候，你才会意识到发生了错误。

## Handling Errors

> 处理错误

You can handle any errors that occur by listening out for the `error` event.

> 你可以通过监听 `error` 事件来处理错误。

It looks like this:

> 像这样：

```js
var socket = new WebSocket('ws://websocket.example.com');

// Handle any error that occurs.
socket.onerror = function(error) {
  console.log('WebSocket Error: ' + error);
};
```

## Closing the Connection

> 关闭连接

To close a connection either the client or server should send a control frame with data containing an opcode of `0x8`. Upon receiving such a frame, the other peer sends a Close frame in response. The first peer then closes the connection. Any further data received after closing the connection is then discarded.

> 客户端或服务器可以发送一个包含 `0x8` 操作码的数据控制帧来关闭连接。当接收到控制帧的时候，另一个节点会返回一个关闭帧。之后第一个节点会关闭连接。关闭连接之后，之后接收的任何数据都会被遗弃。

This is how you initiate the closing of a WebSocket connection from the client:

> 这是初始化关闭客户端的 WebSocket 连接的代码：

```js
// Close if the connection is open.
if (socket.readyState === WebSocket.OPEN) {
    socket.close();
}
```

Also, in order to perform any clean up after the closing has completed, you can attach an event listener to the `close` event:

> 同样地，为了关闭连接后运行任意清理工作，你可以为 `close` 事件添加事件监听函数：

```js
// Do necessary clean up.
socket.onclose = function(event) {
  console.log('Disconnected from WebSocket.');
};
```

The server has to listen on the `close` event in order to process it if needed:

> 服务器不得不监听 `close` 事件以便在需要的时候处理：

```js
connection.on('close', function(reasonCode, description) {
    // The connection is getting closed.
});
```

## How do WebSockets and HTTP/2 compare?

> WebSockets 和 HTTP/2 对比

While HTTP/2 has a lot to offer, it doesn’t completely replace the need for existing push/streaming technologies.

> 虽然 HTTP/2 提供了很多的功能，但是它并不能完全取代当前的 push/streaming 技术。

The first important thing to notice about HTTP/2 is that it’s not a replacement for all of HTTP. The verbs, status codes and most of the headers will remain the same as today. HTTP/2 is about improving the efficiency of the way data is transferred on the wire.

> 关于 HTTP/2 需要注意的最重要的事即它并不能完全取代 HTTP。动词，状态码以及大部分的头部信息都会保持和现在一样。HTTP/2 只是提升了线路上的数据传输效率。

Now, if we compare HTTP/2 to WebSocket, we can see a lot of similarities:

> 现在，如果我们对比 WebSocket 和 HTTP/2，将会发现很多类似的地方：

|                | HTTP/2                      | WebSocket         |
| -------------- | --------------------------- | ----------------- |
| Headers        | Compressed(HPACK)           | None              |
| Binary         | Yes                         | Binary or Textual |
| Multiplexing   | Yes                         | Yes               |
| Prioritization | Yes                         | No                |
| Compression    | Yes                         | Yes               |
| Direction      | Client/Server + Server Push | Bidirectional     |
| Full-duplex    | Yes                         | Yes               |

As we have seen above, HTTP/2 introduces [Server Push](https://en.wikipedia.org/wiki/Push_technology?oldformat=true) which enables the server to proactively send resources to the client cache. It does not, however, allow for pushing data down to the client application itself. Server pushes are only processed by the browser and do not pop up in the application code, meaning there is no API for the application to get notifications for those events.

> 正如以上所显示的那样，HTTP/2 引进了 [Server Push](https://en.wikipedia.org/wiki/Push_technology?oldformat=true) 技术用来让服务器主动向客户端缓存发送数据。然而，它并不允许直接向客户端程序本身发送数据。服务端推送只能由浏览器处理而不能够在程序代码中进行处理，意即程序代码没有 API 可以用来获取这些事件的通知。

This is where Server-Sent Events (SSE) become very useful. SSE is a mechanism that allows the server to asynchronously push the data to the client once the client-server connection is established. The server can then decide to send data whenever a new “chunk” of data is available. It can be considered as a one-way [publish-subscribe](https://en.wikipedia.org/wiki/Publish–subscribe_pattern) model. It also offers a standard JavaScript client API named EventSource implemented in most modern browsers as part of the HTML5 standard by [W3C](https://www.w3.org/TR/eventsource/). Note that browsers that do not support [EventSource API](http://caniuse.com/#feat=eventsource) can be easily polyfilled.

> 这时候服务端推送事件（SSE）就派上用场了。SSE 的机制是这样的：一旦客户端－服务器连接建立，它允许服务器异步推送数据给客户端。之后，每当服务器产生新数据分片的时候，就推送数据给客户端。这可以看成是单向的发布－订阅模型。它也提供了一个被称为 EventSource 的 标准 JavaScript 客户端 API，该 API 作为 [W3C](https://www.w3.org/TR/eventsource/) 组织发布的 HTML5 标准的一部分已经在大多数的现代浏览器中实现。注意不支持原生 [EventSource API](http://caniuse.com/#feat=eventsource) 的浏览器可以通过兼容插件实现。

Since SSE is based on HTTP, it has a natural fit with HTTP/2 and can be combined to get the best of both: HTTP/2 handling an efficient transport layer based on multiplexed streams and SSE providing the API up to the applications to enable push.

> 由于 SSE 是基于 HTTP 的，所以它天然兼容于 HTTP/2 并且可以组合使用以利用各自的优势： HTTP/2 处理一个基于多路复用流的高效传输层而 SSE 为程序提供了 API 用来支持服务端推送。

To fully understand what Streams and Multiplexing are all about, let’s first have a look at the IETF definition: *a “stream” is an independent, bidirectional sequence of frames exchanged between the client and server within an HTTP/2 connection. One of its main characteristics is that a single HTTP/2 connection can contain multiple concurrently open streams, with either endpoint interleaving frames from multiple streams.*

> 为了完全理解流和多路复用技术，先让我们来了解一下 IETF 的定义：『流』即是在一个 HTTP/2 连接中，在客户端和服务端间进行交换传输的一个独立的双向帧序列。它的主要特点之一即单个的 *HTTP/2* 连接可以包含多个并发打开的流，在每一终端交错传输来自多个流的帧。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210816143708.png)

We have to remember that SSE is HTTP-based. It means that with HTTP/2, not only can several SSE streams be interleaved onto a single TCP connection, but the same can also be done with a combination of several SSE streams (server to client push) and several client requests (client to server). Thanks to HTTP/2 and SSE, now we have a pure HTTP bidirectional connection with a simple API to let application code register to server pushes. Lack of bidirectional capabilities has often been perceived as a major drawback when comparing SSE to WebSocket. Thanks to HTTP/2 this is no longer the case. This opens up the opportunity to skip WebSockets and stick to an HTTP-based signaling instead.

> 必须记住的是 SSE 是基于 HTTP 的。这意味着，通过使用 HTTP/2，不仅仅可以把多个 SSE 流交叉合并成单一的 TCP 连接，还可以把多个 SSE 流（服务端向客户端推送）和多个客户端请求（客户端到服务端）合并成单一的 TCP 连接。多亏了 HTTP/2 和 SSE，现在我们有了一个纯粹的 HTTP 双向连接，该连接带有一个简单的 API 允许程序代码注册监听服务端的数据推送。缺乏双向通信能力一直被认为是 SSE 对比 WebSocket 的主要缺点。多亏了 HTTP/2，这不再是缺点。这就让你有机会坚持使用基于 HTTP 的通信系统而非 WebSockets。

## How to choose between WebSocket and HTTP/2?

> WebScoket 和 HTTP/2 的使用场景

WebSockets will certainly survive the domination of HTTP/2 + SSE, mainly because it’s a technology already well adopted and, in very specific use cases, it has an advantage over HTTP/2 as it has been built for bidirectional capabilities with less overhead (e.g. headers).

> WebSockets 依然可以在 HTTP/2 + SSE 的统治下存在，主要是由于它曾经是被广泛使用的技术，在特殊情况下，和 HTTP/2 比较它有一个优点即它天生拥有更少的开销（比如，头部信息）的双向通信能力。

Say you want to build a Massive Multiplayer Online Game that needs a huge amount of messages from both ends of the connection. In such a case, WebSockets will perform much, much better.

> 假设你想要构建一个大型的多人在线游戏，在各个连接终端会产生大量的信息。在这样的情况下，WebSockets 会表现得更加完美。

In general, use WebSockets whenever you need a truly **low-latency**, near realtime connection between the client and the server. Keep in mind that this might require rethinking how you build your server-side applications, as well as shifting the focus on technologies like event queues.

> 总之，当你需要在客户端和服务端建立一个真正的低延迟的，接近实时连接的时候使用 WebSockets。记住这可能要求你重新考虑如何构建服务器端程序，同时也需要你关注诸如事件队列的技术。

If your use case requires displaying real-time market news, market data, chat applications, etc., relying on HTTP/2 + SSE will provide you with an efficient bidirectional communication channel while reaping the benefits from staying in the HTTP world:

> 如果你的使用场景要求显示实时市场新闻，市场数据，聊天程序等等，HTTP/2 + SSE 将会为你提供一个高效的双向通信通道的同时可以得到 HTTP 的所有益处：

- WebSockets can often be a source of pain when considering compatibility with existing web infrastructure as it upgrades an HTTP connection to a completely different protocol that has nothing to do with HTTP.

  > 当考虑现有架构的兼容性的时候，WebSockets 经常会是一个痛点，因为升级 HTTP 连接到一个完全和 HTTP 不相关的协议。

- Scale and security: Web components (Firewalls, Intrusion Detection, Load Balancers) are built, maintained and configured with HTTP in mind, an environment that large/critical applications will prefer in terms of resiliency, security, and scalability.

  > 可扩展性和安全：网络组件（防火墙，入侵检测，负载均衡器）的建立，维护和配置都是为 HTTP 而设计的，大型／重要的程序会更喜欢具有弹性，安全和可伸缩性的环境。

Also, you have to take into consideration browser support. Have a look at the WebSocket:

> 同样地，你不得不考虑浏览器兼容性。查看下 WebSocket 兼容情况：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210818192246.png)

It’s quite good actually, isn’t it?

> 兼容性还不错。

The situation with HTTP/2, however, is not the same.

> 然而，HTTP/2的情况就不太秒了。

> PS：非原文：当时作者在写这篇文章时是2017年，兼容性确实不太好（83.74%）；但目前来看，HTTP/2的兼容性也还不错。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210818192359.png)

值得注意的是：

- TLS-only (which is not so bad)
- Partial support in IE 11 but only on Windows 10
- Only supported on OSX 10.11+ in Safari
- Only supports HTTP/2 if you can negotiate it via ALPN (which is something your server needs to support explicitly)

> - 仅支持 TLS（还不算坏）
> - 仅限于 Windows 10 的 IE 11 部分支持
> - 仅支持 OSX 10.11+ Safari 浏览器（Version: 9-10.1）
> - 仅当你能够通过 ALPN 使用 HTTP/2 （服务器需要明确支持的东西）才会支持 HTTP/2

The SSE support is better though:

> SSE支持情况：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210818192927.png)

Only IE/Edge don’t provide support. (Well, Opera Mini supports neither SSE nor WebSockets so we can take it out of the equation altogether). There are some decent polyfills out there for SSE support in IE/Edge.

> 仅 IE/Edge 不支持。（好吧，Opera Mini 即不支持 SSE 也不支持 WebSockets，因此我们把它完全排队在外）。有一些还不错的垫片来让 IE/Edge 支持 SSE。

## How we make the decision at SessionStack

> SessionStack 是如何选择的

We at [SessionStack ](https://www.sessionstack.com/?utm_source=medium&utm_medium=blog&utm_content=Post-5-websockets-outro)use both WebSockets and HTTP, depending on the case. Once you integrate SessionStack into your web app, it starts recording all DOM changes, user interactions, JavaScript exceptions, stack traces, failed network requests, and debug messages, allowing you to replay issues in your web apps as videos and see everything that happened to your users. It’s all taking place **real-time** and needs to happen with no performance impact for your web app.

> [SessionStack ](https://www.sessionstack.com/?utm_source=medium&utm_medium=blog&utm_content=Post-5-websockets-outro) 同时使用 WebSockets 和 HTTP，这取决于使用场景。一旦整合 SessionStack 进网页程序，它会开始记录 DOM 变化，用户交互，JavaScript 异常，堆栈追踪，失败的网络请求以及调试信息，允许你用视频回放网页程序中的问题及发生在用户身上的一切事情。全部都是实时发生的并且要求对网页程序不会产生任何的性能影响。

This means that you can join a user session **live,** while the user is still in the browser. In this scenario, we have chosen to leverage HTTP, since there is no bidirectional communication (the server just “streams” the data to the browser). A WebSocket, in this case, will be an overkill really, harder to maintain and scale.

> 这意味着你可以实时加入到用户会话，而用户仍然在浏览器中。这样的情况下，我们会选择使用 HTTP，因为这并不需要双向通信（服务端把数据传输到浏览器端）。当前情况下，使用 WebSocket 就是过度使用，难以维护和扩展。

The SessionStack library that gets integrated into your web app, however, uses a WebSocket (if possible, otherwise falls back to HTTP). It’s batching and sending the data to our servers which is also a one-way communication. We chose WebSocket in this case because some of the product features that are on the roadmap would require a bidirectional communication.

> 然而，整合进网页程序的 SessionStack 库应用了 WebSocket（优先使用，否则回滚到 HTTP）。它会分批处理并且向我们的服务器发送数据，这是单向通信。在这种情况下，之所以选择 WebSocket 是因为计划中的某些产品功能可能需要进行双向通信。

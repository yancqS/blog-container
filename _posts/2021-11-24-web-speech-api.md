---
title: Web Speech API
description: Web Speech API
date: '2021-11-24'
author: Yoha
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210925163443.gif
tags:
    - JavaScript
meta:
  - name: title
    content: Web Speech API
  - name: description
    content: Web Speech API
  - name: keywords
    content: Web Speech API
  - name: author
    content: Yoha
featured: true
---
# Web Speech API

## 前言

前几天在看阮一峰老师的[科技爱好者周刊173期](https://www.ruanyifeng.com/blog/2021/08/weekly-issue-173.html)时看到一篇关于语音识别的文章——[Voice to Text with Chrome Web Speech API](https://bensonruan.com/voice-to-text-with-chrome-web-speech-api/)。网页、语音识别、语音合成感觉挺好玩的，了解了一下。

## 正文

Web Speech API 有两个部分：SpeechSynthesis 语音合成 (文本到语音 TTS) 和 SpeechRecognition 语音识别 (异步语音识别)。

语音识别通过 [`SpeechRecognition`](https://developer.mozilla.org/zh-CN/docs/Web/API/SpeechRecognition) 接口进行访问，它提供了识别从音频输入（通常是设备默认的语音识别服务）中识别语音情景的能力。一般来说，你将使用该接口的构造函数来构造一个新的 [`SpeechRecognition`](https://developer.mozilla.org/zh-CN/docs/Web/API/SpeechRecognition) 对象，该对象包含了一系列有效的对象处理函数来检测识别设备麦克风中的语音输入。

### SpeechRecognition

#### 兼容性

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210906205134.png)

语音识别对象`SpeechRecognition`有许多属性、方法和事件处理程序。有关完整接口列表，请参阅https://w3c.github.io/speech-api/#speechreco-section

```js
interface SpeechRecognition : EventTarget {
    constructor();

    // recognition parameters
    attribute SpeechGrammarList grammars;
    attribute DOMString lang;
    attribute boolean continuous;
    attribute boolean interimResults;
    attribute unsigned long maxAlternatives;

    // methods to drive the speech interaction
    undefined start();
    undefined stop();
    undefined abort();

    // event methods
    attribute EventHandler onaudiostart;
    attribute EventHandler onsoundstart;
    attribute EventHandler onspeechstart;
    attribute EventHandler onspeechend;
    attribute EventHandler onsoundend;
    attribute EventHandler onaudioend;
    attribute EventHandler onresult;
    attribute EventHandler onnomatch;
    attribute EventHandler onerror;
    attribute EventHandler onstart;
    attribute EventHandler onend;
};
```

#### Properties

需要重点介绍的两个属性：`SpeechRecognition.continuous` 和 `SpeechRecognition.interimResults`.

当`SpeechRecognition.continuous`设置为true时，识别引擎将把你讲话的每一部分都视为临时结果。当`SpeechRecognition.interimResults`设置为true时，临时结果将会被返回。

`maxAlternatives`此属性将设置每个结果的 [SpeechRecognitionAlternatives](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionAlternative) 的最大数量。 默认值为 1。

```js
interface SpeechRecognitionAlternative {
    readonly attribute DOMString transcript;
    readonly attribute float confidence;
};
```

> 其他属性的含义可参考[MDN-Web Speech API](https://developer.mozilla.org/zh-CN/docs/Web/API/SpeechRecognition)

#### Methods

- SpeechRecognition.abort()

  语音识别服务停止接受传入的音频，并且不返回[SpeechRecognitionResult](https://developer.mozilla.org/zh-CN/docs/Web/API/SpeechRecognitionResult)。

- SpeechRecognition.start()

  启动语音识别服务，接受传入的音频，以识别与当前SpeechRecognition关联的`grammars`。

- SpeechRecognition.stop()

  语音识别服务停止接受传入的音频，返回[SpeechRecognitionResult](https://developer.mozilla.org/zh-CN/docs/Web/API/SpeechRecognitionResult)。

```js
interface SpeechRecognitionResultList {
    readonly attribute unsigned long length;
    getter SpeechRecognitionResult item(unsigned long index);
};
interface SpeechRecognitionResult {
    readonly attribute unsigned long length;
    getter SpeechRecognitionAlternative item(unsigned long index);
    readonly attribute boolean isFinal;
};
interface SpeechRecognitionAlternative {
    readonly attribute DOMString transcript;
    readonly attribute float confidence;
};
```

#### Event

最值得强调的事件是`result`.

此事件当语音识别服务返回结果时触发-一个单词或短语已被正确识别，并已反馈给应用程序。

```js
recognition.addEventListener('result', function(event) {});

// 或者

recognition.onresult = function(event) {}
```

打印一下`event.results`(返回`SpeechRecognitionResultList`):

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210907174315.png)

- `event.results[i]`: 包含识别结果对象的数组。 每个数组元素对应第i个识别阶段的一个识别词

- `event.result[i][j]`: 已识别单词的第 j 个选项。 第一个元素是最有可能识别的单词。

  > `maxAlternatives`此属性将设置每个结果的 [SpeechRecognitionAlternatives](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionAlternative) 的最大数量。 默认值为 1。这个属性将会影响`event.result[i]`数组的最大长度，最多识别的单词数。

- `event.results[i].isFinal`: 表明此结果是最终结果(`true`)还是临时结果(`false`)的布尔值。

- `event.results[i][j].transcript`: 对于输入语音识别的文本

- `event.results[i][j].confidence`: 对于输入语音识别文本的置信度（值从0到1）

#### 语音识别DEMO

语音识别可参考如下DEMO：

- github项目：[Chrome-Web-Speech-API](https://github.com/bensonruan/Chrome-Web-Speech-API)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210925163443.gif)

核心代码如下：

```js
recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.onstart = function() {
  //...
};
recognition.onerror = function(event) {
  // handle event.error
};
recognition.onend = function() {
  //...
};
recognition.onresult = function(event) {
  // console.log(event.results);
  var interim_transcript = '';
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
   	} else {
      interim_transcript += event.results[i][0].transcript;
    }
  }
 	final_transcript = capitalize(final_transcript);
  final_span.innerHTML = linebreak(final_transcript);
  interim_span.innerHTML = linebreak(interim_transcript);
};
```

- MDN示例：[speech-color-changer](https://github.com/mdn/web-speech-api/tree/master/speech-color-changer)

  MDN在线体验：[Speech color changer](https://mdn.github.io/web-speech-api/speech-color-changer/)

> 推荐第一个，作者写了一篇文章来解读[Voice to Text with Chrome Web Speech API](https://bensonruan.com/voice-to-text-with-chrome-web-speech-api/)

### SpeechSynthesis

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210906205206.png)

语音合成API的接口信息可参考[https://wicg.github.io/speech-api/#tts-section](The SpeechSynthesis Interface).

完整的属性和方法可参考[MDN-SpeechSynthesis](https://developer.mozilla.org/zh-CN/docs/Web/API/SpeechSynthesis)、[MDN-SpeechSynthesisUtterance](https://developer.mozilla.org/zh-CN/docs/Web/API/SpeechSynthesisUtterance).

```
// 截取部分关键API接口
interface SpeechSynthesis : EventTarget {
    readonly attribute boolean pending;
    readonly attribute boolean speaking;
    readonly attribute boolean paused;

    attribute EventHandler onvoiceschanged;

    undefined speak(SpeechSynthesisUtterance utterance);
    undefined cancel();
    undefined pause();
    undefined resume();
    sequence<SpeechSynthesisVoice> getVoices();
};

interface SpeechSynthesisUtterance : EventTarget {
    constructor(optional DOMString text);

    attribute DOMString text;
    attribute DOMString lang;
    attribute SpeechSynthesisVoice? voice;
    attribute float volume;
    attribute float rate;
    attribute float pitch;

    attribute EventHandler onstart;
    attribute EventHandler onend;
    attribute EventHandler onerror;
    attribute EventHandler onpause;
    attribute EventHandler onresume;
    attribute EventHandler onmark;
    attribute EventHandler onboundary;
};
```

#### Properties

- `SpeechSynthesis.paused`(只读)：当`SpeechSynthesis` 处于暂停状态时，返回 `true` 。
- `SpeechSynthesis.pending`(只读)：当语音播放队列到目前为止保持没有说完的语音时，返回`true`。
- `SpeechSynthesis.speaking`(只读)：当语音谈话正在进行的时候，即使`SpeechSynthesis`处于暂停状态，也会返回`true`。

#### Methods

- `SpeechSynthesis.cancel()`：移除所有语音谈话队列中的谈话。
- `SpeechSynthesis.getVoices()`：返回当前设备所有可用声音的列表。
- `SpeechSynthesis.pause()`：把 `SpeechSynthesis` 对象置为暂停状态。
- `SpeechSynthesis.resume()`：把 `SpeechSynthesis` 对象置为一个非暂停状态：如果已经暂停了则继续。
- `SpeechSynthesis.speak()`：添加一个 [`utterance`](https://developer.mozilla.org/zh-CN/docs/Web/API/SpeechSynthesisUtterance) 到语音谈话队列；它将会在其他语音谈话播放完之后播放。

需要重点注意的是`SpeechSynthesis.speak()`方法。在interface SpeechSynthesis中关于speak的规定是：`speak(SpeechSynthesisUtterance utterance);`。也就说speak方法接受的参数为SpeechSynthesisUtterance实例。

SpeechSynthesisUtterance实例**属性**：

- lang：获取或设置语音的语言，具体语言列表可以通过SpeechSynthesis.getVoices()获取
- pitch：获取或设置语音的音调
- rate：获取或设置语音的语速
- text：获取或设置朗读语音的文字
- voice：获取或设置用于朗读的语音
- volume：获取或设置朗读的音量

SpeechSynthesisUtterance**事件**可参考上面的SpeechSynthesisUtterance接口。

#### Event

`SpeechSynthesis.onvoiceschanged`：当由[`SpeechSynthesis.getVoices()`](https://developer.mozilla.org/zh-CN/docs/Web/API/SpeechSynthesis/getVoices)方法返回的[`SpeechSynthesisVoice`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice)列表改变时触发。

#### 语音朗读DEMO

在线例子[Speech synthesiser](https://mdn.github.io/web-speech-api/speak-easy-synthesis/)

> 涉及到大多数的属性和事件

对应代码库：[speak-easy-synthesis](https://github.com/mdn/web-speech-api/tree/master/speak-easy-synthesis)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20211124201151.png)

一个超级简单的小DEMO：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>speechSynthesis</title>
</head>

<body>
    <input type="text" id="info_text">
    <button type="button" onclick="play()">play</button>
    <script>
        function play() {
            let ele_val = document.querySelector('#info_text').value;
            let utterance = new SpeechSynthesisUtterance(ele_val);
            utterance.lang = 'en-US';
            utterance.rate = 1;
            utterance.pitch = 0.6;
            speechSynthesis.speak(utterance);
            // console.log(speechSynthesis.paused);
            // console.log(speechSynthesis.pending);
            // console.log(speechSynthesis.speaking);
            // console.log(speechSynthesis.getVoices());
        }
    </script>
</body>

</html>
```



## 参考文章

- [Voice to Text with Chrome Web Speech API](https://bensonruan.com/voice-to-text-with-chrome-web-speech-api/)
- [Web Speech API-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Speech_API)
- [Web Speech API](https://wicg.github.io/speech-api/#api_description)

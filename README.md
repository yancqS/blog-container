# 博客优化二三事

## 前言

交代一下背景，这个博客是最开始是基于`jekyll`搭建的github page，但是由于一些原因(主要是jekyll的主题觉得不好看), 寻寻觅觅，终于找到一个喜欢的主题，是基于Vuepress的，主题用的是[vuepress-theme-modern-blog](https://github.com/z3by/vuepress-theme-modern-blog)，于是就把博客迁移到基于Vuepress的github page。具体的迁移过程不复杂，个人的`.vuepress/config.js`可参考[这里](https://github.com/yancqS/vue-theme-custom)，在这篇文章就不再赘述。这篇文章主要打算记录一下迁移到Vuepress之后的一些问题的解决方法。

## 评论系统

迁移文章其实比较简单，因为都是一些markdown文件,也没什么需要改的。但是原来的评论系统不能用啦，vuepress-theme-modern-blog给出了一个评论系统`disqus`,但是这个评论系统在国内由于防火墙的原因支持的不太好。于是发现了`Vssue`评论系统，经过咔咔一顿配置(主要是github的access token等)，在一个md文件的最后添加`<Vssue :title="$title" />`一测试可以用，开心啊。但是接着问题就来啦,文章说多不多，说少不少，也不能一个个的手动去添加吧，好麻烦。于是写了个脚本:

```js
//append.js
const fs = require('fs');
const reg = /^.*\.md$/;
const _path = './_posts'

let all_files = fs.readdirSync(_path);
let files = all_files.filter(item => reg.test(item));

files.forEach(item => {
  try {
    fs.appendFileSync(`${_path}/${item}`, '\n\n<Vssue :title="$title" />\n');
  } catch(err) {
    console.log(err);
  }
})
```

齐活~~

但是好景不长，这个Vssue插件的用的代理`cors-anywhere`应该是做了一些限制，导致获取授权access_token的接口返回403，导致登录github失败，无发评论。在网上看了一些解决办法，但都以失败告终。于是选择了更换评论系统，经过比较我选择了`gittalk`，因为相对而言，更换到`gittalk`的成本比较低。具体的文章可参考[为你的VuePress博客添加GitTalk评论](https://cloud.tencent.com/developer/article/1533079)。

这个时候需要一个删除之前添加的`<Vssue :title="$title" />`的脚本：

```js
//deleteComponent.js
const fs = require('fs');
const reg = /^.*\.md$/;
const _path = './_posts'

let all_files = fs.readdirSync(_path);
let files = all_files.filter(item => reg.test(item));

files.forEach(item => {
  try {
    fs.readFile(`${_path}/${item}`, 'utf-8', (err, data) => {
      if(err) console.log(err);
      fs.writeFile(`${_path}/${item}`, data.replace(/\n\n<Vssue.*\/>/g, ''), (err) => {
        if(err) console.log(err)
      })
    })
  } catch(err) {
    console.log(err);
  }
})
```

添加（或者删除）`gittalk`的评论组件的脚本依然可以用`append.js（或者deleteComponent.js）`，只不过需要改一下脚本中需要添加和删除的内容。

这样就ok啦。

## 修改主题，单独发包

在使用这个vuepress-theme-modern-blog主题的时候发现了一些问题，当然也不全是问题，如果全是问题我就给作者提PR了，还有的是一些自己的需求。

比如：图标，由于在国内像instagram、Twitter、linkedin等国外网站都不太好访问，也没有账号，所以第一步就是换图标，主要是在[iconfont](https://www.iconfont.cn/),找图标然后替换，在这个过程中修改了一些代码。还有文章的末尾的轮播文章卡片，我不喜欢下面的轮播指示，也做了修改。还有一些其他的修改，比如添加推荐网站卡片、增加了其他tab等。

最开始这些都是直接在本地文件的`node_modules`中找到这个vuepress-theme-modern-blog包，直接去源文件中进行修改。一开始修改的地方不太多，所以感觉还好。但是随着修改的地方的增加，我开始思考一个问题，如果修改的文件丢失了怎么办，在重新安装这个包，修改的地方就全消失啦。并且随着文章越来越多，每次都要重新打包，全量推送到远程仓库，比较消耗人力。此时就很需要travis CI来帮助我们自动安装依赖，自动打包，然后推送到远程的github page仓库。

出于这两个原因，把这个修改后的主题包发布到npm平台似乎成了一个必要的选择。

发包也比叫简单：

>首先要有npm账号，没有可以注册一个。

```
npm login
npm publish
```

本地调试：

在要发布的npm包（vuepress-theme-custom）中执行：

```
npm link
```

在需要用到这个npm包的项目中：

```
npm link vuepress-theme-custom
```

这样就可以实现本地的npm包进行调试啦。

>其实`npm link`相当于在全局环境下安装了vuepress-theme-custom,在项目中进行`npm link vuepress-theme-custom`相当于在项目的node_modules中创建了一个这个npm包的符号连接。

## 添加`.travis.yml`文件

正如上面提到的那样，每次发布文章都要在本地重新打包，然后把打包后的产物推送到远程分支，比较耗费人力和时间。为了解决这个问题，比较好的解决办法就是引入持续集成和持续发布。

在查阅官方文档后，发现github page的发布有一个[模板](https://docs.travis-ci.com/user/deployment/pages/)（我也不知道叫模板正不正确），如下：

```yaml
deploy:
  provider: pages
  skip_cleanup: true
  github_token: $GITHUB_TOKEN
  keep_history: true
  on:
    branch: main
```

一些其他的github page配置可参考[官方说明](https://docs.travis-ci.com/user/deployment/pages/#further-configuration)。

我现在用的配置文件为：

```yaml
language: node_js
node_js:
  - lts/*
install:
  - yarn install
script:
  - node append.js && yarn build && node deleteComponent.js
deploy:
  provider: pages
  skip_cleanup: true
  local_dir: .vuepress/dist
  repo: yancqS/blog
  github_token: $GH_TOKEN
  keep_history: true
  on:
    branch: master
```

这里面会涉及到tarvis的job生命周期，具体的要参考[官方文档](https://docs.travis-ci.com/user/job-lifecycle/)。

注意：`$GH_TOKEN`这个是在github生产的token，以允许travis向github平台推送代码。具体的生成方法参考[github官网-Creating a personal access token
](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)。由于这个token是保密的，因此这个token值是要在travis的设置中添加为变量的。如下：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210421233134.png)

还有要记得确认travis的邮箱，否则不会正常触发job。

>里面还有一些细节操作，比如选择仓库啥的。

正常情况下到这一步，已经成功啦。现在只要这个仓库有push或者其他动作就会触发这个travis.yml中的任务并执行脚本。

具体如下图：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20210421233853.png)

暂时就先这么多吧，如果以后有啥新的更改，会及时同步。

土遁～～～～～
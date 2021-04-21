---
title: centos7安装jenkins和gitlab踩坑记
date: "2020-05-17"
author: Yoha
tags:
    - CI
    - gitlab
    - jenkins
location: Beijing
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017230306.jpeg
meta:
  - name: title
    content: centos7安装jenkins和gitlab踩坑记
  - name: description
    content: centos7安装jenkins和gitlab踩坑记
  - name: keywords
    content: centos7, jenkins, gitlab, CI
  - name: author
    content: Yoha
featured: true
---
# centos7安装jenkins和gitlab踩坑记

## 一、背景

- 主机:win10
- 虚拟机:centos7
- 目标：成功安装gitlab&jenkins，并且可以正常利用gitlab的push event webhook触发jenkins的自动构建任务。

## 二、安装gitlab

首先要在CentOS系统上面安装所需的依赖：ssh、防火墙、postfix(用于邮件通知)、wegt，以下这些命令也会打开系统防火墙中的HTTP和SSH端口访问。

### 安装ssh协议

>安装命令: yum install -y curl policycoreutils-python openssh-server

### 设置ssh服务开机自启动

>安装命令: ystemctl enable sshd

### 启动ssh服务

> 启动命令: systemctl start sshd

### 安装防火墙

> 安装命令: yum install firewalld systemd -y

### 开启防火墙

> 开启命令: service firewalld  start

### 添加http服务到firewalld

> 命令: firewall-cmd --permanent --add-service=http, pemmanent表示永久生效，若不加--permanent系统下次启动后就会失效。

### 重启防火墙

> 重启命令: systemctl reload firewalld

### 安装Postfix以发送邮件

> 安装命令: yum install postfix

### 将postfix服务设置成开机自启动

>命令: systemctl enable postfix

### 启动postfix

>启动命令: systemctl start postfix

### 安装wget，用于从外网上下载插件

>安装命令: yum -y install wget

### 下载gitlab

> 命令: wget https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7/gitlab-ce-10.0.0-ce.0.el7.x86_64.rpm

### 安装Gitlab

>命令: rpm -ivh gitlab-ce-10.5.7-ce.0.el7.x86_64.rpm

### 修改gitlab配置文件指定服务器ip和自定义端口

> vim  /etc/gitlab/gitlab.rb,修改默认端口到9000

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017230528.jpg)

>配置时区: gitlab_rails['time_zone'] = 'Asia/Shanghai'

### 将9000端口添加到防火墙中

> 命令: firewall-cmd --zone=public --add-port=9000/tcp --permanent

### 重启防火墙

>重启命令: systemctl reload firewalld

### 重置gitlab

>命令: gitlab-ctl reconfigure

### 启动gitlab

>命令：gitlab-ctl restart

### 访问gitlab页面

>在浏览器里面直接输入服务器IP和指定的端口号就可以进行访问，第一次登陆的时候会默认进入修改密码界面。默认用户是root。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017230554.jpg)

到这gitlab就算安装成功啦，接下来就是

### 新建项目(建一个readme,写点东西)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017230612.jpg)

### 生成ssh key(这又出事啦)

(主机和虚拟机要互相ping的通才可以下面的操作)

本来正常的生成ssh key：ssh-keygen -t rsa -C "admin@example.com"

>注意：新建了gitlab的账户,默认的邮箱就是admin@example.com，可以添加自己的邮箱，然后gitlab会发送一封确认邮件，确认一下就可以啦。

接着说，上面生成ssh key的命令我是在windows上执行的，但是之前生成过一次ssh key(绑定的是公司的邮箱，也默认放在.ssh下面)。遇到的第一个问题就是:以前都是enter几下就完事，但是这次失败啦，最后会问一句是否覆盖.ssh下面的公钥和私钥，默认是no。所以，enter之后，并没有生成新的公钥和私钥。然后在.ssh同级目录下新建.ssh_test目录，在目录中新建2个文件id_rsa以及id_rsa.pub。然后再生成ssh key的时候把.ssh_test的路径填写在

> Enter file in which to save the key (/c/Users/xxxx/.ssh/id_rsa):

即可。

终于ssh key生成成功啦，到gitlab的settings -> SSH Keys 添加公钥。

然后试着克隆一下吧(又出问题啦0.0)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017230640.jpg)

一直要求输入密码。在网上查了一下原因：ssh-agent服务没把新产生的id_rsa包含进去。解决办法：

>- eval "$(ssh-agent -s)"
>- ssh-add 新id_rsa的路径 如:ssh-add /c/Users/xxxx/.ssh_test/id_rsa

这个时候git clone git@192.168.198.129:root/test_jenkins.git ./test_jenkins就ok啦！！

这样gitlab就安装成功并且可以正常使用的。

## 三、安装jenkins

### 首先要先安装java环境

[下载jdk](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017230713.jpg)

我在主机上下载的，然后用xftp传到虚拟机。

#### 创建安装目录

> mkdir /usr/local/java

#### 解压至安装目录

>tar -zxvf jdk-8u251-linux-x64.tar.gz -C /usr/local/java

#### 设置环境变量

>vim /etc/profile

在末尾添加

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017230756.jpg)

```sh
export JAVA_HOME=/usr/local/java/jdk1.8.0_251
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
```

使环境变量生效：

>source /etc/profile

添加软连接

> ln -s /usr/local/java/jdk1.8.0_251/bin/java /usr/bin/java

检查一下:

> java -version

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017230825.jpg)

这样就ok啦。

### 下载jenkins

[各个版本的jenkins](https://pkg.jenkins.io)

建议下载最新的，我也是在主机上下载的然后xftp传到虚拟机上的。jenkins-2.222.3-1.1.noarch.rpm,我下载的这个版本。

### 安装jenkins

>rpm -ivh jenkins-2.222.3-1.1.noarch.rpm

### 配置端口及权限

> vim /etc/sysconfig/jenkins

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017230849.jpg)

然后

```sh
#修改目录权限
chown -R root:root /var/lib/jenkins
chown -R root:root /var/cache/jenkins
chown -R root:root /var/log/jenkins
```

重启一下：

> service jenkins restart

### 启动

> systemctl start jenkins

遇到的问题: 

1. 启动之后，查看状态systemctl status jenkins，发现不是正常的active (running), 而是active(exited)。 **解决办法：** 将8000端口添加到防火墙firewall-cmd --zone=public --add-port=8000/tcp --permanent

### 访问

访问jenkins地址 http:<ip或者域名>:8000

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017230919.jpg)

执行命令 *cat /var/lib/jenkins/secrets/initialAdminPassword* 查看密码，然后插件安装选择推荐插件

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017230949.jpg)

在这可能等的时间会比较久，如果有安装失败的也可以选择continue,去创建一个用户。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231005.jpg)

### 安装需要的插件

首先要更新插件源，因为官方的插件源安装起来很慢 还容易失败。

升级的源:https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/2.222/update-center.json

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231023.jpg)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231057.jpg)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231118.jpg)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231138.jpg)

jenkins系统管理下的插件管理，在线安装Gitlab Hook Plugin和Gitlab Plugin这两个插件，然后叫重启jenkins。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231208.jpg)

### 系统配置

在manager jenkins中选择configure System,找到gitlab,设置好Gitlab的参数，并测试时候能连接上Gitlab

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231253.jpg)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231310.jpg)

API token可以在gitlab中的用户的设置中找到

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231329.jpg)

### 新建任务

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231352.jpg)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231411.jpg)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231428.jpg)

这个priviate Key就是一开始生成id_rsa私钥。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231447.jpg)

在这选的触发条件按是push后触发。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231520.jpg)

这个是构建时要执行的脚本，主要看看是否成功。

复制一下GitLab webhook URL,在这还有一个高级选项，点开然后去生成一个Secret token，这两个在gitlab中要用到。

## 四、配置gitlab webhook

进去项目的settings-integrations

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231547.jpg)

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231606.jpg)

然后点击add webhook。

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231618.jpg)

测试一下：选择test下面的push event。

按道理来说应该是触发成功然后再jenkins中也可以看到构建,但是gitlab直接500啦。(0.0)

了解了一下，gitlab默认是不允许来自钩子的本地网络的请求的。

解决办法参考这两篇文章：

[Integrations Webhooks not working - Error 500](https://gitlab.com/gitlab-org/gitlab-foss/-/issues/44480)

[Webhook does not work for me when i update to date!](https://gitlab.com/gitlab-org/omnibus-gitlab/-/issues/3307#note_64245578)

我直接把办法也说了吧，就是：

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231645.jpg)

然后测试一下，ok啦

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231701.jpg)

去jenkins看看

![](https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017231726.jpg)

over!!!!!

稍等，下一步计划——pipeline and jenkinsfile

## 五、参考文章

- [centos7安装gitlab并配置汉化](https://blog.csdn.net/weixin_41782053/article/details/101016090)
- [ssh链接git服务器，解决push pull要求输入密码问题](https://my.oschina.net/lieefu/blog/469337)
- [CentOS 7 安装 Jenkins](https://www.cnblogs.com/fangts/p/11095316.html)
- [利用gitlab的webhook触发jenkins](https://www.jianshu.com/p/2b2c204dcbe2)

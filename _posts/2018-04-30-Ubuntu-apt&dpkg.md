---
title: apt-get命令、dpkg命令、rpm命令和yum命令
date: "2018-04-30"
author: Yoha
tags:
    - Ubuntu
    - Linux
location: Qingdao
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017234336.png
meta:
  - name: title
    content: apt-get命令、dpkg命令、rpm命令和yum命令
  - name: description
    content: apt-get命令、dpkg命令、rpm命令和yum命令
  - name: keywords
    content: apt-get, dpkg, rpm, yum
  - name: author
    content: Yoha
featured: true
---
# apt-get命令、dpkg命令、rpm命令和yum命令

一般来说著名的 Linux 系统基本上分两大类：

- RedHat 系列：Redhat、Centos、Fedora 等
- Debian 系列：Debian、Ubuntu 等

## Debian系列

### 1. apt-get常用的命令

- sudo apt-get update   更新源
- sudo apt-get install **packageName**  安装包
- sudo apt-get remove **packageName**   删除包
- sudo apt-get remove **packageName** --pure    删除包,包括其配置信息
- sudo apt-get install **packageName** --reinstall  重新安装包
- sudo apt-get -f install   修复安装
- sudo apt-get build-dep **packageName**    安装相关编译环境
- sudo apt-get upgrade  更新已安装的包
- sudo apt-get source **ckageName** 下载该包的源代码
- sudo apt-cache show **packageName**   获取包的相关信息，如说明、大小、版本等
- sudo apt-cache search **packageName** 搜索软件包
- apt-cache depends **packageName** 了解使用依赖
- apt-cache rdepends **packageName**    查看该包被哪些包依赖
- sudo apt-get clean && sudo apt-get autoclean  清理无用的包(可以定期执行)

### 2. dpkg常用的命令

- dpkg -i **xxx.deb**   安装软件
- dpkg -R   安装一个目录下的所有软件包
- dpkg -r **xxx**   删除软件包，但保留其配置
- dpkg -P **xxx**   删除软件包，包括其配置信息
- dpkg -l   显示已经安装的软件列表（经常与管道符和grep一起用）
- dpkg -L **xxx**   显示一个包安装到系统里面的文件目录信息
- dpkg --help   显示帮助信息
- dpkg --version    显示dpkg的版本号

## RedHat系列

### 1. yum常用的命令

- yum list \| grep **packageName** 查询yum服务器是否有需要安装的软件
- yum install **packageName** 安装软件
- yum update **packageName** 升级软件包
- yum check-update **packageName** 检查是否有可用的更新rpm软件包
- yum remove **packageName**    删除指定的rpm软件包
- yum search **packageName**    查询rpm软件包
- yum info **packageName** 显示指定的rpm包的描述和概要信息
- yum clean **option** 清楚yum过期的缓存
- yum shell 进入yum的shell提示符
- yum resolvedep **packageName**    显示rpm软件包的依赖关系
- yum deplist **packageName**   显示认rpm软件包的所有依赖关系

### 2. rpm常用的命令

- rpm -qa   查询以安装的rpm列表
- rpm -qi **packageName**  查询软件包的信息
- rpm -ql **packageName** 查询软件包中的所有文件
- rpm -qf **文件全路径名**  查询文件属于哪个软件包
- rpm -e **packageName** 卸载rpm包
- rpm -e --nodeps **packageName**   卸载rpm包，不管是否被依赖
- rpm -ivh **packageName** 安装rpm包

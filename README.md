# Wechaty Puppet Bridge

[![NPM](https://github.com/atorber/puppet-bridge/workflows/NPM/badge.svg)](https://github.com/atorber/puppet-bridge/actions?query=workflow%3ANPM)
[![NPM Version](https://img.shields.io/npm/v/wechaty-puppet-bridge?color=brightgreen)](https://www.npmjs.com/package/wechaty-puppet-bridge)
[![npm (tag)](https://img.shields.io/npm/v/wechaty-puppet-bridge/next.svg)](https://www.npmjs.com/package/wechaty-puppet-bridge?activeTab=versions)
<img alt="GitHub stars badge" src="https://img.shields.io/github/stars/atorber/puppet-bridge"> <img alt="GitHub forks badge" src="https://img.shields.io/github/forks/atorber/puppet-bridge"> [![NPM Version](https://img.shields.io/npm/v/puppet-bridge?color=brightgreen)](https://www.npmjs.com/package/wechaty-puppet-bridge) ![npm downloads](https://img.shields.io/npm/dm/wechaty-puppet-bridge.svg)

![yuque_diagram (2)](https://github.com/atorber/puppet-bridge/assets/19552906/086cff53-2c4a-4889-938b-23ee26acb6fc)

## 简介

wechaty-puppet-bridge 是一个虚拟的Wechaty Puppet，实际上它只是一个桥接服务，它将GitHub中开源的微信机器人桥接到Wechaty

如果你想方便且高效的使用免费的微信机器人，那么它是一个很好的选择，它不需要token同时又能使用Wechaty进行聊天机器人开发

## 快速开始

1. 在您的Windows电脑上安装微信客户端（当前支持微信版本v3.9.2.23）

2. 在电脑上登录微信客户端

3. 到[cixingguangming55555/wechat-bot](https://github.com/cixingguangming55555/wechat-bot)项目下载[Run funtool_wx.exe](https://github.com/cixingguangming55555/wechat-bot/blob/master/funtool/funtool_wx%3D3.9.2.23.exe)运行程序并点击【Start】开启功能。

   ![image](https://github.com/atorber/puppet-bridge/assets/19552906/c2c86ff8-8a48-439f-a48a-6830883693d2)

4. 运行以下指令启动程序

```sh
git clone https://github.com/atorber/wechaty-puppet-bridge.git
cd wechaty-puppet-bridge

# 安装依赖
npm install

# 启动程序
npm start
#
# Do not forget to install WeChat with requried version and login.
#
```

## 快速命令

| 命令 | 源码文件 | 描述 |
| :------------- |:-------------| :-----|
| `npm start` | [examples/ding-dong-bot.ts](examples/ding-dong-bot.ts) | 启动ding/dong机器人 |
| `npm run start:ripe` | [examples/ripe-wechaty.ts](examples/ripe-wechaty.ts) | Wechaty ding/dong |
| `npm run start:raw` | [examples/raw-bridge.ts](examples/raw-bridge.ts) | bridge ding/dong |

## 使用NPM包

puppet-bridge 已经在NPM上发布了安装包，Wechaty用户可以直接安装使用

```shell
npm i wecahty-puppet-bridge
```

## 功能对比

wechaty-puppet-bridge 是一个全新的wechaty-puppet，它可以连接所有的通过ws、http、mqtt开放IM访问的聊天机器人.

版本|[cixingguangming55555/wechat-bot](https://github.com/cixingguangming55555/wechat-bot)|
:---|:---|
**<客户端>**|
平台|Windows|
版本|3.9.2.23|
**<消息>**|
接收文本|✅|
接收图片|✅|
接收文件|✅|
接收动图|✅|
接收表情|✅|
接收小程序卡片|✅|
接收联系人卡片|✅|
接收位置卡片|✅|
发送文本|✅|
发送图片|✅|
发送文件|✅|
发送动图|✅|
**<群组>**|
@群成员|✅|
群列表|✅|
群成员列表|✅|
群详情|✅|
进群提示|✅|
**<联系人>**|
好友列表|✅|
好友详情|✅|
**<其他>**|
登录事件|✅|
扫码登录||

## 机器人支持

1. DONE：Wechat-bot 馈人玫瑰之手，历久犹有余香 [cixingguangming55555/wechat-bot](https://github.com/cixingguangming55555/wechat-bot)

2. TBD：wxbot - 微信聊天机器人 [jwping/wxbot](https://github.com/jwping/wxbot)

## 更新日志

### main v0.1.0 (2023-1-21)

初始化版本，适配 [cixingguangming55555/wechat-bot](https://github.com/cixingguangming55555/wechat-bot) 项目

## 作者

Yuchao LU [@atorber](https://github.com/atorber)

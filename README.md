# Wechaty Puppet Bridge

<img alt="GitHub stars badge" src="https://img.shields.io/github/stars/atorber/puppet-bridge"> <img alt="GitHub forks badge" src="https://img.shields.io/github/forks/atorber/puppet-bridge"> [![NPM](https://github.com/atorber/puppet-bridge/workflows/NPM/badge.svg)](https://github.com/atorber/puppet-bridge/actions?query=workflow%3ANPM)
[![NPM Version](https://img.shields.io/npm/v/wechaty-puppet-bridge?color=brightgreen)](https://www.npmjs.com/package/wechaty-puppet-bridge)
[![npm (tag)](https://img.shields.io/npm/v/wechaty-puppet-bridge/next.svg)](https://www.npmjs.com/package/wechaty-puppet-bridge?activeTab=versions) ![npm downloads](https://img.shields.io/npm/dm/wechaty-puppet-bridge.svg)

<img src="https://github.com/atorber/puppet-bridge/assets/19552906/086cff53-2c4a-4889-938b-23ee26acb6fc" alt="chatie puppet bridge" height="350" align="bottom" />

## 简介

wechaty-puppet-bridge 是一个虚拟的Wechaty Puppet，实际上它只是一个桥接服务，它将GitHub中开源的微信机器人桥接到Wechaty

如果你想方便且高效的使用免费的微信机器人，那么它是一个很好的选择，它不需要token同时又能使用Wechaty进行聊天机器人开发

与wechaty-puppet-xp比较：

| 项目 | [puppet-xp](https://github.com/atorber/puppet-xp) | [puppet-bridge](https://github.com/atorber/puppet-bridge) |
| :------------- |:-------------| :-----|
| 注入 | ⭐⭐⭐<br>不需要 | ⭐⭐⭐<br>不需要 |
| 功能| ⭐⭐⭐<br>基于[cixingguangming55555/wechat-bot](https://github.com/cixingguangming55555/wechat-bot)项目 | ⭐⭐⭐<br>基于[cixingguangming55555/wechat-bot](https://github.com/cixingguangming55555/wechat-bot)项目 |
| 梯子 | ⭐<br>依赖frida，国内网络无法安装，需使用梯子 | ⭐⭐⭐<br>不需要，下载[funtool_wx=3.9.2.23.exe](https://github.com/cixingguangming55555/wechat-bot/blob/master/funtool/funtool_wx%3D3.9.2.23.exe)即可 |
| 启动| ⭐⭐⭐<br>直接运行nodejs程序 | ⭐⭐<br>需先手动启动funtool_wx=3.9.2.23.exe|
| 环境| ⭐⭐⭐<br>nodejs | ⭐⭐<br>nodejs + funtool_wx=3.9.2.23.exe|

## 快速开始

### 使用[cixingguangming55555/wechat-bot](https://github.com/cixingguangming55555/wechat-bot)

1. 在您的Windows电脑上安装微信客户端（当前支持微信版本v3.9.2.23）

2. 在电脑上登录微信客户端

3. 到[cixingguangming55555/wechat-bot](https://github.com/cixingguangming55555/wechat-bot)项目下载[funtool_wx=3.9.2.23.exe](https://github.com/cixingguangming55555/wechat-bot/blob/master/funtool/funtool_wx%3D3.9.2.23.exe)运行程序并点击【Start】开启功能。

   ![image](https://github.com/atorber/puppet-bridge/assets/19552906/c2c86ff8-8a48-439f-a48a-6830883693d2)

4. 运行以下指令启动程序

```sh
git clone https://github.com/atorber/puppet-bridg
cd puppet-bridge

# 安装依赖
npm install

# 启动程序
npm start
#
# Do not forget to install WeChat with requried version and login.
#
```

### 使用[jwping/wxbot](https://github.com/jwping/wxbot)

1. 在您的Windows电脑上安装微信客户端（当前支持微信版本v3.9.8.25）

2. 在电脑上登录微信客户端

3. 到[jwping/wxbot](https://github.com/jwping/wxbot)项目下载[wxbot-sidecar.exe](https://github.com/jwping/wxbot/blob/main/bin/wxbot-sidecar.exe)运行程序并点击【Start】开启功能。

   ![image](https://github.com/atorber/puppet-bridge/assets/19552906/59495943-dcfc-4ff1-9c66-e6c097e9b0a5)

5. 运行以下指令启动程序

```sh
git clone https://github.com/atorber/puppet-bridg
cd puppet-bridge

# 安装依赖
npm install

# 启动程序
npm run start:ripe-bridge-jwping-wxbot:info
#
# Do not forget to install WeChat with requried version and login.
#
```

## 使用NPM包

puppet-bridge 已经在NPM上发布了安装包，Wechaty用户可以直接安装使用

```shell
npm i wechaty-puppet-bridge
```

示例代码：

- [cixingguangming55555/wechat-bot](https://github.com/cixingguangming55555/wechat-bot)

```javascript
import {
    WechatyBuilder,
    log,
  } from 'wechaty'
  import { FileBox } from 'file-box'
  import { PuppetBridge } from 'wechaty-puppet-bridge'
  
  async function onLogin (user) {
    log.info('onLogin', '%s login', user)
    const roomList = await bot.Room.findAll()
    console.info('room count:', roomList.length)
    const contactList = await bot.Contact.findAll()
    console.info('contact count:', contactList.length)
  }
  
  async function onMessage (message) {
    log.info('onMessage', JSON.stringify(message))
  
    // 1. send Image
    if (/^ding$/i.test(message.text())) {
      const fileBox = FileBox.fromUrl('https://wechaty.github.io/wechaty/images/bot-qr-code.png')
      await message.say(fileBox)
    }
  
    // 2. send Text
  
    if (/^dong$/i.test(message.text())) {
      await message.say('dingdingding')
    }
  
  }
  
  const puppet = new PuppetBridge({
   nickName: '大师'  // 登录微信的昵称
   })

  const bot = WechatyBuilder.build({
    name: 'ding-dong-bot',
    puppet,
  })
  
  bot.on('login', onLogin)
  bot.on('message', onMessage)
  
  bot.start()
    .then(() => {
      return log.info('StarterBot', 'Starter Bot Started.')
    })
    .catch(console.error)
```

- [jwping/wxbot](https://github.com/jwping/wxbot)

```javascript
import {
    WechatyBuilder,
    log,
  } from 'wechaty'
  import { FileBox } from 'file-box'
  import { PuppetBridgeJwpingWxbot as PuppetBridge } from 'wechaty-puppet-bridge'

  async function onLogin (user) {
    log.info('onLogin', '%s login', user)
    const roomList = await bot.Room.findAll()
    console.info('room count:', roomList.length)
    const contactList = await bot.Contact.findAll()
    console.info('contact count:', contactList.length)
  }
  
  async function onMessage (message) {
    log.info('onMessage', JSON.stringify(message))
  
    // 1. send Image
    if (/^ding$/i.test(message.text())) {
      const fileBox = FileBox.fromUrl('https://wechaty.github.io/wechaty/images/bot-qr-code.png')
      await message.say(fileBox)
    }
  
    // 2. send Text
  
    if (/^dong$/i.test(message.text())) {
      await message.say('dingdingding')
    }
  
  }
  
  const puppet = new PuppetBridge({
   nickName: '大师'  // 登录微信的昵称
   })

  const bot = WechatyBuilder.build({
    name: 'ding-dong-bot',
    puppet,
  })
  
  bot.on('login', onLogin)
  bot.on('message', onMessage)
  
  bot.start()
    .then(() => {
      return log.info('StarterBot', 'Starter Bot Started.')
    })
    .catch(console.error)
```

## 功能清单

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

2. DONE：wxbot - 微信聊天机器人 [jwping/wxbot](https://github.com/jwping/wxbot)

## 更新日志

### main v0.4.0 (2023-2-1)

初始化版本，适配  [jwping/wxbot](https://github.com/jwping/wxbot) 项目

### main v0.1.0 (2023-1-21)

初始化版本，适配 [cixingguangming55555/wechat-bot](https://github.com/cixingguangming55555/wechat-bot) 项目

## 作者

Chao Lu [@atorber](https://github.com/atorber)

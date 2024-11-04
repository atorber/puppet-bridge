#!/usr/bin/env node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import { PuppetBridge } from './puppet-bridge-cixingguangming55555-wechat-bot-391027.js'

class PuppetBridgeTest extends PuppetBridge {
}

test.skip('PuppetBridge perfect restart testing', async (t) => {
  const puppet = new PuppetBridgeTest({ nickName: 'test' })
  try {

    for (let i = 0; i < 3; i++) {
      await puppet.start()
      t.ok(puppet.state.active(), 'should be turned on after start()')

      await puppet.stop()
      t.ok(puppet.state.inactive(), 'should be turned off after stop()')

      t.pass('start/stop-ed at #' + i)
    }

    t.pass('PuppetBridge() perfect restart pass.')
  } catch (e) {
    t.fail(e as any)
  }
})

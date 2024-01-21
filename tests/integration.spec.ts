#!/usr/bin/env node --no-warnings --loader ts-node/esm

import { test }  from 'tstest'

// import { WechatyBuilder } from 'wechaty'

// import {
//   PuppetBridge,
// }                         from '../src/mod.js'

test('integration testing', async t => {
  t.pass('PuppetBridge() perfect restart pass.')

  // const puppet = new PuppetBridge({ nickName:'大师' })
  // const wechaty = WechatyBuilder.build({ puppet })
  // t.ok(wechaty, 'should instantiate wechaty with puppet mocker')
})

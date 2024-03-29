#!/usr/bin/env node --no-warnings --loader ts-node/esm

import {
  PuppetBridge,
  VERSION,
}                 from 'wechaty-puppet-bridge'

async function main () {
  if (VERSION === '0.0.0') {
    throw new Error('version should not be 0.0.0 when prepare for publishing')
  }

  const puppet = new PuppetBridge()
  console.info(`Puppet Bridge v${puppet.version()} smoke testing passed.`)
  return 0
}

main()
  .then(process.exit)
  .catch(e => {
    console.error(e)
    process.exit(1)
  })

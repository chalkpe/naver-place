import { launch } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'

import Koa from 'koa'
import Router from 'koa-router'
import logger from 'koa-chalk-logger'

import parse from './parse'

const app = new Koa()
const router = new Router()

const base = 'https://store.naver.com/restaurants/detail?id='

router.get('/:id', async ctx => {
  const startingUrl = base + ctx.params.id
  const chromeFlags = ['--disable-gpu', '--headless']

  const chrome = await launch({ startingUrl, chromeFlags })
  const protocol = await CDP({ port: chrome.port })

  const { Page, Runtime } = protocol
  await Promise.all([Page.enable(), Runtime.enable()])

  await Page.loadEventFired()
  const { result } = await Runtime.evaluate({
    returnByValue: true,
    expression: `(${parse})()`
  })

  const data = result.value || { message: 'not found' }
  ctx.body = Object.assign({ ok: !!result.value, date: new Date() }, data)

  protocol.close()
  chrome.kill()
})

app
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(8080, () => console.log('Listening on port 8080'))

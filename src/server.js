import dotenv from 'dotenv'
import { readFileSync } from 'fs'

import { launch } from 'chrome-launcher'
import CDP from 'chrome-remote-interface'

import Koa from 'koa'
import Router from 'koa-router'
import logger from 'koa-chalk-logger'

dotenv.config()
const port = process.env.NP_PORT || 8080

const app = new Koa()
const router = new Router()

const base = 'https://store.naver.com/restaurants/detail?id='
const expression = readFileSync('dist/parse.js', { encoding: 'utf8' })

router.get('/:id', async ctx => {
  const startingUrl = base + ctx.params.id
  const chromeFlags = ['--disable-gpu', '--headless']

  const chrome = await launch({ startingUrl, chromeFlags })
  const protocol = await CDP({ port: chrome.port })

  const { Page, Runtime } = protocol
  await Promise.all([Page.enable(), Runtime.enable()])

  await Page.loadEventFired()
  const { result } = await Runtime.evaluate({ expression, returnByValue: true })

  const data = result.value || { message: 'not found' }
  ctx.body = Object.assign({ ok: !!result.value, date: new Date() }, data)

  protocol.close()
  chrome.kill()
})

app
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port, () => console.log(`Listening on port ${port}`))

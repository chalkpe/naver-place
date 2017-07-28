import path from 'path'
import { exec } from 'child_process'
import phantomjs from 'phantomjs-prebuilt'

import Koa from 'koa'
import Router from 'koa-router'
import logger from 'koa-chalk-logger'

const app = new Koa()
const router = new Router()

const scriptPath = path.resolve(__dirname, '..', 'dist', 'parse.js')

function execute (args) {
  return new Promise((resolve, reject) =>
    exec(args.join(' '), (err, data) => err ? reject(err) : resolve(data)))
}

router.get('/:id', async ctx => {
  const args = [
    phantomjs.path,
    scriptPath,
    ctx.params.id
  ]

  try {
    ctx.body = JSON.parse(await execute(args))
  } catch (err) {
    ctx.throw(400, err.message)
  }
})

app
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(8080, () => console.log('Listening on port 8080'))

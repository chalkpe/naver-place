/* eslint-env phantomjs */

import system from 'system'
import webpage from 'webpage'

function success (data) {
  write(true, data)
}

function fail (message) {
  write(false, { message })
}

function write (ok, data) {
  const result = Object.assign({
    ok: !!ok,
    date: new Date()
  }, data)

  console.log(JSON.stringify(result))
  phantom.exit(0)
}

function load (url, page, status) {
  if (status !== 'success') {
    return fail(`Unable to load the url ${url}`)
  }

  setTimeout(() => {
    const result = page.evaluate(parse)
    result ? success(result) : fail('#content not found')
  }, 1000)
}

function parse () {
  const contentArea = document.getElementById('content')
  if (!contentArea) return false

  const nameArea = contentArea.querySelector('.biz_name_area')
  const name = nameArea.querySelector('strong.name').textContent
  const category = nameArea.querySelector('span.category').textContent

  const buttonNodes = contentArea.querySelectorAll('.func_btn_area ul li')
  const nBooking = buttonNodes.length > 3 // 4개이면 예약 버튼이 있는 걸로 취급

  const infoArea = contentArea.querySelector('.list_bizinfo')
  const tel = infoArea.querySelector('.list_item_biztel').textContent

  const addressNodes = infoArea.querySelectorAll('.list_item_address span.addr')
  const addresses = Array.prototype.map.call(addressNodes, node => node.textContent)

  const homepageAnchors = infoArea.querySelectorAll('.list_item_homepage a')
  const homepages = Array.prototype.map.call(homepageAnchors, node => node.getAttribute('href'))

  const convenienceNode = infoArea.querySelector('.list_item_convenience .convenience')
  const cBooking = convenienceNode && convenienceNode.textContent.indexOf('예약') >= 0

  return { name, category, nBooking, cBooking, tel, addresses, homepages }
}

function main () {
  if (system.args.length <= 1) return fail('insufficient arguments')
  const url = 'https://store.naver.com/restaurants/detail?id=' + system.args[1]

  const page = webpage.create()
  page.settings.loadImages = false
  page.settings.userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:54.0) Gecko/20100101 Firefox/54.0'

  page.open(url, status => load(url, page, status))
}

try {
  main()
} catch (err) {
  fail(err.message)
}

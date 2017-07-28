/* eslint-env phantomjs */

import system from 'system'
import webpage from 'webpage'

function main () {
  if (system.args.length <= 1) return write(1, 'insufficient arguments')
  const url = 'https://store.naver.com/restaurants/detail?id=' + system.args[1]

  const page = webpage.create()
  page.settings.loadImages = false
  page.settings.userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:54.0) Gecko/20100101 Firefox/54.0'

  page.open(url, status => (status !== 'success')
    ? write(false, { message: `Unable to load the url ${url}` })
    : setTimeout(() => write(true, { date: new Date(), result: page.evaluate(parse) }), 1000))
}

function write (ok, data) {
  console.log(JSON.stringify({ ok, ...data }))
  phantom.exit(0)
}

function parse () {
  const contentArea = document.getElementById('content')

  const nameArea = contentArea.querySelector('.biz_name_area')
  const name = nameArea.querySelector('strong.name').textContent
  const category = nameArea.querySelector('span.category').textContent

  const buttonNodes = contentArea.querySelectorAll('.func_btn_area ul li')
  const nBooking = buttonNodes.length > 3 // 4개이면 예약 버튼이 있는 걸로 취급

  const infoArea = contentArea.querySelector('.list_bizinfo')
  const tel = infoArea.querySelector('.list_item_biztel').textContent

  const addressNodes = infoArea.querySelectorAll('.list_item_address span.addr')
  const addresses = Array.prototype.map.call(addressNodes, node => node.textContent)

  return { name, category, nBooking, tel, addresses }
}

main()

export default function parse () {
  const contentArea = document.getElementById('content')
  if (!contentArea) return false

  const nameArea = contentArea.querySelector('.biz_name_area')
  const name = nameArea.querySelector('strong.name').textContent
  const category = nameArea.querySelector('span.category').textContent

  const infoArea = contentArea.querySelector('.list_bizinfo')
  const tel = infoArea.querySelector('.list_item_biztel').textContent

  const addressNodes = infoArea.querySelectorAll('.list_item_address span.addr')
  const addresses = Array.prototype.map.call(addressNodes, node => node.textContent)

  const homepageAnchors = infoArea.querySelectorAll('.list_item_homepage a')
  const homepages = Array.prototype.map.call(homepageAnchors, node => node.getAttribute('href'))

  const buttonNodes = contentArea.querySelectorAll('.func_btn_area ul li')
  const nBooking = buttonNodes.length > 3 // 4개이면 예약 버튼이 있는 걸로 취급

  const convenienceNode = infoArea.querySelector('.list_item_convenience .convenience')
  const cBooking = !!convenienceNode && convenienceNode.textContent.indexOf('예약') >= 0

  const menuNodes = infoArea.querySelectorAll('.list_item_menu .list_menu li')
  const menus = Array.prototype.map.call(menuNodes, node => {
    const nameNode = node.querySelector('.menu .name')
    const priceNode = node.querySelector('.price')
    if (!nameNode || !priceNode) return false

    const priceText = priceNode.textContent
    const name = nameNode.textContent.trim()

    // remove non-numerics (comma, won, etc.)
    const getPrice = text => parseInt(text.replace(/\D/g, ''), 10) || 0

    // return average if price has a range
    if (priceText.includes('~')) {
      const prices = priceText.split('~').map(getPrice)
      return { name, price: prices.reduce((a, b) => a + b) / prices.length }
    }

    return { name, price: getPrice(priceText) }
  }).filter(x => x)

  const sumPrice = menus.map(x => x.price).reduce((a, b) => a + b, 0)
  const averagePrice = sumPrice / (menus.length || 1)

  const tvNodes = infoArea.querySelectorAll('.list_item_tv .txt .tv')
  const tvs = Array.prototype.map.call(tvNodes, node => node.textContent)

  return {
    name,
    category,

    tel,
    addresses,
    homepages,

    nBooking,
    cBooking,

    menus,
    averagePrice,

    tvs
  }
}

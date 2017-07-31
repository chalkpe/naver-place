export default function parse () {
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

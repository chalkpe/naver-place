/**
 * Shorthand for `Document.querySelector` and `Document.querySelectorAll`.
 *
 * @param {Document|Element} dom The parent.
 * @param {string} query A string containing a CSS selector.
 * @param {boolean} all If true, returns a list of every matched elements.
 * @returns {Element|NodeList}
 */
const $ = (dom, query, all) => dom['querySelector' + (all ? 'All' : '')](query)

/**
 * Returns `textContent` of `node`.
 * If either `node` is falsy or has no `textContent`, return `def` instead.
 *
 * @param {Node} node
 * @param {string} def The default value.
 * @returns {string}
 */
const $def = (node, def = '') => ((node && node.textContent) || def).trim()

/**
 * Returns the text of first element that matches the selector.
 *
 * @param {Document|Element} dom The parent.
 * @param {string} query A string containing a CSS selector.
 * @param {string} def The default value.
 * @returns {string}
 */
const $text = (dom, query, def = '') => $def($(dom, query), def)

/**
 * Shorthand for `Document.querySelectorAll`.
 *
 * @param {Document|Element} dom The parent.
 * @param {string} query A string containing a CSS selector.
 * @returns {NodeList}
 */
const $all = (dom, query) => $(dom, query, true)

/**
 * Gets a list of matched elements and `map` it.
 *
 * @param {Document|Element} dom The parent.
 * @param {string} query A string containing a CSS selector.
 * @param {function} map The callback function for `Array.prototype.map`
 * @returns {Object[]}
 */
const $map = (dom, query, map) => Array.prototype.map.call($all(dom, query), node => map(node))

/**
 * Gets a list of matched elements and `map` it.
 * Exclude elements from list that `map` function returned falsy value for it.
 *
 * @param {Document|Element} dom The parent.
 * @param {string} query A string containing a CSS selector.
 * @param {function} map The callback function for `Array.prototype.map`
 * @returns {Object[]}
 */
const $mapf = (dom, query, map) => $map(dom, query, map).filter(result => !!result)

/**
 * Gets a text list of matched elements.
 *
 * @param {Document|Element} dom The parent.
 * @param {string} query A string containing a CSS selector.
 * @param {string} def The default value.
 * @returns {string[]}
 */
const $list = (dom, query, def) => $map(dom, query, node => $def(node, def))

/**
 * Gets a list of the attribute of matched elements.
 *
 * @param {Document|Element} dom The parent.
 * @param {string} query A string containing a CSS selector.
 * @param {string} attr The attribute name.
 * @returns {string[]}
 */
const $lista = (dom, query, attr) => $map(dom, query, node => node.getAttribute(attr))

/**
 * Removes non-numerics from `text` and converts it.
 * If it cannot be converted into a number, the zero is returned instead.
 *
 * @param {string} text
 * @returns {number}
 */
const clean = text => parseInt(text.replace(/\D/g, ''), 10) || 0

/**
 * Calculates the average of given list.
 *
 * @param {number[]} list The given list.
 * @returns {number}
 */
const getAverage = list => {
  const sum = list.reduce((a, b) => a + b)
  return Math.round(sum / (list.length || 1))
}

/**
 * Returns the price of given string.
 * If price has a range, the average is returned instead.
 *
 * @param {string} price
 * @returns {number}
 */
const getPrice = price => price.includes('~')
  ? getAverage(price.split('~').map(clean)) : clean(price)

/**
 * Parse the document.
 * Returns false if the document has no `#content`.
 *
 * @returns {Object|boolean}
 */
const parse = () => {
  const contentArea = $(document, '#content')
  if (!contentArea) return false

  const nameArea = $(contentArea, '.biz_name_area')
  const name = $text(nameArea, 'strong.name')
  const category = $text(nameArea, 'span.category')

  const infoArea = $(contentArea, '.list_bizinfo')
  const tel = $text(infoArea, '.list_item_biztel')

  const tvs = $list(infoArea, '.list_item_tv .txt .tv')
  const addresses = $list(infoArea, '.list_item_address span.addr')
  const homepages = $lista(infoArea, '.list_item_homepage a', 'href')

  const cBooking = $text(infoArea, '.list_item_convenience .convenience').indexOf('예약') >= 0
  const nBooking = $all(contentArea, '.func_btn_area ul li').length > 3 // 4개이면 예약 버튼이 있는 걸로 취급

  const menus = $mapf(infoArea, '.list_item_menu .list_menu li', node => {
    const [name, price] = [$text(node, '.menu .name'), $text(node, '.price')]
    return !!name && !!price && { name, price: getPrice(price), originalText: price }
  })
  const averagePrice = getAverage(menus.map(m => m.price))

  return { name, category, tel, addresses, homepages, nBooking, cBooking, menus, averagePrice, tvs }
}

parse()

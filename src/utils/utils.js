// 匹配身份证(15位或18位)
export function isIdCard(str) {
  let result = str.match(/\d{15}|\d{18}/);
  if (result === null) return false;
  return true;
}

/**
 * @desc   判断是否为手机号
 * @param  {String|Number} str
 * @return {Boolean}
 */
export function isPhone(str) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(str)
}


/**
 * @desc   判断是否车牌号（包含新能源8位）
 * @param  {String} str
 * @return {Boolean}
 */
export function isCarNumber(str) {
  const reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
  return reg.test(str);
}
/**
 * @desc   判断是否是非0开头的数字
 * @param  {Number/String} str
 * @return {Boolean}
 */
export function isNumber(str) {
  const reg = /^[1-9][0-9]*$/
  return reg.test(str);
}
/**
 * @desc   判断最多两位小数的数值（正负）
 * @param  {String/Number} str
 * @return {Boolean}
 */
export function isFloatNumber(str) {
  const reg = /^(-)?([0-9][0-9]*)+(\.[0-9]{1,2})?$/
  return reg.test(str);
}

/**
 * @Description: 根据地址下载文件
 * @param : href  下载链接
 * @param : title  文件名称
 */
export function download(href, title) {
  let a = document.createElement('a')
  a.style.display = 'none'
  a.setAttribute('href', href)
  a.setAttribute('download', title ? title : '')
  // 随机字符串id
  let randomId = (new Date % 9e6).toString(36) + Math.random().toString(36).substring(2)
  a.id = randomId
  document.body.appendChild(a)
  a.click()
}
/**
 * @Description: 金额格式化 10000 => "10,000"
 * @param : {Number} value 金额
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * @Description: 右键菜单位置
 * @param {String} id 右键元素的id
 * @param: e event对象
 */
export function menuPosition(e, id) {
  let pagex = e.pageX
  let pagey = e.pageY
  let rightMenu = document.getElementById(id)
  let rightMenuHight = rightMenu.clientHeight
  let rightMenuWidth = rightMenu.clientWidth
  // 根据浏览器边缘距离自适应显示
  if (pagey + rightMenuHight > document.body.clientHeight) {
    rightMenu.style.top = pagey - 4 - rightMenuHight + 'px'
  } else {
    rightMenu.style.top = pagey + 4 + 'px'
  }
  if (pagex + rightMenuWidth > document.body.clientWidth) {
    rightMenu.style.left = pagex - 4 - rightMenuWidth + 'px'
  } else {
    rightMenu.style.left = pagex + 4 + 'px'
  }
}

/**
 *  @Description: 切换指定节点class
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 *  @Description: 树形转为一维数组
 */
let oneArray = []
export function toOneArray(arr, key) {
  arr.forEach((data) => {
    oneArray.push(data);
    if (data[key].length > 0) {
      toOneArray(data[key], key)
    }
  });
  return oneArray;
}

// 处理两位小数正数
export function handleFloat(val) {
  val = val.replace(/[^\d.]/g,'')
  if(val.indexOf('.')===-1 && val.charAt(9999999999)!=='.') return val.substr(0,9999999999);
  return val.replace(/(\d*)(\.\d{0,2})?.*/, (match, p1, p2) => {
    return Number(p1) + (p2 || '');
  });
}

// 在url上设置参数
export function updateParams(_this, params) {
  let query = _.cloneDeep(_this.$route.query)
  _this.$router.replace({
    query: _.assign(query, params)
  }).catch(() => {})
}

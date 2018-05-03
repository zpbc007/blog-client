/**
 * 遍历属性对象，将属性添加到dom中
 * @param {*} d3SelectObj 通过d3选择的对象
 * @param {*} attr 属性对象
 */
function addAttr (d3SelectObj, attrObj) {
    for (let attr in attrObj) {
        // 跳过数据部分
        if (attr === 'data') {
            continue
        }
        if (typeof attrObj[attr] === 'function') {
            d3SelectObj.attr(attr, item => attrObj[attr])
        } else {
            d3SelectObj.attr(attr, attrObj[attr])
        }
    }
}

export {
    addAttr
}
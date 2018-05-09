function getPosition (element) {
    let transform = element.getAttribute('transform'),
        match = null,
        x = null,
        y = null

    if (transform) {
        match = transform.match(/translate\(\s*(-?[\d.]*)\s*[,]\s*(-?[\d.]*)\s*/)
    }

    if (match && match.length >= 2) {
        x = Number.parseFloat(match[1])
		y = Number.parseFloat(match[2])
    } else {
        x = Number.parseFloat(element.getAttribute('x'))
		y = Number.parseFloat(element.getAttribute('y'))
    }

    if (!x) x = 0
    if (!y) y = 0
    
    return {x, y}
}

// dom节点在svg中的绝对定位
function findAbsolutePosition (element) {
    let abspos = {
        x: 0,
        y: 0
    }
    while (element.getAttribute && element.tagName !== 'svg') {
        let pos = getPosition(element)

        if (pos.x || pos.y) {
            abspos.x += pos.x
            abspos.y += pos.y
        }

        element = element.parentNode
    }

    return abspos
}

// 根据from to 生成id
function genLineRelId (from, to) {
    return `${from}|---|${to}`
}

export {
    findAbsolutePosition,
    genLineRelId
}
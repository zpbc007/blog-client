/**
 * @description 计算中点坐标
 * @param {*} start 
 * @param {*} end 
 */
function calMidPoint (start, end) {
    let midXLen = (start.x - end.x) / 2,
        midYLen = (start.y - end.y) / 2,
        lessX = midXLen > 0 ? end.x : start.x,
        lessY = midYLen > 0 ? end.y : start.y

    return {
        x: Math.abs(midXLen) + lessX,
        y: Math.abs(midYLen) + lessY
    }
}

/**
 * @description 计算斜率
 * @argument start: 起点 end：终点
 * @returns value: 斜率绝对值 symbol: 箭头所在象限
 */
function calSlope (start, end) {
    let value, symbol
    
    if (start.x === end.x) {
        value = 1
        symbol = start.y > end.y ? -1 : 1
    } else if (start.y === end.y) {
        value = 0
        symbol = start.x > end.x ? -1 : 1
    } else {
        value = Math.abs((start.y - end.y) / (start.x - end.x))
        if (end.x > start.x && end.y < start.y) {
            symbol = 0
        } else if (end.x < start.x && end.y < start.y) {
            symbol = 1
        } else if (end.x < start.x && end.y > start.y) {
            symbol = 2
        } else if (end.x > start.x && end.y > start.y) {
            symbol = 2
        }
    }
    return {
        value,
        symbol
    }
}
// 根据斜率计算旋转角度
function calAngle (slope) {
    let angle = 0

    if (slope.value === 1 && slope.symbol > 0) {
        angle = 180
    } else if (slope.value === 1 && slope.symbol < 0) {
        angle = 0
    } else if (slope.value === 0 && slope.symbol < 0) {
        angle = -90
    } else if (slope.value === 0 && slope.symbol > 0) {
        angle = 90
    } else {
        let tempAngle = (Math.atan(slope.value)) / Math.PI * 180
        switch (slope.symbol) {
            case 0:
                angle = 90 - tempAngle
                break
            case 1: 
                angle = 90 - tempAngle
                break
            case 2: 
                angle = 90 + tempAngle
                break
            case 3: 
                angle = 90 + tempAngle
                break
            default:
                throw new Error(`不存在的象限${slope.symbol}`)
        }
    }

    return angle
}

export {
    calMidPoint,
    calSlope,
    calAngle
}
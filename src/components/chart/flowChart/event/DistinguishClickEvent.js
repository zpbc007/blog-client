import * as d3 from 'd3'

/**
 * 区分单击、双击、拖拽事件
 */
export function DistinguishClickEvent() {
    let event = d3.dispatch('click', 'dblclick', 'start', 'end', 'drag'),
        storeSelection  =null
    function cc(selection) {
        let down, // mouseDown时鼠标位置
            tolerance = 1, // mouseDown 与 mouseUp间最大距离
            downTime,   // mouseDown时间
            wait = null, // 定时器
            isDown = false, // mouseDown 标志位
            isDrag = false, // drag 标志位
            eventQueue = [] // 事件队列,
            storeSelection = selection 

        // 计算两点间的距离 
        function dist(a, b) {
            if (a !== undefined && b !== undefined) {
                return Math.sqrt(Math.pow(a[0] - b[0], 2), Math.pow(a[1] - b[1], 2))
            } 
            return null
        }
        // 清空事件队列
        function clearQueue () {
            while (eventQueue.length > 0) {
                let currentEvent = eventQueue.shift()
                if (currentEvent.type === 'mousedown') {
                    // mouserdown 为drag start
                    event.call('start', null, currentEvent)
                } else {
                    // mousemove为drag
                    event.call('drag', null, currentEvent)
                }
            }
        }
        selection.on('mousemove', function () {
            // 按下鼠标
            if (isDown) {
                // 向队列中添加事件
                eventQueue.push(d3.event)
                if (isDrag) {
                    // 已经判断为drag 将队列中的事件清空
                    clearQueue()
                } else {
                    // 此时还不能判断是否为drag事件
                    // 如果鼠标移动一定距离则判定为drag
                    if (dist(down, d3.mouse(document.body)) > tolerance) {
                        isDrag = true
                        clearQueue()
                    }
                }
            }
        })

        selection.on('mousedown', function() {
            eventQueue = []
            // 向队列中添加事件
            eventQueue.push(d3.event)
            // 记录此时鼠标位置
            down = d3.mouse(document.body)
            // 记录时间
            downTime = new Date()
            // 触发标志位
            isDown = true  
        })

        d3.select(document.body).on('mouseup', function() {
            isDown = false
            // 鼠标移动了一定距离或者已经判断为drag
            if (dist(down, d3.mouse(document.body)) > tolerance || isDrag) {
                // 清空队列
                clearQueue()
                // 标志位复位
                isDrag = false
                // 触发end事件
                event.call('end', null, d3.event)
            } else {
                // 如果有定时器 则为第二次触发
                if (wait) {
                    // 清空定时器
                    window.clearTimeout(wait)
                    wait = null
                    eventQueue = []
                    // 触发双击事件
                    event.call('dblclick', null, d3.event)
                } else {
                    wait = window.setTimeout((function(e) {
                        return function() {
                            wait = null
                            eventQueue = []
                            // 超时触发单击事件
                            event.call('click', null, e)
                        }
                    })(d3.event), 300)
                }
            }
        })
    }

    cc.on = function () {
        var value = event.on.apply(event, arguments);
        return value === event ? cc : value;
    }

    cc.destroy = function () {
        storeSelection.on('mousemove', null)
        storeSelection.on('mousedown', null)
        storeSelection.on('mouseup', null)
    }

    return cc
}
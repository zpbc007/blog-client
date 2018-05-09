import * as d3 from 'd3'
import Event from './event/CustomizeEvent'
import { DistinguishClickEvent } from './event/DistinguishClickEvent'

const createEventId = Symbol('createEventId'),
    parseEventId = Symbol('parseEventId')

// 事件处理对象
class Handler extends Event {
    /**
     * @param {*} root 根dom
     * @param {module: ./Store} store
     */
    constructor (root, store) {
        super()

        this.d3Root = d3.select(root)
        this.store = store
        this.addDomListener()
    }

    // 为根节点添加事件监听
    addDomListener() {
        const self = this,
            distinguishClickEvent = DistinguishClickEvent()
        let currentId = null

        // 事件触发后处理逻辑
        function eventAppear (type, event) {
            if (!event) {
                event = d3.event
            }
            // 连线模式
            if (self.store._lineMode) {
                // 不再响应拖动事件 双击事件 删除事件
                if (['start', 'end', 'drag', 'dblclick', 'delete'].includes(type)) {
                    return 
                } 

                // 单击事件变为连线事件
                if (type === 'click') { 
                    type = 'drawLine'
                }
            }

            // 拖动开始记住当前拖动对象的id
            if (type === 'start') {
                currentId = event.target.id
            }
            let targetId = currentId || event.target.id
            // resize修正targetId
            if (type === 'resize') {
                targetId = self.root.attr('id')
            }
            if (type === 'delete') {
                let id = null
                if (self.store.selectedLane.length > 0) {
                    id = self.store.selectedLane[0]
                }
                if (self.store.selectedNode.length > 0) {
                    id = self.store.selectedNode[0]
                }
                if (self.store.selectedLine.length > 0) {
                    id = self.store.selectedLine[0]
                }

                targetId = id
            }
                
            self.dispatchEvent(type, event, targetId)
            if (type === 'end') {
                currentId = null
            }
        }

        // 区分单击事件
        this.d3Root.call(distinguishClickEvent)
        for (let eventName of ['click', 'dblclick', 'start', 'drag', 'end']) {
            distinguishClickEvent.on(eventName, eventAppear.bind(null, eventName))
        }
        
        // 监听focusout事件
        this.d3Root.on('focusout', eventAppear.bind(null, 'focusout'))

        // 监听键盘事件
        d3.select('body').on('keydown', function () {
            // 后退键或删除键
            if (d3.event.keyCode === 8 || d3.event.keyCode === 46) {
                eventAppear('delete', null)
            }
        })
    }

    /**
     * 添加事件监听
     * @param {string} event 事件名
     * @param {function} fn 回调
     * @param {string} id 组件id
     */
    addEventListener (event, fn, id) {
        // 有id根据id生成事件id
        if (id) {
            event = this[createEventId](event, id)
        }

        super.addEvent(event, fn)
    }

    /**
     * 移除事件监听
     * @param {string} event 事件名
     * @param {function} fn 回调 
     * @param {string} id 组件id
     */
    removeEventListener (event, fn, id) {
        if (id) {
            event = this[createEventId](event, id)
        }

        super.removeEvent(event, fn)
    }

    /**
     * 触发事件
     * @param {string} eventType 事件名
     * @param {object} event 事件对象 
     * @param {string} id 组件id
     * @param {*} rest 数据
     */
    disPatchEvent (eventType, event, id, ...rest) {
        if (id) {
            eventType = this[createEventId](eventType, id)
        }

        super.dispatchEvent(eventType, event, ...rest)
    }

    /**
     * 生成事件id
     * @param {string} event 事件名
     * @param {id} 组件id
     */
    [createEventId] (event, id) {
        return `${event}__${id}`
    }

    // 解析事件id
    [parseEventId] (event) {
        let dataArr = event.split('__')
        return {
            eventType: dataArr[0],
            id: dataArr[1]
        }
    }

    destroy () {
        super.destroy()
    }
}

export {
    Handler
}
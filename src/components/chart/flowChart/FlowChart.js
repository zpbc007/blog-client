import { Store } from './Store'
import { Handler } from './Handler'
import { Painter } from './Painter'

let id = 0

// 流程图对外接口
class FlowChart {
    /**
     * @param {} dom 流程图所在dom
     * @param {module: ./Store} store 数据仓库对象
     * @param {module: ./Handler} handler 事件处理对象
     * @param {module: ./Painter} painter 绘制图形对象
     * @param {object} opts 配置
     */
    constructor (dom, opts) {
        let store = new Store()
        this.store = store
        this.handler = new Handler(dom, store)
        this.painter = new Painter(dom, store)
        this._id = id++
    }

    /**
     * 监听流程图全局事件(不带组件id的)
     * @param {string} event 
     * @param {function} fn 
     */
    on (event, fn) {
        this.handler.addEventListener(event, fn)
    }

    /**
     * 移除流程图全局事件(不带组件id的)
     * @param {string} event 
     * @param {function} fn 
     */
    off (event, fn) {
        this.handler.removeEventListener(event, fn)
    }
    
    /**
     * 更新画布大小，容器改变大小时，使用此方法
     */
    resize (opts) {
        opts = opts || {}
        this.painter.resize(opts.width, opts.height)
    }

    destroy () {
        this.store.destroy()
        this.handler.destroy()

        this.store = this.handler = this._id = null
    }
}

export {
    FlowChart
}
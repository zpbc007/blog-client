// 流程图绘制对象 注册所有图形
class Painter {

    static registerChart (name, cons) {
        // 将图形构造函数放入原型中
        if (!this.prototype._chartCons) {
            // 所有组件共有
            this.prototype._chartCons = {}
        }
        this.prototype._chartCons[name] = cons
    }

    constructor (dom, store) {
        this.dom = dom
        this.store = store
        // 图层
        this._layerMap = {
            // 泳道层
            lane: null,
            // 连线层
            line: null,
            // 节点层
            node: null,
            // 动画层
            animate: null,
            // 移动层
            move: null
        }
        // id索引的map
        this._graphMap = {}
    }

    // 创建图形
    create (type, ...args) {
        if (this._chartCons[type]) {
            throw new Error(`不存在此种类型的图形: ${type}`)
        } else {
            return new this._chartCons[type](...args)
        }
    }

    // 重新绘制图形
    reDraw () {

    }

    resize (width, height) {

    }
}

export {
    Painter
}
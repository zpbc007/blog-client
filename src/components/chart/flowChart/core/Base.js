import * as d3 from 'd3'
import uuid from 'uuid/v4'
import Event from '../event/CustomizeEvent'

// private 方法名
const checkArg = Symbol('checkArg'),
    addLifeCycleListener = Symbol('addLifeCycleListener'),
    createEventId = Symbol('createEventId'),
    parseEventId = Symbol('parseEventId'),
    getStoreData = Symbol('getStoreData'),
    initStore = Symbol('initStore')


class Base {

    // 注册图形构造函数 统一管理
    static resisterChart (name, cons) {
        if (!this.prototype._chartCons) {
            // 所有组件共有
            this.prototype._chartCons = {}
        }
        this.prototype._chartCons[name] = cons
    } 

    constructor (el, config, className) {
        // 检查参数
        this[checkArg](el, config, className)
        // 创建id
        this._id = uuid()
        // 当前组件所在dom
        this.el = el
        // d3选择的dom
        this.d3El = d3.select(this.el)
        // 配置
        this.config = config
        // 类名
        this.className = className

        this[initStore]()
    }

    // 参数检查
    [checkArg] (el, config, className) {
        if (!el) {
            console.log('el:', el)
            throw new Error('el 不能为空')
        }
    }

    // ========store处理========

    // 拿到在store中数据的引用
    [initStore] () {
        this[getStoreData]((data) => {
            if (!data._layers) {
                data._layers = {}
            }
            if (!data._graphs) {
                data._graphs = {}
            }
            if (!data.compData) {
                data.compData = {}
            }
            if (!data.event) {
                data.event = new Event()
            }
            this.storeData = data
        })
    }

    // 获取在store中属于自己的数据
    [getStoreData] (accessor) {
        // 不存在则初始化
        if (!this.store[this._commonId]) {
            this.store[this._commonId] = {}
        }
        accessor(this.store[this._commonId])
    }

    // ========生命周期========

    beforDestory (func) {
        this[addLifeCycleListener]('beforDestory', func)
    }

    destoryed (func) {
        this[addLifeCycleListener]('destoryed', func)
    }

    // 添加生命周期监听
    [addLifeCycleListener] (name, func) {
        this.addEventListener(name, func)
    }

    // ========事件处理========

    /**
     * 注册事件
     * @param {*} eventType 事件类型
     * @param {*} fn 回调函数
     * @param {*} id 监听的domId
     * @param {*} genId 是否通过组件id生成事件id
     */
    addEventListener (eventType, fn, id = this._id, genId = true) {
        let eventId = null
        // 是否将_id添加到eventId中
        if (genId) {
            eventId = this[createEventId](eventType, id)
        } else {
            eventId = eventType
        }
        this.storeData.event.addEvent(eventId, fn)
    }

    /**
     * 分发事件
     * @param {*} eventType 事件类型
     * @param {*} event 事件
     * @param {*} id 事件触发者id
     * @param {*} rest 数据
     */
    dispatchEvent (eventType, event, id, ...rest) {
        if (!id) {
            id = this._id
        }

        this.storeData.event.dispatchEvent(this[createEventId](eventType, id), event, ...rest)
    }

    // 生成事件id
    [createEventId] (eventType, id) {
        return `${eventType}__${id}`
    }

    // 解析事件id
    [parseEventId] (eventId) {
        let dataArr = eventId.split('__')
        return {
            eventType: dataArr[0],
            id: dataArr[1]
        }
    }
}

// 存放共同数据
Base.prototype.store = {}

// 重新生成原型上的id 使得继承于该类的组件将数据存放于
function Reset () {
    Base.prototype._commonId = uuid()
}

// 改变原型上的id 使得继续创建的组件将数据存放于commonId对应的位置中
function Recovery (commonId) {
    if (!Base.prototype.store[commonId]) {
        throw new Error(`没有此id对应的数据: ${commonId}`)
    }
    Base.prototype._commonId = commonId
}

Reset()


export {
    Base
}
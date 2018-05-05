/**
 * 创建自定义事件
 */
class Event {
    constructor () {
        this.listener = {}
    }

    // 添加事件
    addEvent (type, fn) {
        // 不存在此类型 添加之
        if (!this.listener[type]) {
            this.listener[type] = []
        }
        this.listener[type].push(fn)
    }

    // 删除事件
    removeEvent (type, fn) {
        if (!fn) {
            // fn不存在,删除类型对应的所有方法
            delete this.listener[type]
        } else {
            // fn存在遍历对应类型的方法删除指定方法
            let callbackArr = this.listener[type]
            for (let i = callbackArr.length - 1; i > -1; i--) {
                if (callbackArr[i] === fn) {
                    callbackArr.splice(i, 1)
                    break
                }
            }
        }
    }

    // 触发事件
    dispatchEvent (type, event, ...rest) {
        if (this.listener[type]) {
            // 遍历执行该类型的所有方法
            for (let fn of this.listener[type]) {
                fn(type, event, ...rest)
            }
        } else {
            console.warn(`不存在当前类型的事件${type}`)
        }
    }

    destroy () {
        this.listener = []
    }
}

export default Event
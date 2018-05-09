const destroy = Symbol('destroy')
/**
 * 数据仓库
 */
class Store {
    constructor () {
        // 选中的泳道
        this.selectedLane = []
        // 选中的节点
        this.selectNode = []
        // 选中的连线
        this.selectedLine = []
    }

    // 清空数据
    destroy () {
        this._graphMap = this._layerMap = null
    }

}

export {
    Store
}
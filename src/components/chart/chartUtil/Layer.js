import uuid from 'uuid/v4'
import * as d3 from 'd3'
import { ChartConstructor } from './ChartMap'

const LayerPrefix = 'layer'

// 图层
class Layer {
    /**
     * @param {*} parent 图层父节点
     * @param {*} name 图层名称
     */
    constructor (parent, name) {
        this.parent = parent
        this.d3Parent = d3.select(parent)
        this.name = name

        this.d3Container = this.d3Parent
            .append('g')
            .attr('class', `${LayerPrefix}-${name}`)
        this.container = this.d3Container.node()
        this._id = uuid()
        this.graphMap = {}
    }

    /**
     * 添加图形
     */
    addGraph (type, name, attrObj) {
        let graph = new ChartConstructor[type](this.container, name, attrObj)
    }
}

export {
    Layer
}
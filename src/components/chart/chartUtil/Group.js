import * as d3 from 'd3'
import { addAttr } from './Util'
import { ChartConstructor } from './ChartMap'

class Group {
    constructor (parent, name, config) {
        this.parent = parent
        this.d3Parent = d3.select(parent)

        this.d3Container = this.d3Parent.append('g')
                .attr('class', `${name}`)
        addAttr(this.d3Container, config)
        this.container = this.d3Container.node()
    }

    /**
     * 添加图形
     */
    addGraph (type, name, config) {
        debugger
        let graph = new ChartConstructor[type](this.container, name, config)
        return graph
    }
}

export {
    Group
}
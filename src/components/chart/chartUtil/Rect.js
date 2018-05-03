import * as d3 from 'd3'
import { addAttr } from './Util'
// 矩形
function appendRect (rectList, parent, selector) {
    const rectGroupUpdate = parent
        .selectAll(selector)
        .data(rectList),
        rectGroupEnter = rectGroupUpdate.enter()
            .append('g')
            .attr('class', item => item.containerClass)
            .attr('id', item => item.containerId),
        rectGroupExit = rectGroupUpdate.exit()

    rectGroupExit.remove()
    
    const graph = rectGroupEnter
        .append('rect')
        .merge(rectGroupUpdate.selectAll('rect'))
        .attr('class', item => item.class)
        .attr('x', item => item.x)
        .attr('y', item => item.y)
        .attr('width', item => item.width)
        .attr('height', item => item.height)
        .attr('fill-opacity', '0')
        .attr('stroke-width', '1.5')
        .attr('stroke', 'steelblue')
        .attr('id', item => item.id || null)

    return {
        graph,
        group: rectGroupUpdate.merge(rectGroupEnter)
    }
}

const DefaultValue = {
    'width': '100',
    'height': '80',
    'x': '0',
    'y': '0',
    'fill-opacity': '0',
    'stroke-width': '1.5',
    'stroke': 'steelblue'
}

// 矩形
class Rect {
    /**
     * @param {*} parent 图形父节点
     */
    constructor(parent, name, config) {
        this.parent = parent
        this.d3Parent = d3.select(parent)

        this.d3Container = this.d3Parent.append('rect')
            .attr('class', `${name}`)
        this.config = {...DefaultValue, ...config}
        addAttr(this.d3Container, this.config)
        this.container = this.d3Container.node()
    }

    // 编辑属性
    editAttr (config) {
        this.config = {...this.config, ...config}
        addAttr(this.d3Container, this.config)
    }
}

export {
    Rect
}
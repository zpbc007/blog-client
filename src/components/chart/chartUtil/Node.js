import * as d3 from 'd3'
import { Group } from './Group'

const NodePrefix = 'node'
const DefaultValue = {
    
}

// 流程节点
class Node {
    constructor (parent, name, config) {
        if (config) {
            if (!config.group) {
                config.group = {}
            }
            if (!config.rect) {
                config.rect = {}
            }
            if (!config.text) {
                config.text = {}
            }
        } else {
            config = {
                group: {}
            }
        }

        this.parent = parent
        this.d3Parent = d3.select(parent)

        // group部分
        this.group = new Group(this.parent, `${NodePrefix}-${name}`, config.group)
        // rect部分
        this.rect = this.group.addGraph('rect', `${name}`, config.rect) 
        // text部分
        this.text = this.group.addGraph('text', `${name}`, config.text)
    }
}

export {
    Node
}
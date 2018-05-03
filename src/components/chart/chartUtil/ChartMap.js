import { Group } from './Group'
import { Rect } from './Rect'
import { Layer } from './Layer'
import { Node } from './Node'
import { Text } from './Text'


const ChartType = {
    group: 'group',
    rect: 'rect',
    layer: 'layer',
    node: 'node',
    text: 'text'
}

const ChartConstructor = {
    group: Group,
    rect: Rect,
    layer: Layer,
    node: Node,
    text: Text
}

export {
    ChartType,
    ChartConstructor
}
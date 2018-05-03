import { Rect } from './Rect'
import { Lane } from './Lane'
import { Group } from './Group'
import { FlowChart } from './FlowChart'

function CreateFlowChart (selector) {
    return new FlowChart(selector)
}

export {
    Rect,
    Lane,
    Group,
    CreateFlowChart
}
import { FlowChart } from './FlowChart'

// id-实例 Map
let InstanceMap = {}

// 初始化方法
function init (dom, opts) {
    let flowChart = new FlowChart(dom, opts)
    InstanceMap[getId(flowChart)] = flowChart
    return flowChart
}

// 获取流程图实例
function getInstance (id) {
    return InstanceMap[id]
}

// 获取流程图id
function getId (flowChart) {
    return flowChart._id
}

// 销毁流程图实例
function destroy (flowChart) {
    if (flowChart) {
        flowChart.destroy()
        delete InstanceMap[getId(flowChart)]
    } else {
        for (let id of InstanceMap) {
            InstanceMap[id].destroy()
        }
        InstanceMap = {}
    }
}

export {
    init,
    getInstance,
    destroy
}
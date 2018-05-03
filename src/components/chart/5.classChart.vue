<template>
    <div class="container">
        <div id="diagram"></div>
    </div>
</template>
<script>
import * as d3 from 'd3'
// 用于生成节点id
import uuid from 'uuid/v4'
import * as FlowChart from './chartUtil/index'

window.d3 = d3
const drag = d3.drag
const line = d3.line
const symbol = d3.symbol

// 初始数据
const initData = {
    // 泳道数据
    lane: [
        {
            order: 0,
            processId: '0',
            name: '申请部门'
        },
        {
            order: 1,
            processId: '1',
            name: '采购部'
        },
        {
            order: 2,
            processId: '2',
            name: '财务部'
        }
    ],
    // 节点数据
    processNodes: [
        {
            index: 0,
            id: '0',
            processId: '0',
            name: '出口清单'
        },
        {
            index: 1,
            id: '1',
            processId: '0',
            name: '仓库入库'
        },
        {
            index: 0,
            id: '2',
            processId: '1',
            name: '进口清单'
        },
        {
            index: 0,
            id: '3',
            processId: '1',
            name: '节点1-1'
        },
        {
            index: 0,
            id: '4',
            processId: '2',
            name: '节点2-0'
        }
    ],
    // 关联数据
    relList: [
        {
            from: '0',
            to: '1'
        },
        {
            from: '1',
            to: '3'
        },
        {
            from: '3',
            to: '2'
        },
        {
            from: '3',
            to: '4'
        }
    ]
}
// 默认值
const DefaultValue = {
    // 画布部分
    svg: {
        paddingTop: 20,
        paddingRight: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        width: 1200,
        height: 800
    },
    chartContainer: {
        width: 1000
    },
    modelContainer: {
        width: 200
    },
    // 泳道部分
    lane: {
        width: 300,
        height: 160,
        titleHeight: 60
    },
    // 流程节点部分
    node: {
        marginTop: 50,
        marginRight: 50,
        marginBottom: 50,
        marginLeft: 50,
        height: 100
    },
    // 文字部分
    text: {
        marginTop: 10,
        marginRight: 20,
        marginBottom: 10,
        marginLeft: 20,
        css: {
            'position': 'absolute',
            'line-height': '16px',
            'font-size': '13px',
            'font-family': '微软雅黑',
            'font-weight': 'normal',
            'font-style': 'normal',
            'text-align': 'center', 
            'color': 'rgb(50, 50, 50)', 
            'text-decoration': 'none',
            'opacity': '0.8',
            'resize': 'none'
        }
    }
}


export default {
    data () {
        return {
            // 流程图实例
            flowChart: null,
            // 泳道图层
            laneLayer: null,
            // 连线图层
            lineLayer: null,
            // 节点图层
            nodeLayer: null,
            // 泳道数据 id-data
            laneList: {},
            // 排序后的id数据
            laneIdList: [],
            // 流程节点数据 id-data
            nodeList: {},
            // 泳道id-节点数组
            nodeLaneIdList: {},
            // 节点关联数据
            relList: []
        }
    },
    watch: {
    },
    methods: {
        init () {
            this.parseData()
            this.initCanvas()
            this.draw()
        },
        // 初始化画布
        initCanvas () {
            // 创建流程图对象
            this.flowChart = FlowChart.CreateFlowChart('#diagram')
            this.laneLayer = this.flowChart.appendLayer('lane')
            this.lineLayer = this.flowChart.appendLayer('line')
            this.nodeLayer = this.flowChart.appendLayer('node')
        },
        // ==========数据解析部分==========

        // 解析数据 计算初始坐标
        parseData () {
            // 将泳道数据按order排序
            let sortedLaneData = initData.lane.sort((lane1, lane2) => {
                return lane1.order - lane2.order
            })
            // 解析泳道数据
            this.__parseLaneData(sortedLaneData)

            // `${泳道id}`: [节点]
            let laneIdNodeMap = {}
            // 将节点数据按泳道分组
            initData.processNodes.forEach((node, index) => {
                if (!laneIdNodeMap[node.processId]) {
                    laneIdNodeMap[node.processId] = []
                }
                laneIdNodeMap[node.processId].push(node)
            })
            // 按index排序
            for (let id in laneIdNodeMap) {
                laneIdNodeMap[id] = laneIdNodeMap[id].sort((node1, node2) => {
                    return node1.index - node2.index
                })
            }
            // 解析流程节点数据
            this.__parseNodesData(laneIdNodeMap)

            let maxHieght = 0
            // 计算泳道最大高度
            for (let id in this.nodeLaneIdList) {
                let nodeLength  = this.nodeLaneIdList[id].length,
                    height = nodeLength * DefaultValue.node.height + 
                        (nodeLength - 1) * DefaultValue.node.marginTop + 
                        DefaultValue.node.marginTop +
                        DefaultValue.node.marginBottom +
                        DefaultValue.lane.titleHeight
                if (height > maxHieght) {
                    maxHieght = height
                }
            }
            // 更新泳道高度
            for (let id in this.nodeLaneIdList) {
                this.$set(this.laneList[id], 'height', maxHieght)
            }

            // 解析关联数据
            this.__parseRelData(initData.relList)
        },
        // 解析泳道部分数据
        __parseLaneData (laneData) {
            let laneDefault = DefaultValue.lane,
                textDefault = DefaultValue.text

            laneData.forEach((lane, index) => {
                this.laneList.push({
                    id: lane.processId,
                    width: laneDefault.width,
                    height: laneDefault.height,
                    x: index * laneDefault.width,
                    y: 0,
                    text: {
                        // todo 如何获取所有祖父节点的transition
                        x: index * laneDefault.width + 
                            textDefault.marginLeft + 
                            DefaultValue.svg.paddingTop + 
                            DefaultValue.modelContainer.width,
                        y: textDefault.marginTop + DefaultValue.svg.paddingLeft,
                        width: laneDefault.width - textDefault.marginRight - textDefault.marginLeft,
                        height: laneDefault.titleHeight - textDefault.marginTop - textDefault.marginBottom,
                        value: lane.name,
                    },
                    data: lane
                })
            })
        },
        // 解析流程节点数据
        __parseNodesData (laneIdNodeMap) {
            let nodeDefault = DefaultValue.node,
                textDefault = DefaultValue.text

            for (let laneId in laneIdNodeMap) {
                let nodeList = laneIdNodeMap[laneId],
                    laneData= this.laneList[laneId]
                nodeList.forEach((node, index) => {
                    // 放入关系对象中
                    if (!this.nodeLaneIdList[laneId]) {
                        this.$set(this.nodeLaneIdList, laneId, [])
                    }
                    this.nodeLaneIdList[laneId].push(node.id)
                    let laneX = laneData.x + nodeDefault.marginLeft,
                        laneY = laneData.y + 
                            DefaultValue.lane.titleHeight + 
                            (index + 1) * nodeDefault.marginTop + 
                            index * nodeDefault.height,
                        laneWidth = laneData.width - 
                            nodeDefault.marginLeft - 
                            nodeDefault.marginRight,
                        laneHeight = nodeDefault.height
                    // 节点数据
                    this.$set(this.nodeList, node.id, {
                        x: laneX,
                        y: laneY,
                        width: laneWidth,
                        height: laneHeight,
                        containerId: node.id,
                        text: {
                            width: laneWidth - textDefault.marginLeft - textDefault.marginRight,
                            height: laneHeight - textDefault.marginTop - textDefault.marginBottom,
                            x: laneX + 
                                textDefault.marginLeft + 
                                DefaultValue.svg.paddingLeft + 
                                DefaultValue.modelContainer.width,
                            y: laneY + 
                                textDefault.marginTop + 
                                DefaultValue.svg.paddingTop,
                            value: node.name
                        },
                        data: node
                    })
                })
            }
        },
        // 解析关联数据
        __parseRelData (relList) {
            // 根据节点信息计算中间点位置
            function getPointAttrByNode (node) {
                return {
                    x: node.x + node.width / 2,
                    y: node.y + node.height / 2
                }
            }
            for (let rel of relList) {
                let fromNode = this.nodeList[rel.from],
                    toNode = this.nodeList[rel.to],
                    fromPoint = getPointAttrByNode(fromNode),
                    toPoint = getPointAttrByNode(toNode)
                
                this.relList.push([
                    {
                        ...fromPoint,
                        id: rel.from,
                    }, {
                        ...toPoint,
                        id: rel.to
                    }])
            }
        },

        // ==========绘制图形部分==========

        draw () {
            // 遍历泳道绘制泳道
            for (let id of this.laneIdList) {
                this.laneLayer.addGraph('node', 'test',this.laneList[id])
            }
        },
    },
    mounted () {
        let vue = this
        this.laneList.push = function (item) {
            vue.laneIdList.push(item.id)
            vue.$set(vue.laneList, item.id, item)
        }

        this.init()
    }   
}
</script>
<style scoped>
#diagram {
    border: 1px solid seagreen;
    position: relative;
}
.container {
    overflow-x: auto;
}
</style>


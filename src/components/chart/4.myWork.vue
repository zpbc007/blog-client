<template>
    <div class="container">
        <div id="diagram"></div>
    </div>
</template>
<script>
import * as d3 from 'd3'
// 用于生成节点id
import uuid from 'uuid/v4'
import * as ChartMath from './chartUtil/Math'
// TODO 用于查找附近节点
import {Rectangle, initTree} from '@util/QuadTree'

window.d3 = d3
const drag = d3.drag
const line = d3.line
const symbol = d3.symbol
const quadTree = initTree(1, 10, new Rectangle(0, 0, 1200, 800))

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
            // html
            html: null,
            // svg画布
            svg: null,
            // 图形操作部分
            chartContainer: null,
            // 模板部分
            modelContainer: null,
            // 连线图层
            lineContainer: null,
            // 泳道数据 id-data
            laneList: {},
            // 排序后的id数据
            laneIdList: [],
            // 流程节点数据 id-data
            nodeList: {},
            // 泳道id-节点数组
            nodeLaneIdList: {},
            // 节点关联数据
            relList: [],
        }
    },
    watch: {
        laneList: {
            deep: true,
            handler () {
                this.drawChart()
            }
        }
    },
    methods: {
        init () {
            this.parseData()
            this.initCanvas()
        },
        // 初始化画布
        initCanvas () {
            this.html = d3.select('#diagram')
            this.svg = d3.select("#diagram")
                .append('svg')
                .attr('width', DefaultValue.svg.width)
                .attr('height', DefaultValue.svg.height)
                .append('g')
                .attr('class', 'main-container')
                .attr('transform', `translate(${DefaultValue.svg.paddingTop}, ${DefaultValue.svg.paddingLeft})`)
            
            this.chartContainer = this.svg
                .append('g')
                .attr('class', 'chart-container')
                .attr('transform', `translate(${DefaultValue.modelContainer.width})`)
            
            this.modelContainer = this.svg
                .append('g')
                .attr('class', 'model-container')
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
            let result = {},
                laneDefault = DefaultValue.lane,
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
                    }
                })
            })
            return result
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
                        }
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
                        id: rel.from
                    }, {
                        ...toPoint,
                        id: rel.to
                    }])
            }
        },
        // ==========绘制图形部分==========
        
        // 根据当前数据绘制整个图形
        drawChart () {
            const lanes = this.drawLane(),
                vue = this
            
            // 遍历泳道绘制每个泳道中的节点
            lanes.forEach((lane, index) => {
                let laneId = lane.group.attr('id')
                // 泳道添加文字
                this.__appendText([this.laneList[laneId].text], `text-${laneId}`)
                // 绘制泳道中的节点
                let nodes = this.drawNodes(this.laneIdList[index], lane.graph.content.group)
                // 遍历节点绘制节点上的文字
                nodes.group.each(function (data, index) {
                    vue.__appendText([data.text], `text-${data.containerId}`)
                })
                // 添加点击事件
                this.__addClickEvent(nodes.group, (data, index, dom) => {
                    console.log(dom.getAttribute('id'))
                })
            })

            this.drawLine()
        },
        // 绘制一个泳道的所有节点
        drawNodes (laneId, laneNode) {
            let nodeData = [],
                laneData = this.laneList
            for (let nodeId of this.nodeLaneIdList[laneId]) {
                nodeData.push(this.nodeList[nodeId])
            }

            return this.__appendRect(nodeData, laneNode, '.process-node')
        },
        // 根据当前数据绘制泳道
        drawLane () {
            return this.__appendLane(this.laneIdList)
        },
        // 绘制连线
        drawLine () {
            return this.__appendLine(this.relList)
        },
        __appendLine (lineNodeList) {
            // 如果没有线图层创建之
            if (!this.lineContainer) {
                this.lineContainer = this.chartContainer
                    .append('g')
                    .attr('class', 'line-container')
            }

            let curveLine = line().x(item => item.x).y(item => item.y),
                symbolLine = symbol().type(d3.symbolTriangle),
                lineGroupUpdate = this.lineContainer.selectAll('.line-group')
                    .data(lineNodeList),
                lineGroupEnter = lineGroupUpdate.enter()
                    .append('g'),
                lineGroupExit = lineGroupUpdate.exit()
            
            lineGroupExit.remove()

            let lineGroup = lineGroupUpdate.merge(lineGroupEnter)
                .attr('class', item => `line-group from-${item[0].id}-to-${item[1].id}`)
            
            let lines = []
            lineGroup.each(function (data, index) {
                // 绘制线
                let pathUpdate = d3.select(this).selectAll('.line')
                        .data([data]),
                    pathEnter = pathUpdate.enter()
                        .append('path')
                        .attr('class', 'line'),
                    pathExit = pathUpdate.exit()
                
                pathExit.remove()
                
                let line = pathUpdate.merge(pathEnter)
                    .attr('d', item => curveLine(item))
                    .attr('stroke', 'blue')
                    .attr('stroke-width', '1.5px')
                    .attr('class', 'zpLine')
                    .attr('fill-opacity', '0')
                lines.push(line)

                // 绘制图形
                let symbolGroupUpdate = d3.select(this).selectAll('.symbol')
                        .data([data]),
                    symbolGroupEnter = symbolGroupUpdate.enter()
                        .append('g')
                        .attr('class', 'symbol'),
                    symbolGroupExit = symbolGroupUpdate.exit()
                
                symbolGroupExit.remove()

                symbolGroupUpdate.merge(symbolGroupEnter)
                    .attr('transform', item => {
                        let midPoint = ChartMath.calMidPoint(item[0], item[1]) 
                        return `translate(${midPoint.x}, ${midPoint.y})`
                    })
                    .append('path')
                    .attr('d', symbolLine())
                    .attr('transform', item => {
                        let slope = ChartMath.calSlope(item[0], item[1])
                            
                        return `rotate(${ChartMath.calAngle(slope)})`
                    })
            })
            return lines
        },
        // 绘制泳道 
        __appendLane (laneList) {
            const vue = this, 
                laneUpdate = this.chartContainer
                    .selectAll('.lane-group')
                    .data(laneList),
                laneEnter = laneUpdate.enter()
                    .append('g')
                    .attr('class', 'lane-group'),
                laneExit = laneUpdate.exit(),
                result = []
            
            laneExit.remove()

            const LaneDefault = DefaultValue.lane
            laneUpdate.merge(laneEnter)
                .attr('id', id => id)
                .each(function (id, index) {
                    const laneData = vue.laneList[id]
                    const titleRect = vue.__appendRect([
                        {
                            ...laneData,
                            height: LaneDefault.titleHeight,
                            class: 'lane-title',
                            containerClass: 'lane-title-container',
                            id: null
                        }
                    ], d3.select(this), '.lane-title-container')
                    
                    const contentRect = vue.__appendRect([
                        {
                            ...laneData,
                            y: LaneDefault.titleHeight,
                            height: laneData.height - LaneDefault.titleHeight,
                            class: 'lane-content',
                            containerClass: 'lane-content-container',
                        }
                    ], d3.select(this), '.lane-content-container')
                    
                    result.push({
                        graph: {
                            title: titleRect,
                            content: contentRect,
                        },
                        group: d3.select(this)
                    })
            })

            return result
        },
        // 绘制矩形
        __appendRect (rectList, parent, selector) {
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
        },
        // 添加文字
        __appendText (textDataList, id) {
            let textUpdate = this.html.selectAll(id)
                    .data(textDataList),
                textEnter = textUpdate.enter()
                    .append('textarea'),
                textExit = textUpdate.exit()
            
            textExit.remove()
            textUpdate.merge(textEnter)
                .text(item => item.value)
                .attr('style', item => {
                    let itemStyle = ` width: ${item.width}px;
                        height: ${item.height}px;
                        left: ${item.x}px;
                        top: ${item.y}px; `
                    let commonStyle = this.__objToCss(DefaultValue.text.css)
                    return itemStyle + commonStyle
                })
                .attr('id', id)
                .attr('class', 'append-text')
        },
        // 对象转css属性
        __objToCss (obj) {
            let result = ''
            for (let attr in obj) {
                result += `${attr}: ${obj[attr]};`
            }
            return result
        },
        // 添加点击事件
        __addClickEvent (nodeList, callback) {
            nodeList.on('click', function (data, index) {
                callback(data, index, this)
            })
        }
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


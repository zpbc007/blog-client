<template>
    <div class="container">
        <div id="diagram"></div>
        <div class="config">
            <Form :model="form">
                <FormItem label="节点名称">
                    <Input v-model="form.name" />
                </FormItem>
                <FormItem label="节点类型">
                    <Select v-model="form.type">
                        <Option 
                            v-for="item in nodeTypeList"
                            :key="item.value"
                            :value="item.value">
                            {{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
            </Form>
            <Button @click="addNode">添加节点</Button>
        </div>
    </div>
</template>
<script>
import * as d3 from 'd3'
// 用于生成节点id
import uuid from 'uuid/v4'
// 用于查找节点附近的节点
import {Rectangle, initTree} from '@util/QuadTree'

const quadTree = initTree(1, 10, new Rectangle(0, 0, 1200, 800))
window.quadTree = quadTree

const drag = d3.drag
const line = d3.line
const symbol = d3.symbol

// 初始节点数据
const initNodeList = [
    {
        // 包含的文字
        text: '中间节点',
        // 类型
        type: 'rect',
        x: 600,
        y: 300,
        width: 100,
        height: 80,
        id: 1
    },
    {
        // 包含的文字
        text: '上',
        // 类型
        type: 'rect',
        x: 600,
        y: 120,
        width: 100,
        height: 80,
        id: 2
    },
    {
        // 包含的文字
        text: '下',
        // 类型
        type: 'rect',
        x: 600,
        y: 480,
        width: 100,
        height: 80,
        id: 3
    },
    {
        // 包含的文字
        text: '左',
        // 类型
        type: 'rect',
        x: 400,
        y: 300,
        width: 100,
        height: 80,
        id: 4
    },
    {
        // 包含的文字
        text: '右',
        // 类型
        type: 'rect',
        x: 800,
        y: 300,
        width: 100,
        height: 80,
        id: 5
    },
    {   
        // 透明点 （带有默认属性的圆）
        type: 'point',
        x: 10,
        y: 10,
        id: 6
    },
    {
         // 透明点 （带有默认属性的圆）
        type: 'point',
        x: 100,
        y: 100,
        id: 7
    }
]
// 初始关联数据
const relList = {
    '1-+-top': ['2-+-bottom'],
    '1-+-right': ['5-+-left'],
    '1-+-bottom': ['3-+-top'],
    '1-+-left': ['4-+-right'],
    '6': ['7']
}

// 节点挂载点
const directions = {
    top: 'top',
    right: 'right',
    bottom: 'bottom',
    left: 'left',
}
// x y 方向
const xyDirections = {
    top: 'y',
    right: 'x',
    bottom: 'y',
    left: 'x',
}
// 透明节点默认属性
const transparentNodeDefaultAttr = {
    'r': 5,
    'fill-opacity': 0,
    'fill': 'black',
    'stroke': 'white',
    'stroke-width': '0'
}
// 矩形上的圆形默认属性
const rectCircleDefaultAttr = {
    'r': 5,
    'fill-opacity': 0.5,
    'fill': 'black',
    'stroke': 'white',
    'stroke-width': '0'
}


export default {
    data () {
        return {
            form: {
                name: '',
                type: ''
            },
            nodeTypeList: [
                {
                    label: '矩形',
                    value: 'rect'
                }
            ],
            flowchart: null,
            // key为图形id 需要保存的节点数据
            nodeList: {},
            // key为图形id-position
            relList: {},
            // 反向连接
            reverseRelList: {},
            // 临时生成的节点
            tempNodeList: {},
            svg: null,
            minLen: 20,
            // 图形id数组
            selectedNodeList: [],
            currentDragItemId: null,
            // 存放的是图形边界上的点
            quadTree: null
        }
    },
    watch: {
        nodeList: {
            handler () {
                this.drawGraph()
                this.drawLines()
            },
            deep: true
        },
        relList () {
            this.drawLines()
        },
        // todo 测试用
        selectedNodeList (newVal) {
            this.svg.selectAll('.zpTestLine')
                .remove()
            let vue = this
            if (newVal.length === 2) {
                let result = this.genLinesCollect(this.nodeList[newVal[0]], this.nodeList[newVal[1]])
                let minXNodes = [{x :result.minX, y: 0}, {x: result.minX, y: 800}],
                    maxXNodes = [{x :result.maxX, y: 0}, {x: result.maxX, y: 800}],
                    minYNodes = [{x: 0, y: result.minY}, {x: 1200, y: result.minY}],
                    maxYNodes = [{x: 0, y: result.maxY}, {x: 1200, y: result.maxY}],
                    midXNodes = [{x :result.midX, y: 0}, {x: result.midX, y: 800}],
                    midYNodes = [{x: 0, y: result.midY}, {x: 1200, y: result.midY}]

                let testLine = line()
                        .x(item => {
                            return item.x
                        })
                        .y(item => {
                            return item.y
                        })
                    
                drawLine(minXNodes, 'minXNodes')
                drawLine(maxXNodes, 'maxXNodes')
                drawLine(minYNodes, 'minYNodes')
                drawLine(maxYNodes, 'maxYNodes')
                drawLine(midXNodes, 'midXNodes')
                drawLine(midYNodes, 'midYNodes')
                
                function drawLine (nodes, className) {
                    vue.svg
                        .append('path')
                        .attr('d', testLine(nodes))
                        .attr('stroke-width', '1.5px')
                        .attr("stroke", "#FAD7A0")
                        .attr('class', `zpTestLine ${className}`)
                }

                console.log(JSON.stringify(result))
            }
        }
    },
    methods: {
        // 初始化 
        init () {
            this.initCanvas()
            this.initData()
            this.quadTree = quadTree
        },
        // 准备画布
        initCanvas () {
            const width = 1200,
                height = 800
            this.svg = d3.select("#diagram")
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('class', 'chart-container')
        },
        // 初始数据绘制到画布上
        initData () {
            for (let node of initNodeList) {
                this.addNodeToNodeList(node)
            }
            // 关联数据
            for (let from in relList) {
                for (let to of relList[from]) {
                    this.addRel(from, to)
                }
            }
        },
        // 添加关系
        addRel (from, to) {
            if (!this.relList[from]) {
                this.$set(this.relList, from, [])
            }
            this.relList[from].push(to)

            if (!this.reverseRelList[to]) {
                this.$set(this.reverseRelList, to, [])
            }
            this.reverseRelList[to].push(from)
        },
        // 删除关系
        delRel (from, to) {
            this.relList[from].splice(this.relList[form].indexOf(from), 1)
            this.reverseRelList[to].splice(this.reverseRelList[to].indexOf(to), 1)
        },
        // 添加节点
        addNode () {
            let node = null
            switch (this.form.type) {
                case 'rect':
                    node = {
                        // 包含的文字
                        text: this.form.name,
                        // 类型
                        type: this.form.type,
                        x: 0,
                        y: 0,
                        width: 100,
                        height: 80
                    }
                    break
                default:
                    throw new Error(`没有此类型的图形: ${this.form.type}`)
            }
            this.addNodeToNodeList(node)

            this.form = {
                name: '',
                type: ''
            }
        },
        // 添加节点到保存节点中
        addNodeToNodeList (node) {
            let nodeId = node.id || this.createId()
            this.$set(this.nodeList, nodeId, {...node, id: nodeId})
            return nodeId
        },
        // 添加节点到临时节点中
        addNodeToTempNodeList (node, parentRectId) {
            let nodeId = null,
                vue = this
            if (node.id) {
                nodeId = node.id
            } else {
                nodeId = this.createId()
                let nodeR = Number.parseFloat(node.r.match(/[0-9]*/)[0])
                // 将节点添加到树中
                this.quadTree.insert(new Rectangle(
                    () => {
                        // 根据rectId找到父级transform
                        let {x} = vue.getNodeData(parentRectId)

                        return node.x - nodeR + x
                    }, 
                    () => {
                        let {y} = vue.getNodeData(parentRectId)

                        return node.y - nodeR + y
                    },
                    2 * nodeR,
                    2 * nodeR,
                    nodeId))
            }
            this.$set(this.tempNodeList, nodeId, {...node, id: nodeId})
            return nodeId
        },
        // 遍历节点 绘图
        drawGraph () {
            let nodeObj = {
                'rect': [],
                'point': []
            }
            // 根据节点类型分批绘制
            for (let nodeId in this.nodeList) {
                const node = this.nodeList[nodeId]
                if (nodeObj[node.type]) {
                    nodeObj[node.type].push(node)
                }
            }
            for (let nodeId in this.tempNodeList) {
                const node = this.tempNodeList[nodeId]
                if (nodeObj[node.type]) {
                    nodeObj[node.type].push(node)
                }
            }

            for (let type in nodeObj) {
                switch(type) {
                    case 'rect':
                        this.drawRect(nodeObj[type])
                        break
                    case 'point':
                        this.drawPoint(nodeObj[type])
                        break
                    default:
                        console.log(`没有绘制的类型: ${type}`)
                }
            }
        },
        drawPoint (nodeDataList) {
            const vue = this
            let pointGroupUpdate = this.svg.selectAll('.pointGroup')
                .data(nodeDataList)
                
            let pointGroupEnter = pointGroupUpdate.enter()
                .append('g')
                .attr('class', 'pointGroup')
            pointGroupUpdate.merge(pointGroupEnter).each(function (data) {
                vue.appendCircle([data], d3.select(this), 'circle')
            })
        },
        /**
         * @description 绘制矩形节点、文字、矩形四周挂载点、添加drap与click事件
         * @argument nodeDataList 矩形节点数组
         */
        drawRect (nodeDataList) {
            const obj = this.appendRect(nodeDataList)
            this.appendText(obj.group)
            const circles = this.addCircle(obj)
            if (circles) {
                circles.forEach(circleGroup => {
                    this.addDragEvent(circleGroup, (item, data) => {
                        // 当前没有拖拽元素
                        if (!this.currentDragItemId) {
                            // 新建元素
                            let nodeId = this.addNodeToNodeList({
                                ...rectCircleDefaultAttr, 
                                type: 'point'
                            })
                            // 找到父级元素 建立关联
                            let rectId = d3.select(item.parentNode).select('rect').attr('id')
                            let position = this.getNodeData(rectId)['_child'][item.id]
                            let relId = this.createRelId(rectId, position)
                            // if (!this.relList[relId]) {
                            //     this.$set(this.relList, relId, [])
                            // }
                            // this.relList[relId].push(`${nodeId}`)
                            this.addRel(relId, nodeId)
                            this.currentDragItemId = nodeId
                        }
                        this.$set(this.getNodeData(this.currentDragItemId), 'x', d3.event.sourceEvent.offsetX)
                        this.$set(this.getNodeData(this.currentDragItemId), 'y', d3.event.sourceEvent.offsetY)
                    }, (item, data) => {
                        let {x, y, r} = this.getNodeData(this.currentDragItemId),
                            nearbyNodes = [],
                            // 相交节点id
                            rectNodeId = null
                        // 查找附近节点
                        this.quadTree.search(1, new Rectangle(x - r, y - r, 2 * r, 2 * r), nearbyNodes)
                        console.log('附近节点', nearbyNodes)
                        // 判断是否相交
                        nearbyNodes.forEach(node => {
                            if (Math.sqrt(Math.pow(node.x -x, 2) + Math.pow(node.y - y, 2)) < 20) {
                                rectNodeId = node.id
                            }
                        })
                        
                        if (rectNodeId) {
                            let from = this.reverseRelList[this.currentDragItemId]
                            // 删除临时连接
                            this.$set(this.relList, this.currentDragItemId, [])
                            // 有相交节点建立连接
                            // this.$set(this.relList, relId, [])

                        } else {
                            // 没有相交节点 添加拖动事件
                            this.addDragEvent(d3.select(`[id='${this.currentDragItemId}']`), (item, data) => {
                                this.$set(this.getNodeData(data.id), 'x', d3.event.sourceEvent.offsetX)
                                this.$set(this.getNodeData(data.id), 'y', d3.event.sourceEvent.offsetY)
                            }, (item, data) => {
                                let {x, y, r} = this.getNodeData(data.id),
                                    nearbyNodes = [],
                                    rectNodeId = null
                                // 查找附近节点
                                this.quadTree.search(1, new Rectangle(x - r, y - r, 2 * r, 2 * r), nearbyNodes)
                                console.log('附近节点', nearbyNodes)
                                // 判断是否相交
                                nearbyNodes.forEach(node => {
                                    if (Math.sqrt(Math.pow(node.x -x, 2) + Math.pow(node.y - y, 2)) < 20) {
                                        rectNodeId = node.id
                                    }
                                })
                                
                                if (rectNodeId) {
                                    debugger
                                    // 删除临时连接
                                    delete this.relList[data.id]
                                    // this.$set(this.relList, data.id, null)
                                    // 删除节点
                                    delete this.tempNodeList[data.id]
                                    this.drawLines()
                                    // this.$set(this.tempNodeList, data.id, null)
                                    // 有相交节点建立连接
                                    // this.$set(this.relList, relId, [])

                                }
                            })
                        }
                        this.currentDragItemId = null
                    })
                })
            }
            this.addDragEvent(obj.group, (item, data) => {
                this.$set(data, 'x', data.x + d3.event.dx)
                this.$set(data, 'y', data.y + d3.event.dy)
                d3.select(item)
                    .attr('transform', `translate(${data.x}, ${data.y})`)
            })
            this.addClickEvent(obj.graph)
        },
        /**
         * @description 将矩形绘制到svg中
         * @argument nodeDataList 矩形节点数组
         * @returns {group: 所有group， rects: 所有矩形}
         * todo 现在只有enter部分 将来应该会有remove/update部分
         */
        appendRect (nodeDataList) {
            const rectGroupUpdate = this.svg.selectAll('.zpRectGroup')
                .data(nodeDataList)
            const rectGroupEnter = rectGroupUpdate
                .enter()
                .append('g')
                .attr('class', 'zpRectGroup')
                .attr('transform', item => `translate(${item.x}, ${item.y})`)
            
            const rects = rectGroupEnter.append('rect')
                .attr('class', 'zpRect')
                .attr('x', item => 0)
                .attr('y', item => 0)
                .attr('width', item => item.width)
                .attr('height', item => item.height)
                .attr('fill-opacity', '0')
                .attr('stroke-width', '1.5px')
                .attr('stroke', 'steelblue')
                .attr('id', item => item.id)

            return {
                group: rectGroupUpdate.merge(rectGroupEnter),
                graph: this.svg.selectAll('.zpRectGroup').selectAll('.zpRect')
            }
        },
        /**
         * @description 为图形添加拖动事件
         * @argument nodeList d3节点数组
         * @argument callback 拖动回调 arg1: 被拖动元素 arg2: 绑定的数据
         */
        addDragEvent (nodeList, dragCallback, endCallback) {
            const vue = this
            nodeList.call(drag()
                .on('drag', function (data) {
                    if (dragCallback) {
                        dragCallback(this, data)
                    } else {
                        let nodeData = vue.getNodeData(data.id)
                        vue.$set(nodeData, 'x', nodeData.x + d3.event.dx)
                        vue.$set(nodeData, 'y', nodeData.y + d3.event.dy)
                        d3.select(this)
                            .attr('transform', `translate(${nodeData.x}, ${nodeData.y})`)
                    }
                })
                .on('end', function (data) {
                    if (endCallback) {
                        endCallback(this, data)
                    }
                })
            )
        },
        // 
        /**
         * @description 为图形添加点击事件
         * @argument nodeList d3节点数组
         * todo callback应传入
         */
        addClickEvent (nodeList) {
            const vue = this
            nodeList.on('click', function (data, index) {
                let idIndex = vue.selectedNodeList.indexOf(data.id)
                if (idIndex !== -1) {
                    // 已经被选中取消选中
                    vue.selectedNodeList.splice(idIndex, 1)
                    d3.select(this)
                        .attr('fill-opacity', '0')
                } else {
                    // 添加选中效果
                    vue.selectedNodeList.push(data.id)
                    d3.select(this)
                        .attr('fill-opacity', '0.5')
                }
            })
        },
        /**
         * @description 向图形添加四周圆形
         * @argument {group: 图形容器, graph: 被添加的图形}
         */
        addCircle (obj) {
            let { group, graph } = obj
            let result = [],
                vue = this
            // 遍历每一个图形
            graph.each((item, index, group) => {
                // 计算四个圆的坐标
                switch (item.type) {
                    case 'rect':
                        let points = [],
                            parentNode = group[0].parentNode,
                            d3ParentNode = d3.select(parentNode)

                        // 计算每个圆形的坐标 如果已经有直接修改
                        let circles = d3ParentNode
                            .selectAll('.circle'),
                            idObj= {}
                        
                        if (circles.nodes().length > 0) {
                            circles.each(item => {
                                idObj[item.position] = item.id
                            })
                        }
                        
                        for (let dir in directions) {
                            let id = this.addNodeToTempNodeList({
                                ...rectCircleDefaultAttr,
                                // g有偏移
                                ...this.calCoordinateByPos({...item, x: 0, y: 0}, dir),
                                r: '5',
                                type: 'point-on-rect',
                                id: idObj[dir] || null
                            }, d3.select(group[0]).attr('id'))
                            points.push({id: id, position: dir})
                        }
                        circles = this.appendCircle(points, d3ParentNode)
                        
                        item['_child'] = {}
                        for (let obj of points) {
                            item['_child'][obj.id] = obj.position
                        }
                        result.push(circles)
                        break
                    default:
                        throw new Error(`不支持的节点类型: ${item.type}`)
                }
            })

            return result
        },
        /**
         * @description 向group中添加圆形
         * @argument points 圆形坐标数组
         * @argument group 容器
         */
        appendCircle (points, group, className) {
            const update = group.selectAll(className || '.circle')
                .data(points)

            const enter = update.enter()
                .append('circle')

            const result = update.merge(enter)
                .attr('class', className || 'circle')
                .attr('cx', item => this.getNodeData(item.id).x)
                .attr('cy', item => this.getNodeData(item.id).y)
                .attr('r', item => this.getNodeData(item.id).r)
                .attr('fill-opacity', item => {
                    const opacity = this.getNodeData(item.id)['fill-opacity']
                    return !opacity && opacity !== 0 ? '1' : opacity
                })
                .attr('fill', item => this.getNodeData(item.id)['fill'] || 'white')
                .attr('stroke', item => this.getNodeData(item.id)['stroke'] || 'blue')
                .attr('stroke-width', item => this.getNodeData(item.id)['stroke-width'] || '1px')
                .attr('id', item => item.id)
            
            return result
        },
        /**
         * @description 向图形添加文字
         * @argument nodeList d3节点数组
         */
        appendText (nodeList) {
            let text = nodeList.selectAll('text')
            // 避免重复添加
            if (text.nodes().length === 0) {
                text = nodeList.append('text')
            }
            text.text(item => this.getNodeData(item.id).text)
                .attr("text-anchor", "middle")
                .attr('x', item => this.getNodeData(item.id).width / 2)
                .attr('y', item => this.getNodeData(item.id).height / 2)
                .attr("fill", "black")
        },
        /**
         * @description 遍历节点关系绘制连线
         */
        drawLines () {
            let lines = []
            for (let key in this.relList) {
                this.relList[key].forEach(item => {
                    lines.push(this.genPointsByRel(key, item))
                })
            }
            this.appendLine(lines)
        },
        // 根据端点坐标绘制直线
        appendLine (linePoints) {
            let curveLine = line().x(item => item.x).y(item => item.y),
                symbolLine = symbol().type(d3.symbolTriangle)

            let lineGroupUpdate = this.svg.selectAll('.zpLineGroup')
                    .data(linePoints),
                lineGroupEnter = lineGroupUpdate.enter()
                    .append('g')
                    .attr('class', 'zpLineGroup'),
                lineRemove = lineGroupUpdate.exit()
            
            lineRemove.remove()
            
            let appendLines = lineGroupEnter.insert('path', 'g')
                    .attr('d', item => {
                        return curveLine(item)
                    })
                    .attr('stroke', 'blue')
                    .attr('stroke-width', '1.5px')
                    .attr('class', 'zpLine')
                    .attr('fill-opacity', '0')
            
            let updateLines = lineGroupUpdate.select('.zpLine')
                    .attr('d', item => {
                        return curveLine(item)
                    })
            
            let appendArrow =  lineGroupEnter.append('path')
                    .attr('d', symbolLine())
                    .attr('stroke', 'blue')
                    .attr('class', 'zpArrow')
                    .attr('stroke-width', '1.5px')
                    .attr('fill', 'black')
                    .attr('transform', item => this.calArrorwTransform(item[item.length - 2], item[item.length - 1]))
            let updateArrow = lineGroupUpdate.select('.zpArrow')
                    .attr('transform', item => this.calArrorwTransform(item[item.length - 2], item[item.length - 1]))
            
        },
        calArrorwTransform (startNode, endNode) {
            let x = null,
                y = null,
                rotate = null,
                len = 10
            // 点方向通过计算得到
            if (!endNode.position) {
                if (endNode.x < startNode.x) {
                    endNode.position = directions.right
                } else if (endNode.x > startNode.x) {
                    endNode.position = directions.left
                } else {
                    if (endNode.y < startNode.y) {
                        endNode.position = directions.bottom
                    } else if (endNode.y > startNode.y) {
                        endNode.position = directions.top
                    }
                }
            }
            switch (endNode.position) {
                case directions.top:
                    x = endNode.x
                    y = endNode.y - len
                    rotate = 180
                    break
                case directions.bottom:
                    x = endNode.x
                    y = endNode.y + len
                    rotate = 0
                    break
                case directions.left:
                    x = endNode.x - len
                    y = endNode.y
                    rotate = -30
                    break
                case directions.right:
                    x = endNode.x + len
                    y = endNode.y
                    rotate = 30
                    break
                default:
                    x = endNode.x + len
                    y = endNode.y
                    rotate = 30
                    break
            }
            return `translate(${x}, ${y}) rotate(${rotate})`
        },
        // 根据rel获取节点数据
        getNodesByRel (relString) {
            let nodeObj = this.parseIdString(relString)
            return this.nodeList[nodeObj.id]
        },
        /**
         * @description 根据关联关系模板生成坐标
         * @argument start 起点模板 `${id}-${位置}`
         * @argument end 起点模板 `${id}-${位置}`
         */
        genPointsByRel (start, end) {
            // 解析字符串
            let startObj = this.parseIdString(start),
                endObj = this.parseIdString(end)
            
            // 获取对应节点
            let startNode = this.nodeList[startObj.id],
                endNode = this.nodeList[endObj.id]
            
            // 根据位置计算坐标
            return this.genPathPoints(
                        {
                            ...this.calCoordinateByPos(startNode, startObj.position), 
                            position: startObj.position
                        }, 
                        {
                            ...this.calCoordinateByPos(endNode, endObj.position), 
                            position: endObj.position
                        },
                        startNode, 
                        endNode)
        },
        // 解析id-position
        parseIdString (string) {
            let temp = string.split('-+-')
            return {
                id: temp[0],
                position: temp[1] || null
            }
        },
        /**
         * @description 根据位置计算坐标
         * @argument nodeData 节点数据
         * @argument position 方位
         */
        calCoordinateByPos (nodeData, position) {
            switch (nodeData.type) {
                case 'rect':
                    let x = null,
                        y = null

                    switch (position) {
                        case directions.top:
                            x = nodeData.x + nodeData.width / 2
                            y = nodeData.y
                            break
                        case directions.bottom:
                            x = nodeData.x + nodeData.width / 2
                            y = nodeData.y + nodeData.height
                            break
                        case directions.left:
                            x = nodeData.x
                            y = nodeData.y + nodeData.height / 2
                            break
                        case directions.right:
                            x = nodeData.x + nodeData.width
                            y = nodeData.y + nodeData.height / 2
                            break
                        default:
                            throw new Error(`不支持的方向类型: ${position}`)
                    }

                    return {x, y}
                    break
                case 'point':
                    return {
                        x: nodeData.x,
                        y: nodeData.y
                    }
                default:
                    throw new Error(`不支持的节点类型: ${nodeData.type}`)
            }
        },
        // 根据起始点，终点，以及起始方向生成连线中的节点坐标
        genPathPoints (startPoint, endPoint, startEl, endEl) {
            let linesCollect = this.genLinesCollect(startEl, endEl)
            let midNode = null
            if (linesCollect.midX && linesCollect.midY) {
                midNode = {
                    x: linesCollect.midX,
                    y: linesCollect.midY
                }
            } else {
                const point = startPoint.type === 'point' ? startPoint : endPoint
                midNode = {
                    x: point.x,
                    y: point.y
                }
            }
            
            // 给节点赋初始方向
            this.setDirection(startPoint, endPoint)
            let startPoints = [],
                endPoints = []
            let sameLine = this.isSameLine(startPoint, endPoint),
                haveInter = this.calIntersectionByTwoPoints(startPoint, endPoint)
            // 递归 直到有交点或在同一条线上
            while (!sameLine && !haveInter) {
                if (!this.objInArr(startPoint, startPoints)) {
                    startPoints.push(startPoint)
                }
                if (!this.objInArr(endPoint, endPoints)) {
                    endPoints.unshift(endPoint)
                }

                startPoint = this.calIntersection(startPoint, midNode, linesCollect)
                endPoint = this.calIntersection(endPoint, midNode, linesCollect)

                sameLine = this.isSameLine(startPoint, endPoint)
                haveInter = this.calIntersectionByTwoPoints(startPoint, endPoint)
            }
            if (haveInter) {
                points.push(haveInter)
            } 
            if (!this.objInArr(startPoint, startPoints)) {
                startPoints.push(startPoint)
            }
            if (!this.objInArr(endPoint, endPoints)) {
                endPoints.unshift(endPoint)
            }
            return startPoints.concat(endPoints)
        },
        // 根据两个元素生成包围的线及坐标线的集合
        genLinesCollect (startEl, endEl) {
            let linesCollect = null

            if (startEl.type === 'point' && endEl.type === 'point') {
                // 两个点的连线
                linesCollect = this.genLinesCollectByTwoPoints(startEl, endEl)
            } else if (startEl.type === 'point' || endEl.type === 'point') {
                // 一个点与一个图形的连线
                linesCollect = this.genLinesCollectByPointAndNode(startEl, endEl)
            } else {
                // 两个图形的连线
                linesCollect = this.genLinesCollectByTwoNodes(startEl, endEl)
            }

            return  {
                ...linesCollect, 
                x: [linesCollect.minX, linesCollect.midX, linesCollect.maxX], 
                y: [linesCollect.minY, linesCollect.midY, linesCollect.maxY]
            }
        },
        // 通过两个点生成包围线
        genLinesCollectByTwoPoints (startPoint, endPoint) {
            let linesCollect = {}

            if (startPoint.x < endPoint.x) {
                linesCollect.minX = startPoint.x
                linesCollect.maxX = endPoint.x
            } else {
                linesCollect.minX = endPoint.x
                linesCollect.maxX = startPoint.x
            }

            if (startPoint.y < endPoint.y) {
                linesCollect.minY = startPoint.y
                linesCollect.maxY = endPoint.y
            } else {
                linesCollect.minY = endPoint.y
                linesCollect.maxY = startPoint.y
            }

            linesCollect.midX = Math.abs((endPoint.x - startPoint.x) / 2) + linesCollect.minX
            linesCollect.midY = Math.abs((endPoint.y - startPoint.y) / 2) + linesCollect.minY

            return linesCollect
        },
        // 通过一个节点一个图形生成包围线 不需要中点的线 向点移动
        genLinesCollectByPointAndNode (startEl, endEl) {
            let linesCollect = {},
                pointObj = null,
                nodeObj = null

            if (startEl.type === 'point') {
                pointObj = startEl
                nodeObj = endEl
            } else {
                pointObj = endEl
                nodeObj = startEl
            }

            if (pointObj.x < nodeObj.x) {
                linesCollect.minX = pointObj.x
                linesCollect.maxX = nodeObj.x + nodeObj.width + this.minLen
            } else {
                linesCollect.minX = nodeObj.x - this.minLen
                let rectMaxX = nodeObj.x + nodeObj.width
                if (pointObj.x > rectMaxX) {
                    linesCollect.maxX = pointObj.x
                } else {
                    linesCollect.maxX = rectMaxX + this.minLen
                }
            }

            if (pointObj.y < nodeObj.y) {
                linesCollect.minY = pointObj.y
                linesCollect.maxY = nodeObj.y + nodeObj.height + this.minLen
            } else {
                linesCollect.minY = nodeObj.y - this.minLen
                let rectMaxY = nodeObj.y + nodeObj.height
                if (pointObj.y > rectMaxY) {
                    linesCollect.maxY = pointObj.y
                } else {
                    linesCollect.maxY = rectMaxY + this.minLen
                }
            }

            // 点在矩形内部
            if (pointObj.x > nodeObj.x && pointObj.x < nodeObj.x + nodeObj.width) {
                linesCollect.midX = pointObj.x
            }
            if (pointObj.y > nodeObj.y && pointObj.y < nodeObj.y + nodeObj.height) {
                linesCollect.midY = pointObj.y
            }

            return linesCollect
        },
        // 通过两个图形生成包围线
        genLinesCollectByTwoNodes (startEl, endEl) {
            let linesCollect = {},
                minWidth = null,
                minHeight = null

            // y方向的最小边
            if (startEl.y < endEl.y) {
                linesCollect.minY = startEl.y
                minHeight = startEl.height
            } else {
                linesCollect.minY = endEl.y
                minHeight = endEl.height
            }

            // y方向的最大边
            if (startEl.y + startEl.height > endEl.y + endEl.height) {
                linesCollect.maxY = startEl.y + startEl.height
            } else {
                linesCollect.maxY = endEl.y + endEl.height
            }

            // x方向的最小边
            if (startEl.x < endEl.x) {
                linesCollect.minX = startEl.x
                minWidth = startEl.width
            } else {
                linesCollect.minX = endEl.x
                minWidth = endEl.width
            }

            // x方向的最大边
            if (startEl.x + startEl.width > endEl.x + endEl.width) {
                linesCollect.maxX = startEl.x + startEl.width
            } else {
                linesCollect.maxX = endEl.x + endEl.width
            }

            linesCollect.midX = Math.abs(((endEl.x + endEl.width / 2) - (startEl.x + startEl.width / 2)) / 2) + linesCollect.minX + minWidth / 2
            linesCollect.midY = Math.abs(((endEl.y + endEl.height /2) - (startEl.y + startEl.height / 2)) / 2) + linesCollect.minY + minHeight / 2

            linesCollect.minX = linesCollect.minX - this.minLen
            linesCollect.maxX = linesCollect.maxX + this.minLen
            linesCollect.minY = linesCollect.minY - this.minLen
            linesCollect.maxY = linesCollect.maxY + this.minLen
            return  linesCollect
        },
        // 给定点坐标及点的初始方向与线的集合以及中点(控制转向)，计算与集合的交点
        calIntersection (node, midNode, linesCollect) {
            // 自己为中心不需移动
            if (node.x === midNode.x && node.y === midNode.y) {
                return node
            }
            // 当前节点的方向
            let nodeDirection = xyDirections[node.position],
               // 垂直于节点的方向
                hDirection = nodeDirection === 'x' ? 'y' : 'x'
            // 在集合中取垂直的
            let currentCollect = linesCollect[nodeDirection]
            // 只要在线上的集合
            let onlineCollect = currentCollect.filter(item => {
                if (typeof item !== 'undefined') {
                    return this.isNodeInLine({[hDirection]: node[hDirection], [nodeDirection]: item}, node)
                } else {
                    return false
                }
            })

            let minCollect = null,
                position = null

            // 取最近的点
            switch (node.position) {
                case directions.top:
                    minCollect = this.maxValInArr(onlineCollect)
                    position = node.x < midNode.x ? directions.right : directions.left
                    break
                case directions.bottom:
                    minCollect = this.minValInArr(onlineCollect)
                    position = node.x < midNode.x ? directions.right : directions.left
                    break
                case directions.left:
                    minCollect = this.maxValInArr(onlineCollect)
                    position = node.y > midNode.y ? directions.top : directions.bottom
                    break
                case directions.right:
                    minCollect = this.minValInArr(onlineCollect)
                    position = node.y > midNode.y ? directions.top : directions.bottom
                    break
            }
            return {
                    [hDirection]: node[hDirection],
                    [nodeDirection]: minCollect,
                    position
                }
        },
        // 两个点是否同线 不判断方向
        isSameLine (node1, node2) {
            return node1.x === node2.x || node1.y === node2.y
        },
        // 点是否在线上 判断方向
        isNodeInLine (node, line) {
            // 不在一条线上
            if (node.x !== line.x && node.y !== line.y) {
                return false
            }
            if (!line.position) {
                return true
            }
            switch (line.position) {
                case directions.left:
                    return node.x < line.x
                case directions.right:
                    return node.x > line.x
                case directions.top:
                    return node.y < line.y
                case directions.bottom:
                    return node.y > line.y
                default:
                    throw new Error(`不支持的方向类型 ${line.position}`) 
            }
        },
        // 两个点的交点
        calIntersectionByTwoPoints (node1, node2) {
            // 平行无交点
            if (xyDirections[node1.position] === xyDirections[node2.position]) {
                return null
            }

            let xNode = null,
                yNode = null
            if (xyDirections[node1.position] === 'x') {
                xNode = node1
                yNode = node2
            } else {
                xNode = node2
                yNode = node1
            }
            
            // 交点
            let intersection = {
                x: xNode.x,
                y: yNode.y
            }

            if (this.isNodeInLine(intersection, xNode) && this.isNodeInLine(intersection, yNode)) {
                // 有交点
                return intersection
            } else {
                // 交点不在线上(反向)
                return null
            }
        },
        minValInArr (arr) {
            return Math.min.apply({}, arr)
        },
        maxValInArr (arr) {
            return Math.max.apply({}, arr)
        },
        setDirection (startNode, endNode) {
            if (startNode.position) {
                return 
            }

            if (startNode.x < endNode.x) {
                startNode.position = directions.right
                endNode.position = directions.left
            } else {
                startNode.position = directions.left
                endNode.position = directions.right
            }
        },
        getNodeData (nodeId) {
            return this.nodeList[nodeId] ? this.nodeList[nodeId] : this.tempNodeList[nodeId]   
        },
        createId () {
            return uuid()
        },
        createRelId (id, position) {
            return `${id}-+-${position}`
        },
        objInArr (obj, arr) {
            let keys = Object.keys(obj)
            for (let item of arr) {
                let result = true
                for (let key of keys) {
                    if (obj[key] !== item[key]) {
                        result = false
                        break
                    }
                }
                if (result) {
                    return true
                }
            }
            return false
        },
        // todo 测试
        drawTreeLine () {
            let rects = []
            this.quadTree.traverse(item => {
                rects.push(item.rect)
            })
            this.appendTreeRect(rects)
        },
        // 测试
        appendTreeRect (rectData) {

            const rectUpdate = this.svg.selectAll('.tree-rect').data(rectData),
                rectEnter = rectUpdate.enter()
                
            rectUpdate.exit().remove()
            rectEnter.append('rect').merge(rectUpdate)
                .attr('width', item => item.width)
                .attr('height', item => item.height)
                .attr('x', item => item.x)
                .attr('y', item => item.y)
                .attr('stroke-width', '1.5px')
                .attr('stroke', 'green')
                .attr('fill-opacity', item => item['fill-opacity'] || '0')
                .attr('class', 'tree-rect')
        }
    },
    mounted () {
        this.init()
    }
}
</script>
<style scoped>
#diagram {
    border: 1px solid seagreen;
    width: 1200px;
    height: 800px;
}
.container {
    overflow-x: auto;
}
</style>

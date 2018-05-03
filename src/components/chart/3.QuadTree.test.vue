<template>
    <div>
        <div id="chart"></div>
    </div>
</template>
<script>
import * as d3 from 'd3'
import uuid from 'uuid/v4'
// 用于查找节点附近的节点
import {Rectangle, initTree} from '@util/QuadTree'


const drag = d3.drag
const line = d3.line
const quadTree = initTree(1, 10, new Rectangle(0, 0, 800, 800))
window.quadTree = quadTree
window.d3 = d3

const pointList = [
    {
        x: 500,
        y: 200,
        r: 20
    },
    {
        x: 350,
        y: 50,
        r: 10
    },
    {
        x: 250,
        y: 20,
        r: 10
    },
    {
        x: 250,
        y: 150,
        r: 10
    },
    {
        x: 350,
        y: 150,
        r: 10
    },
    {
        x: 150,
        y: 100,
        r: 10
    }, 
    {
        x: 150,
        y: 250,
        r: 10
    },
    {
        x: 200, 
        y: 450,
        r: 40
    },
    {
        x: 380,
        y: 380,
        r: 40
    },
    {
        x: 300,
        y: 100,
        r: 20
    },

    {
        x: 210,
        y: 10,
        r: 5
    },
    {
        x: 260,
        y: 10,
        r: 5
    },
    {
        x: 210,
        y: 60,
        r: 5
    }
]

export default {
    data () {
        return {
            quadTree: null,
            svg: null,
            chartContainer: null,
            modelContainer: null,
            nodeList: [],
            moveNode: {
                x: 15,
                y: 15,
                r: 15
            },
            idList: [],
            tempModel: null
        }
    },
    watch: {
        moveNode: {
            handler () {
                this.drawMovePoint()
            },
            deep: true
        },
        nodeList () {
            this.drawLine()
        },
        idList () {
            this.drawPoints()
        }
    },
    methods: {
        initCanvas () {
            const width = 800,
                height = 1200
            this.svg = d3.select("#chart")
                .append('svg')
                .attr('width', width)
                .attr('height', height)
            
            this.chartContainer = this.svg
                .append('g')
                .attr('class', 'chart-container')
            
            this.modelContainer = this.svg
                .append('g')
                .attr('class', 'model-container')
                .attr('transform', `translate(${0}, ${800})`)
        },
        drawMovePoint () {
            this.chartContainer.select('.move-point').remove()
            const movePoint = this.appendCircle([this.moveNode], '#5DADE2', 'move-point')
            this.appendDragEvent(movePoint)
        },
        drawPoints () {
            const rects = this.appendCircle(this.nodeList, 'black', 'static-point')
            this.addDblclick(rects)
        },
        appendCircle (points, color, className, container) {
            if (!container) {
                container = this.chartContainer
            }
            container.selectAll(`.${className}`).remove()

            const update = container.selectAll(`.${className}`)
                .data(points)

            const enter = update.enter()
                .append('circle')

            const result = update.merge(enter)
                .attr('class', className)
                .attr('cx', item => item.x)
                .attr('cy', item => item.y)
                .attr('r', item => item.r)
                .attr('fill-opacity', 1)
                .attr('fill', item => {
                    if (this.idList.includes(item.id)) {
                        return 'red'
                    } else {
                        return color
                    }
                })
                .attr('stroke', 'blue')
                .attr('stroke-width', '1px')
            
            return result
        },
        appendDragEvent (nodeList, dragFunction, endFunction) {
            const vue = this
            nodeList.call(drag()
                .on('drag', function (data) {
                    if (dragFunction) {
                        dragFunction()
                        return 
                    }
                    vue.$set(data, 'x', d3.event.sourceEvent.offsetX)
                    vue.$set(data, 'y', d3.event.sourceEvent.offsetY)
                })
                .on('end', function (data) {
                    if (endFunction) {
                        endFunction ()
                        return 
                    }
                    var result = []
                    vue.idList = []
                    quadTree.search(1, new Rectangle(data.x - data.r, data.y - data.r, 2 * data.r, 2 * data.r), result)
                    for (let rect of result) {
                        vue.idList.push(rect.id)
                    }
                })
            )
        },
        addDblclick (nodelist) {
            const vue = this
            nodelist.on('dblclick', function (data) {
                vue.nodeList = vue.nodeList.filter(node => node.id !== data.id)
                d3.select(this).remove()
                quadTree.remove(new Rectangle(data.x - data.r, data.y - data.r, data.r * 2, data.r * 2, data.id))
            })
        },
        putNode (node) {
            quadTree.insert(new Rectangle(() => {return node.x - node.r}, () => {return node.y - node.r}, () => {return 2 * node.r}, () => {return 2 * node.r}, () => {return node.id}))
            this.drawLine()
            this.drawMovePoint()
        },
        drawLine () {
            let rects = []
            this.quadTree.traverse(item => {
                rects.push(item.rect)
            })
            this.appendRect(rects)
            this.drawPoints()
            this.drawMovePoint()
        },
        appendRect (rectData) {
            const rectUpdate = this.chartContainer.selectAll('rect').data(rectData),
                rectEnter = rectUpdate.enter()
                
            rectUpdate.exit().remove()
            
            rectEnter.append('rect').merge(rectUpdate)
                .attr('width', item => item.width)
                .attr('height', item => item.height)
                .attr('x', item => item.x)
                .attr('y', item => item.y)
                .attr('stroke-width', '1.5px')
                .attr('stroke', 'steelblue')
                .attr('fill-opacity', item => item['fill-opacity'] || '0')
        },
        addIdToNode () {
            for (let node of this.nodeList) {
                this.$set(node, 'id', uuid())
            }
        },
        addModel () {
            const model = this.appendCircle([{x: 20, y: 20, r: 20}], 'greenyellow', 'model', this.modelContainer)
            this.appendDragEvent(model, () => {
                if (!this.tempModel) {
                    this.tempModel = this.appendCircle([{x: d3.event.sourceEvent.offsetX, y: d3.event.sourceEvent.offsetX, r: 10}], 'black', `append-circle-${uuid()}`, this.chartContainer)
                    this.addDblclick(this.tempModel)
                }
                this.tempModel
                    .attr('cx', d3.event.sourceEvent.offsetX)
                    .attr('cy', d3.event.sourceEvent.offsetY)
            }, () => {
                this.nodeList.push({
                    x: this.tempModel.attr('cx'),
                    y: this.tempModel.attr('cy'),
                    r: this.tempModel.attr('r'),
                    id: uuid()
                })
                this.tempModel.remove()
                this.tempModel = null
                this.putNode(this.nodeList[this.nodeList.length - 1])
            })
        }
    },
    mounted () {
        this.quadTree = quadTree
        this.nodeList = pointList
        this.addIdToNode()
        this.initCanvas()
        this.drawPoints()
        
        for (let node of this.nodeList) {
            this.putNode(node)
        }
        this.drawMovePoint()
        this.addModel()
    }
}
</script>
<style scoped>
#chart {
    width: 800px;
    height: 800px;
    border: 1px solid greenyellow;
}
</style>



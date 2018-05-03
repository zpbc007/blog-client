import uuid from 'uuid/v4'
import * as d3 from 'd3'
import { Layer } from './Layer'

const SvgPrefix = 'flowchart'
const ModelPrefix = 'model'
const ChartPrefix = 'chart'
const SvgDefaultValue = {
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 20,
    width: 1200,
    height: 800
}
const ModelContainerDefaultValue = {
    width: 200
}
const ChartContainerDefaultValue = {
    width: 1000
}

/**
 * 流程图
 */
class FlowChart {
    /**
     * @param {*} containerSelector 容器选择器
     */
    constructor (containerSelector, ChartConfig) {
        // 补充缺失config
        if (ChartConfig) {
            if (!ChartConfig.svg) {
                ChartConfig.svg = {}
            }
            if (!ChartConfig.model) {
                ChartConfig.model = {}
            }
            if (!ChartConfig.chart) {
                ChartConfig.chart = {}
            }
        } else {
            ChartConfig = {
                svg: {},
                model: {},
                chart: {}
            }
        }

        // 合并config
        this.config = {
            svg: {...SvgDefaultValue, ...ChartConfig.svg},
            model: {...ModelContainerDefaultValue, ...ChartConfig.model},
            chart: {...ChartContainerDefaultValue, ...ChartConfig.chart}
        }

        // 添加svg元素
        let svgConfig = this.config.svg,
            svg = d3.select(containerSelector)
                .append('svg')
                .attr('class', `${SvgPrefix}`)
                .attr('width', svgConfig.width)
                .attr('height', svgConfig.height)
                .attr('transform', `translate(${svgConfig.marginLeft}, ${svgConfig.marginTop})`)
        
        this.d3ModelContainer = svg.append('g')
            .attr('class', `${ModelPrefix}`)
        this.modelContainer = this.d3ModelContainer.node()

        this.d3ChartContainer = svg.append('g')
            .attr('class', `${ChartPrefix}`)
            .attr('transform', `translate(${this.config.model.width}, ${0})`)
        this.chartContainer = this.d3ChartContainer.node()
        this.layerList = []
        this._id = uuid()
    }

    // 创建图层
    appendLayer (name) {
        let layer = new Layer(this.modelContainer, name)
        this.layerList.push(layer._id) 

        return layer   
    }
}

export {
    FlowChart
}
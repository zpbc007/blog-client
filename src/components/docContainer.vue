<template>
    <div>
        <div class="markdown-style doc-container" v-html="innerHtml">
    </div>
    </div>
</template>
<script>
import flowchart from 'flowchart.js'
import axios from 'axios'
import '../../static/css/code.css'
import '../../static/css/markdown.css'

export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data () {
        return {
             innerHtml: '暂无数据'
        }
    },
    watch: {
        // 如果有流程图 利用flowchart进行转换
        innerHtml () {
            this.$nextTick(() => {
                let flowCode = document.querySelectorAll('.language-flow')
                if (flowCode) {
                    for (let i = 0, len = flowCode.length; i < len; i++) {
                        const item = flowCode[i];
                        item.setAttribute('id', `flow-chart-${i}`)
                        let flowChartIns = flowchart.parse(item.innerText)
                        item.innerText = ''
                        flowChartIns.drawSVG(`flow-chart-${i}`)
                    }
                }
            })
        }
    },
    methods: {
        getDoc () {
            axios.get(`/api/view/${this.id}`)
                .then(res => {
                    this.innerHtml = res.data
                })
        }
    },
    mounted () {
        this.getDoc()
    }
}
</script>
<style>
.doc-container {
    overflow-x: auto;
}
</style>

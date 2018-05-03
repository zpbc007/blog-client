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
import flowchart from 'flowchart.js'

let id = 0

export default {
    data () {
        return {
            form: {
                name: '',
                type: ''
            },
            nodeTypeList: [
                {
                    label: '开始节点',
                    value: 'start'
                },
                {
                    label: '结束节点',
                    value: 'end'
                },
                {
                    label: '正常操作节点',
                    value: 'operation'
                },
                {
                    label: '子程序',
                    value: 'subroutine'
                },
                {
                    label: '判断',
                    value: 'condition'
                },
                {
                    label: '输入输出节点',
                    value: 'inputoutput'
                }
            ],
            flowchart: null,
            nodeList: [],
            relation: ''
        }
    },
    watch: {
        nodeList () {
            this.draw()
        },
        relation () {
            this.draw()
        }
    },
    methods: {
        addNode () {
            this.nodeList.push({
                id: id++,
                text: this.form.name,
                type: this.form.type
            })

            this.form = {
                name: '',
                type: ''
            }
        },
        draw () {
            document.getElementById("diagram").innerHTML = ''
            let chartString = this.convertNodeListToString()
            console.log(`node: ${chartString}`)
            this.flowchart = flowchart.parse(chartString + this.relation)
            this.flowchart.drawSVG('diagram')
        },
        convertNodeListToString () {
            let result = ''
            for (let node of this.nodeList) {
                result += `${node.id}=>${node.type}: ${node.text}\n`
            }
            return result
        }
    },
    mounted () {
        window.relationTest = this
         this.flowchart = flowchart.parse('st=>start: Start:>http://www.google.com[blank]\n' +
                                'e=>end:>http://www.google.com\n' +
                                'op1=>operation: My Operation\n' +
                                'op2=>operation: Stuff|current\n' +
                                'sub1=>subroutine: My Subroutine\n' +
                                'cond=>condition: Yes \n' + // use cond(align-next=no) to disable vertical align of symbols below
                                'or No?\n:>http://www.google.com\n' +
                                'c2=>condition: Good idea|rejected\n' +
                                'io=>inputoutput: catch something...|request\n' +
                                '\n' +
                                'st->op1(right)->cond\n' +
                                'cond(yes, right)->c2\n' + // conditions can also be redirected like cond(yes, bottom) or cond(yes, right)
                                'cond(no)->sub1(left)->op1\n' + // the other symbols too...
                                'c2(true)->io->e\n' +
                                'c2(false)->op2->e'  //allow for true and false in conditionals
                                );
            this.flowchart.drawSVG('diagram', {
                                'x': 0,
                                'y': 0,
                                'line-width': 3,
                                'line-length': 50,
                                'text-margin': 10,
                                'font-size': 14,
                                'font-color': 'black',
                                'line-color': 'black',
                                'element-color': 'black',
                                'fill': 'white',
                                'yes-text': 'yes',
                                'no-text': 'no',
                                'arrow-end': 'block',
                                'scale': 1,
                                // style symbol types
                                'symbols': {
                                    'start': {
                                      'font-color': 'red',
                                      'element-color': 'green',
                                      'fill': 'yellow'
                                    },
                                    'end':{
                                        'class': 'end-element'
                                    }
                                },
                                // even flowstate support ;-)
                                'flowstate' : {
                                    // 'past' : { 'fill' : '#CCCCCC', 'font-size' : 12},
                                    // 'current' : {'fill' : 'yellow', 'font-color' : 'red', 'font-weight' : 'bold'},
                                    // 'future' : { 'fill' : '#FFFF99'},
                                    'request' : { 'fill' : 'blue'}//,
                                    // 'invalid': {'fill' : '#444444'},
                                    // 'approved' : { 'fill' : '#58C4A3', 'font-size' : 12, 'yes-text' : 'APPROVED', 'no-text' : 'n/a' },
                                    // 'rejected' : { 'fill' : '#C45879', 'font-size' : 12, 'yes-text' : 'n/a', 'no-text' : 'REJECTED' }
                                  }
                              });
    }
}
</script>


import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

// 列表组件
const docList = resolve => require(['../components/docList/doc-list.vue'], resolve)
// markdown容器
const docContainer = resolve => require(['../components/docContainer.vue'], resolve)
// 编辑页面
const editPage = resolve => require(['../components/editPage.vue'], resolve)

// 流程图测试
const flowchart = resolve => require(['../components/chart/1.flowchart.text.vue'], resolve)
const flowchart3 = resolve => require(['../components/chart/2.d3.test.vue'], resolve)
// const flowchart4 = resolve => require(['../components/chart/4.myWork.vue'], resolve)
// const flowchart5 = resolve => require(['../components/chart/5.classChart.vue'], resolve)
// 重构
const flowchart6 = resolve => require(['../components/chart/6.compChartText.vue'], resolve)

// 四叉树测试
const QuadTree = resolve => require(['../components/chart/3.QuadTree.test.vue'], resolve)

const router = new VueRouter({
    base: '/',
    routes: [
        // 首页
        {
            path: '/',
            name: 'mainPage',
            component: docList,
            meta: {
                title: '主页'
            }
        },
        // 查看页
        {
            path: '/view/:title/:id',
            name: 'viewPage',
            component: docContainer,
            props: true
        },
        // 编辑页
        {
            path: '/config',
            name: 'editPage',
            component: editPage
        },
        // 流程图
        {
            path: '/chart',
            name: 'flowchart',
            component: flowchart
        },
        // 流程图 d3
        {
            path: '/chart3',
            name: 'flowchart3',
            component: flowchart3
        },
        {
            path: '/chart6',
            name: 'flowchart6',
            component: QuadTree
        }
    ]
})

router.beforeEach((to, from, next) => {
    let title = ''
    if (to.meta.title) {
        title = to.meta.title
    }
    if (to.params.title) {
        title = to.params.title
    }
    document.title = title
    next()
})

export default router
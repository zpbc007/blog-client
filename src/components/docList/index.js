import Vue from 'vue'

const docList = resolve => {
    require(['./doc-list.vue'], resolve)
}
const docItem = resolve => {
    require(['./doc-item.vue'], resolve)
}

Vue.component('docList', docList)
Vue.component('docItem', docItem)


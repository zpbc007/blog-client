// The Vue build version to load with the `import` command
import root from './components/root.vue'
// import './assets/css/base.css'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import Vue from 'vue'
import './components'
import router from './router/index'
// import store from './vuex/store'

Vue.use(iView)
const app = new Vue({
    el: '#app',
    router,
    // store,
    data: function () {
        return { username: 'demo用户' }
    },
    components: { 
        'root': root
    }
}).$mount('#app')

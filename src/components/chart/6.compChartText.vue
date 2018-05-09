<template>
    <div>
        <div class="chart-container" ref="flow-chart"></div>
    </div>
</template>

<script>
import { init,
    getInstance,
    destroy } from './flowChart/index'
export default {
    data () {
        return {

        }
    },
    mounted () {
        let chart1 = init('el')
        let chart2 = init('el')

        window.chart1 = chart1
        window.chart2 = chart2
        window.getInstance = getInstance
        window.destroy = destroy
    }
}
</script>

<style scoped>

</style>



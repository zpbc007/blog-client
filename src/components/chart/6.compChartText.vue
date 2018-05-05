<template>
    <div>

    </div>
</template>

<script>
import { SVG } from './flowChart/index'
export default {
    data () {
        return {

        }
    },
    mounted () {
        const svg = new SVG(document.body, '', '')
        window.svg = svg
        svg.beforDestory(() => {
            console.log('要被删除了')
        })
        svg.destoryed(() => {
            console.log('已经删除了')
        })
        svg.destroy()
    }
}
</script>

<style scoped>

</style>



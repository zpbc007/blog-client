<template>
    <div class="container">
        <doc-item 
            class="item"
            v-for="item in docList" 
            :key="item.id"
            :title="item.title"
            :content="item.content"
            :docPic="item.docPic"
            :date="item.date"
            @click.native="itemClick(item.id, item.title)"
        ></doc-item>
    </div>
</template>
<script>
import axios from 'axios'

const fetchUrl = {
    docList: '/api/overview/docList',
}

export default {
    data () {
        return {
            // 文章列表数据
            docList: []
        }
    },
    mounted () {
        this.getDoc()
    },
    methods: {
        getDoc () {
            axios.get(fetchUrl.docList)
                .then(res => {
                    this.docList = res.data
                })
                .catch(error => {
                    this.$Message.error('获取数据失败')
                })
        },
        itemClick (id, title) {
            this.$router.push({
                name: 'viewPage',
                params: {id, title}
            })
        }
    }
}
</script>
<style scoped>
.item {
    margin-bottom: 20px;
}
</style>


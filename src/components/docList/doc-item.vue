<template>
    <div class="container">
        <Card>
            <div slot="title">
                <h2 class="item-title">
                    {{ title }}
                </h2>
                <span 
                    class="item-date"
                    v-if="showDate"> 
                    <Icon type="calendar"></Icon>
                    {{ date }}
                </span>
            </div>
            <p v-if="showPic">
                <img
                    class="doc-pic"
                    :src="`../../../static/img/${docPic}`"
                />
            </p>
            <p>
                {{ content }}
            </p>
        </Card>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        },
        // 显示的文章图片，从static/img取
        docPic: {
            type: String,
            default: ''
        },
        date: {
            type: String,
            default: ''
        }
    },
    computed: {
        showPic () {
            return this.docPic && this.docPic !== ''
        },
        showDate () {
            return this.date && this.date !== ''
        }
    }
}
</script>
<style scoped>
.container {
    cursor: pointer;
}
.doc-pic {
    max-width: 100%;
    max-height: 200px;
}
.item-title {
    display: inline;
}
.item-date {
    float: right;
}
</style>



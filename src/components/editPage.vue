<template>
    <!-- 编辑页面 -->
    <div class="container">
        <Form :model="form" :label-width="120">
            <FormItem label="标题">
                <Input v-model="form.title" placeholder="请输入标题"></Input>
            </FormItem>
            <FormItem label="描述">
                <Input v-model="form.desc" placeholder="请输入描述"></Input>
            </FormItem>
            <FormItem label="markdown文件名">
                <Select v-model="form.markdownName">
                    <Option 
                        v-for="option in markdownNameList"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ option.label }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="pic文件名">
                <Select v-model="form.picName">
                    <Option 
                        v-for="option in picNmaeList"
                        :key="option.id"
                        :value="option.id"
                    >
                        {{ option.label }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="时间">
                <DatePicker type="date" placeholder="请选择时间" v-model="form.date"></DatePicker>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import axios from 'axios'
import { dateFormat } from '@util/Date'

const fetchDir = {
    formData: '/api',
    markdownNameList: '/api/getMarkDownList'
}

export default {
    data () {
        return {
            form: {
                title: '',
                desc: '',
                markdownName: '',
                picName: '',
                date: ''
            },
            markdownNameList: [],
            picNmaeList: []
        }
    },
    computed: {
        id () {
            return this.$route.query.id
        }
    },
    mounted () {
        if (this.id) {
            this.getFormData()
        } else {
            this.$set(this.form, 'date', dateFormat(new Date(), 'yyyy-MM-dd'))
        }
        this.getFileList()
    },
    methods: {
        getFormData () {
            axios.get(`${fetchDir.formData}/${this.id}`)
                .then(res => {
                    this.form = res.data
                })
                .catch(error => {
                    this.$Message.error('获取数据失败')
                })
        },
        getFileList () {
            axios.get(`${fetchDir.markdownNameList}`)
                .then(res => {
                    this.markdownNameList = res.data
                })
                .catch(error => {
                    this.$Message.error('获取数据失败')
                })
        }
    }
}
</script>

<style scoped>
.container{
    padding: 30px 0;
}
</style>



<template>
    <!-- 根组件 -->
    <div class="root-container">
        <Layout class="layout">
            <Sider 
                class="sider"
                :width="300">
                <div class="top"></div>
                <div class="avatar">
                    <img :src="avatarUrl"/>
                </div>
                <div class="info">
                    <h1 class="name">
                        {{ info.name }}
                    </h1>
                    <p class="sentence">
                        {{ info.sentence }}
                    </p>
                </div>
                <ul class="nav">
                    <li 
                        v-for="item in navList" 
                        :key="item.title"
                        @click="navClick(item)"
                    >
                        {{ item.title }}
                    </li>
                </ul>
                <div class="social">
                    <Icon
                        class="social-item"
                        v-for="item in socialList"
                        :key="item.link"
                        :type="item.icon"
                        :size="30"
                        @click.native="socialClick(item.link)"
                    />
                </div>
            </Sider>
            <Content class="content">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </Content>
        </Layout>
    </div>
</template>
<script>
export default {
    data () {
        return {
            avatarUrl: '../../static/img/timg.jpg',
            info: {
                name: 'hero',
                sentence: '无它，唯手熟尔'
            },
            navList: [
                {
                    title: '主页',
                    // 路由名
                    routeName: 'mainPage'
                },
                {
                    title: '链接',
                    // 真实路径
                    link: 'https://github.com/zpbc007'
                }
            ],
            socialList: [
                {
                    icon: 'social-github',
                    link: 'https://github.com/zpbc007'
                }
            ]
        }
    },
    methods: {
        navClick (navItem) {
            if (navItem.routeName) {
                this.$router.push({
                    name: navItem.routeName
                })
            } else if (navItem.link) {
                window.location.href = navItem.link
            }
        },
        socialClick (link) {
            window.location.href = link
        }
    }
}
</script>
<style scoped>
.root-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
}
.layout {
    width: 100%;
    height: 100%;
}
.content {
    padding: 0 30px;
}

.sider {
    background-color: rgb(255, 255, 255)
}
.sider .top {
    width: 100%;
    height: 180px;
    background-color: rgb(77, 77, 77) 
}
.sider .avatar {
    margin: 0 auto;
    text-align: center;
    height: 160px;
    overflow: hidden;
    margin-top: -80px;
}
.sider .avatar img {
    border-radius: 300px;
    border: 5px solid rgb(255, 255, 255)
}

.info {
    text-align: center;
}
.info .name {
    color: #696969;
    font-size: 30px;
}
.info .sentence {
    margin-top: 10px;
    font-size: 20px;
}

.nav {
    text-align: center;
    margin-top: 30px;
}
.nav li {
    margin-bottom: 10px;
    font-size: 18px;
    color: #696969;
    font-weight: bold;
    cursor: pointer;
}

.social {
    margin-top: 30px;
    text-align: center;
}
.social-item {
    cursor: pointer;
}
</style>

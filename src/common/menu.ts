// 暂时没有想到有二级菜单的情况先不增加
interface MenuItem {
    // 显示名称
    name: string;
    // 图标
    icon: string;
    // 对应路由
    path: string;
}

// 菜单配置
const menuData: MenuItem[] = [{
    name: '博客',
    icon: 'blog',
    path: 'blog/list',
}, {
    name: '关于我',
    icon: 'about me',
    path: 'blog/about',
}, {
    name: 'tags',
    icon: 'tags',
    path: 'blog/tags',
}, {
    name: '搜索',
    icon: 'search',
    path: 'blog/search',
}];

export {
    menuData,
}
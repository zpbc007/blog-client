interface MenuItem {
    // 显示名称
    name: string;
    // 图标
    icon: string;
    // 对应路由
    path: string;
    exact?: boolean;
}

// 菜单配置
const menuData: MenuItem[] = [{
    name: '博客',
    icon: 'book',
    path: '/blog',
}, {
    name: '关于我',
    icon: 'contacts',
    path: '/blog/about',
}, {
    name: '搜索',
    icon: 'search',
    path: '/blog/search',
}];

export {
    menuData,
    MenuItem,
};
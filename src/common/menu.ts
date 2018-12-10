import { Contacts, Label, Pages, Search } from '@material-ui/icons';

// 暂时没有想到有二级菜单的情况先不增加
interface MenuItem {
    // 显示名称
    name: string;
    // 图标
    icon: React.ComponentType;
    // 对应路由
    path: string;
    exact?: boolean;
}

// 菜单配置
const menuData: MenuItem[] = [{
    name: '博客',
    icon: Pages,
    path: '/blog',
    exact: true,
}, {
    name: '关于我',
    icon: Contacts,
    path: '/blog/about',
}, {
    name: 'tags',
    icon: Label,
    path: '/blog/tags',
}, {
    name: '搜索',
    icon: Search,
    path: '/blog/search',
}];

export {
    menuData,
    MenuItem,
};
import { RouteItem } from 'common/types';
import { ErrorPage } from 'components/error_page';
import { AdminLayout } from './layout/index';
import { AdminList } from './views/admin_list';
import { BlogAdd } from './views/blog_add';
import { BlogEdit } from './views/blog_edit';
import { BlogList } from './views/blog_list';
import { Login } from './views/login';
import { TagList } from './views/tag_list';
import { UserAdd } from './views/user_add';
import { UserEdit } from './views/user_edit';
import { UserList } from './views/user_list';

export const AdminRouterConfig: RouteItem[] = [{
    title: '后台管理',
    path: '/admin',
    component: AdminLayout,
    auth: true,
    routes: [{
        title: '博客列表',
        path: './blog',
        component: BlogList,
    }, {
        title: '编辑博客',
        path: './blog/edit/:id',
        component: BlogEdit,
    }, {
        title: '添加博客',
        path: './blog/add',
        component: BlogAdd,
    }, {
        title: '用户列表',
        path: './user',
        component: UserList,
    }, {
        title: '编辑用户',
        path: './user/edit/:id',
        component: UserEdit,
    }, {
        title: '添加用户',
        path: './user/add',
        component: UserAdd,
    }, {
        title: '标签列表',
        path: './tag',
        component: TagList,
    }, {
        title: '功能列表',
        path: '/',
        exact: true,
        component: AdminList,
    }],
}, {
    title: '登录',
    path: '/login',
    component: Login,
}, {
    path: 'error/:code',
    component: ErrorPage,
}, {
    path: '/',
    exact: true,
    redirect: '/admin',
}, {
    redirect: '/error/404',
}];
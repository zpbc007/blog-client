import { BlogLayout } from 'blog/layout';
import { AboutMe } from 'blog/views/about_me';
import { BlogItem } from 'blog/views/blog_item';
import { BlogList } from 'blog/views/blog_list';
import { RouteItem } from 'common';
import { ErrorPage } from 'components/error_page';

export const BlogRouterConfig: RouteItem[] = [{
    title: '博客',
    path: '/blog',
    component: BlogLayout,
    routes: [{
        path: './about',
        title: '关于我',
        component: AboutMe,
    }, {
        path: './:id',
        component: BlogItem,
    }, {
        path: './',
        title: '博客列表',
        exact: true,
        component: BlogList,
    }],
}, {
    path: 'error/:code',
    component: ErrorPage,
}, {
    path: '/',
    exact: true,
    redirect: '/blog',
}, {
    redirect: '/error/404',
}];
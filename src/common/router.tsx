import { colors, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { ErrorPage } from 'components/error_page';
import TodoPage from 'components/todo_page';
import { MainLayout } from 'layout';
import * as React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import AdminPage from 'views/admin';
import BlogEditPage from 'views/blog_edit';
import BlogItemPage from 'views/blog_item';
import { BlogListPage } from 'views/blog_list';
import LoginPage from 'views/login';
import UserListPage from 'views/user';

// 路由容器
export interface LayoutCompProps {
    routes: RouteItem[];
}

export interface RouteItem {
    path?: string;
    // 浏览器title
    title?: string;
    // 菜单名
    menuText?: string;
    component?: React.ComponentType<any>;
    // 子路由
    routes?: RouteItem[];
    exact?: boolean;
    // 重定向目标
    redirect?: string;
    notShowInMenu?: boolean;
    icon?: React.ComponentType | string;
}

const routeConfig: RouteItem[] = [{
    title: '博客',
    path: 'blog',
    component: MainLayout ,
    routes: [{
        title: '添加',
        path: 'add',
        component: BlogEditPage,
        exact: true,
    }, {
        title: '关于我',
        path: 'about',
        component: BlogEditPage,
        exact: true,
    }, {
        title: '编辑',
        path: 'edit/:id',
        component: BlogEditPage,
        exact: true,
    }, {
        path: ':id',
        component: BlogItemPage,
    }, {
        title: '列表',
        path: '/',
        component: BlogListPage,
        exact: true,
    }],
}, {
    title: '后台管理',
    path: 'admin',
    component: AdminPage,
}, {
    title: '用户管理',
    path: 'user',
    component: UserListPage,
}, {
    title: '登录',
    path: 'login',
    component: LoginPage,
}, {
    title: '测试',
    path: 'playground',
    component: TodoPage,
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

function fixPath(routeArr: RouteItem[], parentPath: string = '/') {
    const reuslt =  routeArr.map(routeItem => {
        let subPath = routeItem.path;
        if (!subPath) { // 404
            return routeItem;
        }
        if (subPath[0] === '/') {
            subPath = subPath.slice(1, subPath.length);
        }
        const curPath = subPath ? `${parentPath}${routeItem.path}/` : `${parentPath}`;

        if (routeItem.routes) {
            routeItem.routes = fixPath(routeItem.routes, curPath);
        }

        return {
            ...routeItem,
            path: curPath,
        };
    });

    console.log('route', reuslt);

    return reuslt;
}

export const RouteWithSubRoutes = (route: RouteItem) => {
    if (route.redirect) {
        return (
            <Redirect
                from={route.path}
                to={route.redirect}
                key={route.path}
            />);
    } else if (route.component) {
        const Comp = route.component;
        const renderFunc = (props: any) => {
            if (route.routes) {
                return (
                    <Comp {...props} routes={route.routes} />
                );
            } else {
                return (
                    <Comp {...props} />
                );
            }
        };
        return (
            <Route
                key={route.path}
                path={route.path}
                render={renderFunc}
            />
          );
    } else {
        throw new Error(`该路由未配置对应组件: ${route.path}`);
    }
};

const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
        primary: colors.blue,
    },
});

const RootNode = () => (
    <BrowserRouter>
        <MuiThemeProvider theme={theme}>
            <Switch>
                {fixPath(routeConfig).map(item => (<RouteWithSubRoutes {...item} key={item.path || ''} />))}
            </Switch>
        </MuiThemeProvider>
    </BrowserRouter>
);

export {
    RootNode,
};
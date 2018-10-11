import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import TodoPage from 'components/todo_page';
import { MainLayout } from 'layout';

// 路由容器
export interface LayoutCompProps {
    routes: RouteItem[];
}

interface RouteItem {
    path: string;
    // 浏览器title
    title?: string;
    component: React.ComponentClass<LayoutCompProps> | React.ComponentClass<any>,
    child?: RouteItem[],
    exact?: boolean;
}

const routeConfig: RouteItem[] = [{
    title: '博客',
    path: 'blog',
    component: MainLayout,
    child: [{
        path: 'list',
        component: TodoPage,
        exact: true,
    }, {
        path: ':id',
        component: TodoPage,
    }]
}, {
    title: '登录',
    path: 'login',
    component: TodoPage,
}, {
    title: '测试',
    path: 'playground',
    component: TodoPage,
}, {
    title: '管理',
    path: 'admin',
    component: TodoPage,
}];

function fixPath(routeArr: RouteItem[], parentPath: string = '/') {
    return routeArr.map(routeItem => {
        const curPath = `${parentPath}${routeItem.path}/`;

        if (routeItem.child) {
            routeItem.child = fixPath(routeItem.child, curPath)
        }

        return {
            ...routeItem,
            path: `${parentPath}${routeItem.path}/`
        };
    })
}

const RouteWithSubRoutes = (route: RouteItem) => (
    <Route
      path={route.path}
      render={props => {
        if (route.child) {
            return (
                <route.component {...props} routes={route.child} />
            );
        } else {
            return (
                <route.component {...props} />
            );
        }
      }}
    />
  );

const RootNode = () => (
    <BrowserRouter>
        <Switch>
            {fixPath(routeConfig).map((item, index) => <RouteWithSubRoutes {...item} key={item.path} />)}
        </Switch>
    </BrowserRouter>
)

export {
    RootNode,
}
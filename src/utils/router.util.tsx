import { RouteItem } from 'common';
import * as React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import * as UrlUtil from 'url';

/**
 * 将子路由路径拼接到父级上
 */
function formatRoute(routerArr: RouteItem[], parentPath: string = '/') {
    return routerArr.map(routeItem => {
        if (!routeItem.path) { // 无路1径（404页面）不作做处理
            return routeItem;
        }

        const curPath = UrlUtil.resolve(parentPath, routeItem.path);

        if (routeItem.routes) {
            routeItem.routes = formatRoute(routeItem.routes, `${curPath}/`);
        }

        return {
            ...routeItem,
            path: curPath,
        };
    });
}

// 渲染路由
const RouteWithSubRoutes = (route: RouteItem) => {
    const {
        component,
        routes,
        redirect,
        path,
        exact,
        title,
    } = route;

    if (!component && !redirect) {
        throw new Error(`路由未配置组件: ${path}`);
    }

    let Comp: any;
    const compPros: any = {
        routes,
        title,
    };

    if (redirect) {
        Comp = Redirect;
        compPros.to = redirect;
    } else {
        Comp = component;
    }

    return (
        <Route
            key={path || ''}
            path={path}
            exact={exact || false}
            // tslint:disable-next-line:jsx-no-lambda
            render={props => (
                <Comp
                    {...compPros}
                    {...props}
                />
            )}
        />
    );
};

// 根节点
const RouteNode = ({ routeConfig }: {routeConfig: RouteItem[]}) => {
    const routeList = formatRoute(routeConfig);
    console.log('route', routeList);
    return (
        <HashRouter>
            <Switch>
                {routeList.map(item => (
                    <RouteWithSubRoutes
                        key={item.path || ''}
                        {...item}
                    />
                ))}
            </Switch>
        </HashRouter>
    );
};

export {
    formatRoute,
    RouteWithSubRoutes,
    RouteNode,
};
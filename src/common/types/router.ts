import * as React from 'react';

export interface RouteItem {
    // 匹配路径
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
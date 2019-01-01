import { LoginToken } from 'common/const';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { isLogin } from 'service/user.service';
import { Normalize } from 'styled-normalize';
import { RouteNode } from 'utils/router.util';
import { AdminRouterConfig } from './router.config';

// 校验当前用户
isLogin().then((auth) => {
    if (!auth) {
        window.localStorage.removeItem(LoginToken);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    ReactDom.render(
        <React.Fragment>
            <Normalize />
            <RouteNode routeConfig={AdminRouterConfig} />
        </React.Fragment>,
        document.getElementById('app'),
    );
});
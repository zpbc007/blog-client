import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Normalize } from 'styled-normalize';
import { RouteNode } from 'utils/router.util';
import { BlogRouterConfig } from './router.config';

document.addEventListener('DOMContentLoaded', async () => {
    ReactDom.render(
        <React.Fragment>
            <Normalize />
            <div>
                <RouteNode routeConfig={BlogRouterConfig} />
            </div>
        </React.Fragment>,
        document.getElementById('app'),
    );
});
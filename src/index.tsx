import { RootNode } from 'common/router';
import 'normalize.css';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Normalize } from 'styled-normalize';

document.addEventListener('DOMContentLoaded', () => {
    ReactDom.render(
        <React.Fragment>
            <Normalize />
            <RootNode />
        </React.Fragment>,
        document.getElementById('app'),
    );
});
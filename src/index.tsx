import * as React from 'react';
import * as ReactDom from 'react-dom';
import { RootNode } from 'common/router';

document.addEventListener('DOMContentLoaded', () => {
    ReactDom.render(
        <RootNode />,
        document.getElementById('app')
    );
})
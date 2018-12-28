import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Normalize } from 'styled-normalize';

document.addEventListener('DOMContentLoaded', async () => {
    ReactDom.render(
        <React.Fragment>
            <Normalize />
            <div>
                blog2
            </div>
        </React.Fragment>,
        document.getElementById('app'),
    );
});
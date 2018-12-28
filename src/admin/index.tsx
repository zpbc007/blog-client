import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Normalize } from 'styled-normalize';

document.addEventListener('DOMContentLoaded', async () => {
    ReactDom.render(
        <React.Fragment>
            <Normalize />
            <div>
                admin1
            </div>
        </React.Fragment>,
        document.getElementById('app'),
    );
});
import { RootNode } from 'common/router';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { isLogin } from 'service/user.service';
import { Normalize } from 'styled-normalize';

export const LoginContext = React.createContext({isLogin: false});

document.addEventListener('DOMContentLoaded', async () => {
    const res = await isLogin() || false;

    ReactDom.render(
        <React.Fragment>
            <Normalize />
            <LoginContext.Provider value={{isLogin: res}}>
                <RootNode />
            </LoginContext.Provider>
        </React.Fragment>,
        document.getElementById('app'),
    );
});
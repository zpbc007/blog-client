import { RootNode } from 'common/router';
import 'normalize.css';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isLogin } from 'service/user';
import { Normalize } from 'styled-normalize';

export const LoginContext = React.createContext({isLogin: false});

document.addEventListener('DOMContentLoaded', async () => {
    const res = await isLogin() || false;

    ReactDom.render(
        <React.Fragment>
            <Normalize />
            <LoginContext.Provider value={{isLogin: true}}>
                <RootNode />
            </LoginContext.Provider>
            <ToastContainer autoClose={10000} />
        </React.Fragment>,
        document.getElementById('app'),
    );
});
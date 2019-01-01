import { LoginToken } from 'common/const';
import * as React from 'react';
import { Redirect } from 'react-router-dom';

export class AuthRouter extends React.PureComponent {
    render() {
        const token = window.localStorage.getItem(LoginToken);

        return token ? this.props.children : (
            <Redirect to='/login' />
        );
    }
}
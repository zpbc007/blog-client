import { withStoreIns } from 'hoc/withStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { compose } from 'recompose';
import { LoginStore, loginStoreIns } from './login.store';
import WrappedLoginForm from './login_form';

interface InnerProps {
    store: LoginStore;
}

@observer
export class Login extends React.Component<InnerProps> {
    handleSubmit = () => {

    }

    render() {
        const { account, password, onFieldsChange } = this.props.store;

        return (
            <div>
                <WrappedLoginForm
                    account={account}
                    password={password}
                    onFieldsChange={onFieldsChange}
                />
            </div>
        );
    }
}

export default compose<any, InnerProps>(
    withStoreIns(loginStoreIns),
)(Login);
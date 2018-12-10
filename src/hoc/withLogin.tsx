import { LoginContext } from 'index';
import * as React from 'react';

export interface WithLoginProps {
    isLogin: boolean;
}

export const withLogin = <P extends WithLoginProps>(BaseComponent: React.ComponentClass<P>) =>
    class extends React.PureComponent<P> {
        render() {
            return (
                <LoginContext.Consumer>
                    {({ isLogin }) => {
                        return (
                            <BaseComponent
                                {...this.props}
                                isLogin={isLogin}
                            />
                        );
                    }}
                </LoginContext.Consumer>
            );
        }
    };
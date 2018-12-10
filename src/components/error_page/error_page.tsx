import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

export class ErrorPage extends React.PureComponent<RouteComponentProps<{code: string}>> {
    render() {
        const { match: { params } } = this.props,
            errorCode = params.code;

        return (
            <div>
                错误：{errorCode}
            </div>
        );
    }
}

export default withRouter(ErrorPage);
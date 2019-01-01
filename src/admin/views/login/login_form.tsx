import { Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';

interface OuterPorpsInterface {
    onFieldsChange: (formValue: object) => void;
    account: string;
    password: string;
}

interface InnerPropsInterface extends OuterPorpsInterface, FormComponentProps{}

class LoginForm extends React.PureComponent<InnerPropsInterface> {
    handleSubmit = () => {

    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                    {getFieldDecorator('account', {
                        rules: [{}],
                    })(<Input prefix={<Icon type='user' />} placeholder='账户' />)}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{}],
                    })(<Input prefix={<Icon type='user' />} placeholder='密码' />)}
                </Form.Item>
            </Form>
        );
    }
}

const handleFieldChange = ({ onFieldsChange }: OuterPorpsInterface, changedFields: object) => {
    onFieldsChange(changedFields);
};

const mapPropsToFields = ({account = '', password = '123'}: OuterPorpsInterface) => {
    return {
        account: Form.createFormField({value: account}),
        password: Form.createFormField({value: password}),
    };
};

const WrappedLoginForm = Form.create<OuterPorpsInterface>({
    onFieldsChange: handleFieldChange,
    mapPropsToFields,
})(LoginForm);

export default WrappedLoginForm;
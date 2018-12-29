import { TextField } from '@material-ui/core';
import * as React from 'react';
import { ResetPassModel } from 'service/user.service';
import styled from 'styled-components';
import { CheckResult, getDefaultCheckResult } from 'type/form';
import { RestPassModel } from './user_list.store';

interface PropsInterface {
    // 初始值
    formValue?: ResetPassModel;
}

interface StateInterface {
    model: any;
    formError: {
        password: CheckResult;
        confirm_password: CheckResult;
    };
    formValue: ResetPassModel;
}

const Form = styled.form``;
const StyledTextField = styled(TextField)`` as typeof TextField;

export class UserResetPass extends React.PureComponent<PropsInterface, StateInterface> {
    constructor(props: PropsInterface) {
        super(props);

        this.state = {
            model: RestPassModel,
            formError: this.getDefaultError(),
            formValue: props.formValue || {
                password: '',
                confirm_password: '',
            },
        };
    }

    /**
     * public api 获取form中的值
     */
    getFormValue = () => {
        const { formValue, model } = this.state;
        const result = model.check(formValue);
        this.setState({
            formError: result,
        });
        for (const key in result) {
            if (result.hasOwnProperty(key)) {
                if (result[key].hasError) {
                    return {
                        result: false,
                    };
                }
            }
        }
        return {
            result: true,
            data: formValue,
        };
    }

    getDefaultError = () => {
        return {
            password: getDefaultCheckResult(),
            confirm_password: getDefaultCheckResult(),
        };
    }

    /**
     * 清空错误信息
     */
    clearError = () => {
        this.setState({
            formError: this.getDefaultError(),
        });
    }

    /**
     * 字段值发生改变
     */
    handleFieldChange = ({ currentTarget }: React.ChangeEvent<HTMLInputElement>) => {
        const { formValue, model, formError } = this.state;
        const field = currentTarget.getAttribute('data-field') as string,
            value = currentTarget.value,
            newValue = {
                ...formValue,
                [field]: value,
            };

        this.setState({
            formValue: newValue,
        });

        const checkResult = model.checkForField(field, value, newValue);

        this.setState({
            formError: {
                ...formError,
                [field]: checkResult,
            },
        });
    }

    render() {
        const {
            password,
            confirm_password,
        } = this.state.formValue;
        const {
            password: passwordError,
            confirm_password: confirmPasswordError,
        } = this.state.formError;

        return (
            <Form>
                <StyledTextField
                    label='密码'
                    value={password}
                    error={passwordError.hasError}
                    helperText={passwordError.errorMessage}
                    onChange={this.handleFieldChange}
                    required={true}
                    fullWidth={true}
                    inputProps={{
                        'data-field': 'password',
                    }}
                />
                <StyledTextField
                    label='确认密码'
                    value={confirm_password}
                    error={confirmPasswordError.hasError}
                    helperText={confirmPasswordError.errorMessage}
                    onChange={this.handleFieldChange}
                    required={true}
                    fullWidth={true}
                    inputProps={{
                        'data-field': 'confirm_password',
                    }}
                />
            </Form>
        );
    }
}
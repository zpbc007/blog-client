import { IconButton, InputAdornment, Snackbar } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { LoginToken } from 'common/const';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { config, Spring } from 'react-spring';
import { toast } from 'react-toastify';
import { SchemaModel, StringType } from 'rsuite-schema';
import { login } from 'service/user';
import { CheckResult } from 'type/form';
import {
    BottomBg,
    Footer,
    Form,
    FormHeader,
    FormWrapper,
    LoginWrapper,
    StyledCircular,
    StyledTextField,
    SubmitButton,
    SubmitButtonWrapper,
    Topbg,
} from './styled';

interface StateInterface {
    // 显示密码
    showPassword: boolean;
    loading: boolean;
    model: any;
    form: {
        // 用户名
        account: string;
        // 密码
        password: string;
    };
    formError: {
        account: CheckResult;
        password: CheckResult;
    };
}

// 登录页面
export class Login extends React.PureComponent<RouteComponentProps, StateInterface> {
    constructor(props: any) {
        super(props);

        this.state = {
            model: SchemaModel({
                account: StringType()
                    .minLength(6, '不能少于6位')
                    .maxLength(16, '不能超过16位')
                    .isRequired('用户名不能为空'),
                password: StringType()
                    .minLength(6, '不能少于6位')
                    .maxLength(16, '不能超过16位')
                    .isRequired('密码不能为空'),
            }),
            loading: false,
            showPassword: false,
            form: {
                account: '',
                password: '',
            },
            formError: {
                account: { hasError: false },
                password: { hasError: false },
            },
        };
    }

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading,
        });
    }

    handleSubmit = async () => {
        const { model, form: { account, password }} = this.state;
        const { history } = this.props;

        const result = model.check({
            account,
            password,
        });

        this.setState({
            formError: result,
        });

        for (const key in result) {
            if (result.hasOwnProperty(key)) {
                if (result[key].hasError) {
                    toast.error('校验出错，请核对后，重新填写。');
                    return;
                }
            }
        }

        this.toggleLoading();
        const res = await login({
            account,
            password,
        }).catch(e => {
            toast.error(e.message);
        });
        this.toggleLoading();

        if (res) {
            const { data, msg } = res.data;
            msg && toast.success(msg);
            window.localStorage.setItem(LoginToken, data);
            history.push('/admin');
        } else {
            toast.error('出现错误');
        }
    }

    handleFieldChange = ({ currentTarget }: React.ChangeEvent<HTMLInputElement>) => {
        const field = currentTarget.getAttribute('data-field') as string,
            value = currentTarget.value;
        const { form, model, formError } = this.state;

        this.setState({
            form: {
                ...form,
                [field]: value,
            },
        } as any);

        const checkResult = model.checkForField(field, value);

        this.setState({
            formError: {
                ...formError,
                [field]: checkResult,
            },
        });
    }

    togglePassState = () => {
        this.setState({
            showPassword: !this.state.showPassword,
        });
    }

    render() {
        const {
            showPassword,
            loading,
            form: { account, password },
            formError: { account: accountError, password: passwordError },
        } = this.state;

        return (
            <LoginWrapper>
                <Spring
                    config={config.slow}
                    from={{ x: -50}}
                    to={{ x: 0}}
                >
                    {props => (
                        <Topbg x={props.x} />
                    )}
                </Spring>
                <Spring
                    config={config.slow}
                    from={{x: 50}}
                    to={{x: 0}}
                >
                    {props => (
                        <BottomBg x={props.x} />
                    )}
                </Spring>
                <Spring
                    config={config.slow}
                    from={{opacity: 0}}
                    to={{opacity: 1}}
                >
                    {props => (
                        <FormWrapper opacity={props.opacity}>
                            <FormHeader>
                                <h1>
                                    欢迎登录
                                </h1>
                            </FormHeader>
                            <Form>
                                <StyledTextField
                                    label='用户名'
                                    value={account}
                                    error={accountError.hasError}
                                    helperText={accountError.errorMessage}
                                    onChange={this.handleFieldChange}
                                    required={true}
                                    fullWidth={true}
                                    inputProps={{
                                        'data-field': 'account',
                                    }}
                                    disabled={loading}
                                />
                                <StyledTextField
                                    label='密码'
                                    value={password}
                                    error={passwordError.hasError}
                                    helperText={passwordError.errorMessage}
                                    onChange={this.handleFieldChange}
                                    required={true}
                                    fullWidth={true}
                                    type={showPassword ? 'text' : 'password'}
                                    inputProps={{
                                        'data-field': 'password',
                                    }}
                                    disabled={loading}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment
                                                position='end'
                                            >
                                                <IconButton
                                                    onClick={this.togglePassState}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <SubmitButtonWrapper>
                                    <SubmitButton
                                        onClick={this.handleSubmit}
                                        variant='contained'
                                        disabled={loading}
                                    >
                                        Primary
                                    </SubmitButton>
                                    {loading && <StyledCircular size={24} />}
                                </SubmitButtonWrapper>
                            </Form>
                            <Footer>
                                Powered by zp
                            </Footer>
                        </FormWrapper>
                    )}
                </Spring>
            </LoginWrapper>
        );
    }
}

export default withRouter(Login);
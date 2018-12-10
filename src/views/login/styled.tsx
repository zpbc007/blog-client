import { Button, CircularProgress, TextField } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';

const FontColor = '#ffd256';
const BgColor = '#1ab3d7';
const BgBrightColor = '#fdffff';
const BgDeepColor = '#0688a7';

// 外层容器
const LoginWrapper = styled.div`
    background: #ebebeb;
    width: 100%;
    height: 100vh;
    position: relative;
    min-width: 480px;
    font-family: 'PT Sans', sans-serif;
`;

const Bg = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;

    &::before {
        content: ' ';
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: ${BgColor};
        box-shadow: 0px 0px 20px #89898a;
    }
`;

const Topbg = styled(Bg)<{x: number}>`
    &::before {
        border-bottom: 30px solid ${BgDeepColor};
        transform: skewY(45deg) translateY(-100%) translateX(${props => `${props.x}%`});
    }
`;

const BottomBg = styled(Bg)<{x: number}>`
    &::before {
        border-top: 30px solid ${BgDeepColor};
        transform: skewY(45deg) translateY(100%) translateX(${props => `${props.x}%`});
    }
`;

const FormWrapper = styled.div<{opacity: number}>`
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    color: ${FontColor};
    border-radius: .25em .25em .4em .4em;
    width: 420px;
    opacity: ${props => props.opacity}
`;

const FormHeader = styled.div`
    padding: 30px;
    background: ${BgColor};
    opacity: 0.7;
`;

const Form = styled.form`
    padding: 30px;
    padding-top: 60px;
    background: ${BgBrightColor};
`;

const StyledTextField = styled(TextField)`
    && {
        margin-bottom: 45px;
    }
` as typeof TextField;

const SubmitButtonWrapper = styled.div`
    position: relative;
`;

const SubmitButton = styled(Button)`
    && {
        background-color: ${BgColor};
        color: ${FontColor};

        &&:hover {
            background-color: ${BgDeepColor};
        }
    }
`;

const StyledCircular = styled(CircularProgress)`
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -12px;
    margin-left: -12px;
`;

const Footer = styled.div`
    padding: 10px;
    line-height: 25px;
    background: ${BgColor};
`;

export {
    LoginWrapper,
    Topbg,
    BottomBg,
    FormWrapper,
    FormHeader,
    Form,
    StyledTextField,
    SubmitButtonWrapper,
    StyledCircular,
    SubmitButton,
    Footer,
};
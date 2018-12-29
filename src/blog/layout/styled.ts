import { Icon, Layout } from 'antd';
import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
    && {
        min-height: 100vh;
    }
`;

const InnerLayout = styled(Layout)`
    && {
        min-width: 400px;
    }
`;

const StyledHeader = styled(Header)`
    && {
        background: #fff;
        padding: 0;
    }
`;

const ToggleBtn = styled(Icon)`
    && {
        font-size: 18px;
        line-height: 64px;
        padding: 0 24px;
        cursor: pointer;
        transition: color .3s;
    }

    &&:hover {
        color: #1890ff;
    }
`;

const ContentWrapper = styled.div`
    margin: 24px;
`;

const StyledFooter = styled(Footer)`
    text-align: center;
`;

const FooterLink = styled(Link)`
    color: rgba(0, 0, 0, 0.45);
`;

export {
    StyledLayout,
    StyledHeader,
    ToggleBtn,
    ContentWrapper,
    InnerLayout,
    StyledFooter,
    FooterLink,
};
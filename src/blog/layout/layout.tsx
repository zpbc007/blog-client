import { Icon, Layout, Menu } from 'antd';
import { menuData } from 'blog/menu.config';
import { RouteItem } from 'common/types';
import { MenuConfig } from 'config';
import { withStoreIns } from 'hoc/withStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Link, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { RouteWithSubRoutes } from 'utils/router.util';
import { Brand } from './brand';
import { LayoutStore, layoutStoreIns } from './layout.store';
import {
    ContentWrapper,
    FooterLink,
    InnerLayout,
    StyledFooter,
    StyledHeader,
    StyledLayout,
    ToggleBtn,
} from './styled';
const { Sider, Content } = Layout;

interface OuterInterface extends RouteComponentProps {
    routes: RouteItem[];
}

interface InnerInterface extends OuterInterface {
    store: LayoutStore;
}

@observer
export class BlogLayout extends React.Component<InnerInterface> {
    render() {
        return (
            <StyledLayout>
                {this.renderSider()}
                <InnerLayout>
                    {this.renderHeader()}
                    <Content>
                        {this.renderContent()}
                    </Content>
                    <StyledFooter>
                        {this.renderFooter()}
                    </StyledFooter>
                </InnerLayout>
            </StyledLayout>
        );
    }

    renderSider = () => {
        const { collapsed } = this.props.store;

        return (
            <Sider
                width='256'
                trigger={null}
                collapsible={true}
                collapsed={collapsed}
            >
                {this.renderBrand()}
                {this.renderMenu()}
            </Sider>
        );
    }

    renderHeader = () => {
        const { collapsed, toggleCollapsed } = this.props.store;
        return (
            <StyledHeader>
                <ToggleBtn
                    type={collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={toggleCollapsed}
                />
            </StyledHeader>
        );
    }

    renderBrand = () => {
        const { collapsed, menuText, textFrom } = this.props.store;

        return (
            <Brand
                open={!collapsed}
                avatar={MenuConfig.avatar}
                nickName={MenuConfig.nickname}
                text={menuText}
                textFrom={textFrom}
            />
        );
    }

    renderMenu = () => {
        const { pathname } = this.props.location;

        return (
            <Menu
                theme='dark'
                mode='inline'
                selectedKeys={[pathname]}
            >
                {menuData.map(({ path, icon, name }) => {
                    return (
                        <Menu.Item key={path}>
                            <Link
                                to={path}
                                replace={path === pathname}
                            >
                                <Icon type={icon} />
                                <span>{name}</span>
                            </Link>
                        </Menu.Item>
                    );
                })}
            </Menu>
        );
    }

    renderContent = () => {
        const { routes } = this.props;
        return (
            <ContentWrapper>
                <Switch>
                    {routes && routes.map(route => RouteWithSubRoutes(route))}
                </Switch>
            </ContentWrapper>
        );
    }

    renderFooter = () => {
        return (
            <FooterLink to='/'>
                赵鹏の博客
            </FooterLink>
        );
    }

    componentDidMount() {
        this.props.store.fetchOneWord();
    }
}

export default compose<InnerInterface, OuterInterface>(
    withRouter,
    withStoreIns(layoutStoreIns),
)(BlogLayout);
import { AppBar, IconButton, Toolbar, withWidth } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { isWidthUp } from '@material-ui/core/withWidth';
import { ChevronLeft, ChevronRight, Menu as MenuIcon } from '@material-ui/icons';
import { menuData } from 'common/menu';
import { RouteItem, RouteWithSubRoutes } from 'common/router';
import { SideBar } from 'components/sidebar';
import { MenuConfig } from 'config';
import * as React from 'react';
import { RouteComponentProps, Switch } from 'react-router-dom';
import { transition } from 'style';
import styled from 'styled-components';
import { getWord } from 'utils/one_word';
import { LeftBarWidth } from './const';

// 主容器
const LayoutWrapper = styled.div`
    position: relative;
    height: 100vh;
    background-color: #f4f4f4;
`;

// 右侧内容容器根据当前状态计算宽度
const MainPanel = styled.div<{width: number}>`
    width: calc(100% - ${props => props.width}px);
    float: right;
    height: 100vh;
    overflow: hidden;
    position: relative;
    transition: ${transition('width')};
    display: flex;
    flex-direction: column;
`;

const ContentWrapper = styled.div`
    padding: 88px 24px 0;
    flex: 1 1 auto;
    overflow: auto;
`;

const FooterWrapper = styled.footer`
    flex: 0 0 auto;
    text-align: center;
    color: rgba(0, 0, 0, 0.45);
    font-size: 0.5em;
`;

const StyledAppBar = styled(AppBar)<{left: number}>`
    && {
        left: ${props => props.left}px;
        transition: ${transition('left')};
    }
`;

interface PropsInterface extends RouteComponentProps {
    width: Breakpoint;
    routes: RouteItem[];
}

interface StateInterface {
    sideBarOpen: boolean;
    menuText: string;
    textFrom: string;
}

export class MainLayout extends React.Component<PropsInterface, StateInterface> {
    constructor(props: PropsInterface) {
        super(props);

        this.state = {
            sideBarOpen: true,
            menuText: '',
            textFrom: '',
        };
    }

    handleToggleClick = () => {
        this.setState({
            ...this.state,
            sideBarOpen: !this.state.sideBarOpen,
        });
    }

    handleDrawwerToggle = (open: boolean) => () => {
        this.setState({
            ...this.state,
            sideBarOpen: open,
        });
    }

    async componentDidMount() {
        const { text, from } = await getWord();

        this.setState({
            menuText: text,
            textFrom: from,
        });
    }

    render() {
        const { sideBarOpen, menuText, textFrom } = this.state;
        const { width, routes } = this.props;

        const sideBarWidth = sideBarOpen ? LeftBarWidth.normal : LeftBarWidth.min,
            isWidthUpMd = isWidthUp('md', width),
            sideBarPageWidth = isWidthUpMd ? sideBarWidth : 0;

        const CurIcon = isWidthUpMd ? (sideBarOpen ? ChevronLeft : ChevronRight) : MenuIcon;

        return (
            <LayoutWrapper>
                <SideBar
                    open={sideBarOpen}
                    handleDrawwerToggle={this.handleDrawwerToggle}
                    width={sideBarWidth}
                    link='/'
                    avatar={MenuConfig.avatar}
                    nickName={MenuConfig.nickname}
                    menuList={menuData}
                    text={menuText}
                    textFrom={textFrom}
                />
                <MainPanel
                    width={sideBarPageWidth}
                >
                    <StyledAppBar left={sideBarPageWidth}>
                        <Toolbar>
                            <IconButton onClick={this.handleToggleClick}>
                                <CurIcon/>
                            </IconButton>
                        </Toolbar>
                    </StyledAppBar>
                    <ContentWrapper>
                        <Switch>
                            {routes && routes.map(route => RouteWithSubRoutes(route))}
                        </Switch>
                    </ContentWrapper>
                    <FooterWrapper>
                        赵鹏の博客
                    </FooterWrapper>
                </MainPanel>
            </LayoutWrapper>
        );
    }
}

export default withWidth()(MainLayout);
import { Button, withWidth } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { isWidthUp } from '@material-ui/core/withWidth';
import { menuData } from 'common/menu';
import { RouteItem } from 'common/router';
import { SideBar } from 'components/sidebar';
import { MenuConfig } from 'config';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { LeftBarWidth } from './const';

// 主容器
const LayoutWrapper = styled.div`
    position: relative;
    height: 100vh;
`;
// 右侧内容容器根据当前状态计算宽度
const MainPanel = styled.div<{width: number}>`
    width: calc(100% - ${props => props.width}px);
    float: right;
    height: 100vh;
    overflow: auto;
    transition-property: width;
    transition-duration: .2s;
    transition-timing-function: linear;
`;

interface PropsInterface extends RouteComponentProps {
    width: Breakpoint;
}

interface StateInterface {
    sideBarOpen: boolean;
}

export class MainLayout extends React.Component<PropsInterface, StateInterface> {
    constructor(props: PropsInterface) {
        super(props);

        this.state = {
            sideBarOpen: true,
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

    render() {
        const { sideBarOpen } = this.state;
        const { width } = this.props;

        const sideBarWidth = sideBarOpen ? LeftBarWidth.normal : LeftBarWidth.min;

        return (
            <LayoutWrapper>
                <SideBar
                    open={sideBarOpen}
                    handleDrawwerToggle={this.handleDrawwerToggle}
                    width={sideBarWidth}
                    link='/'
                    avatar={MenuConfig.avatar}
                    nickName={MenuConfig.nickname}
                    text={'一言'}
                    menuList={menuData}
                />
                <MainPanel
                    width={isWidthUp('md', width) ? sideBarWidth : 0}
                >
                    <div className='header'>
                        <Button
                            onClick={this.handleToggleClick}
                        >
                            切换
                        </Button>
                    </div>
                    <div className='content'>内容</div>
                    <div>页脚</div>
                </MainPanel>
            </LayoutWrapper>
        );
    }
}

export default withWidth()(MainLayout);
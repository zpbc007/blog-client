import {
    Divider,
    Drawer,
    Hidden,
    Icon,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer,
    Theme,
    withTheme,
} from '@material-ui/core';
import { MenuItem } from 'common/menu';
import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { transition } from 'style';
import styled from 'styled-components';
import { Omit } from 'utils/type_utils';
import { Brand, BrandProps } from '.';

interface PropsInterface extends Omit<BrandProps, 'onClick'> {
    // 侧边栏状态
    open: boolean;
    handleDrawwerToggle: (state: boolean) => () => void;
    // 侧边栏宽度
    width: number;
    // 头像点击跳转url
    link: string;
    menuList: MenuItem[];
    theme: Theme;
}

const MenuWrapper = styled.div<{width: number}>`
    width: ${props => props.width}px;
    transition: ${transition('width')};
`;

const ModalProps = {
    // div始终在dom中 优化在手机上的性能
    keepMounted: true,
};

// 对当前匹配连接高亮显示
const StyledNavLink = styled(({activeColor, ...props}: any) => <NavLink {...props} />)<{activeColor: string}>`
    &.${(props) => props.activeClassName}>div {
        background-color: ${(props) => props.activeColor};
    }
    text-decoration: none;
`;

//
const StyledListItem = styled(ListItem)`
    overflow-x: hidden;
    white-space: nowrap;
`;

/** 响应式侧边栏 */
class SideBar extends React.Component<PropsInterface> {
    handleBrandClick = () => {
        console.log('brand click');
    }
    render() {
        const {
            open,
            handleDrawwerToggle,
            avatar,
            nickName,
            text,
            textFrom,
            width,
            menuList,
            theme,
        } = this.props;

        const BrandContent = (
            <MenuWrapper width={width}>
                <Brand
                    avatar={avatar}
                    nickName={nickName}
                    text={text}
                    textFrom={textFrom}
                    onClick={this.handleBrandClick}
                    open={open}
                />
                <Divider />
                <List>
                    {menuList.map((item) => {
                        return (
                            <StyledNavLink
                                key={item.name}
                                to={item.path}
                                activeClassName='active'
                                activeColor={theme.palette.primary.main}
                            >
                                <StyledListItem
                                    button={true}
                                >
                                    <ListItemIcon>
                                        <item.icon />
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </StyledListItem>
                            </StyledNavLink>
                        );
                    })}
                </List>
            </MenuWrapper>
        );

        return (
            <div>
                {/* 小屏幕 可点击展开侧边栏 */}
                <Hidden mdUp={true}>
                    <SwipeableDrawer
                        variant='temporary'
                        anchor='left'
                        open={open}
                        onClose={handleDrawwerToggle(false)}
                        onOpen={handleDrawwerToggle(true)}
                        ModalProps={ModalProps}
                    >
                        {BrandContent}
                    </SwipeableDrawer>
                </Hidden>
                <Hidden smDown={true}>
                    <SwipeableDrawer
                        anchor='left'
                        variant='permanent'
                        open={open}
                        onClose={handleDrawwerToggle(false)}
                        onOpen={handleDrawwerToggle(true)}
                    >
                        {BrandContent}
                    </SwipeableDrawer>
                </Hidden>
            </div>
        );
    }
}

export default withTheme()(SideBar);